# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from schemas import PCOSInput
# # from model_utils import predict_pcos
# # app = FastAPI(title="PCOS Prediction API")

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # @app.get("/")
# # def home():
# #     return {"message": "PCOS Prediction Backend Running"}

# # @app.post("/predict")
# # def predict(data: PCOSInput):
# #     result = predict_pcos(data)
# #     return result

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware

# from schemas import PCOSInput
# from model_utils import predict_pcos


# app = FastAPI(title="PCOS Prediction API")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/")
# def home():
#     return {"message": "PCOS Prediction Backend Running"}


# @app.post("/predict")
# def predict(data: PCOSInput):
#     try:
#         print("Received prediction data:")
#         print(data.model_dump())

#         result = predict_pcos(data)

#         print("Prediction result:")
#         print(result)

#         return result

#     except Exception as error:
#         print("Prediction backend error:")
#         print(type(error).__name__, str(error))

#         raise HTTPException(
#             status_code=500,
#             detail=f"{type(error).__name__}: {str(error)}",
#         )


import os
import shutil
import json
import time

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware

from schemas import PCOSInput
from model_utils import predict_pcos
from xai_utils import explain_pcos_prediction
from chatbot.rag import PCOSRAG
from google import genai
from google.genai import types
from dotenv import load_dotenv
from chatbot.auth import get_current_user_id
from chatbot.private_store import PrivateDocumentStore
from uuid import uuid4
from chatbot.image_processor import image_to_documents
from groq import Groq

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not configured."
    )

meal_client = genai.Client(
    api_key=GEMINI_API_KEY
)


# Groq fallback client for meal image analysis
groq_api_key = os.getenv("GROQ_API_KEY")

groq_client = (
    Groq(api_key=groq_api_key, timeout=20.0, max_retries=0)
    if groq_api_key
    else None
)



app = FastAPI(title="PCOS Prediction API")
# Initialize PCOS RAG chatbot
rag = PCOSRAG()
private_store = PrivateDocumentStore()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "PCOS Prediction Backend Running"
    }


@app.post("/predict")
def predict(data: PCOSInput):
    try:
        print("Received prediction data:")
        print(data.model_dump())

        # Existing PCOS prediction
        result = predict_pcos(data)

        # SHAP-based explanation
        xai_result = explain_pcos_prediction(data)

        # Attach explainability data
        result["xai"] = xai_result

        print("Prediction completed successfully.")

        return result

    except Exception as error:
        print("Prediction backend error:")
        print(type(error).__name__, str(error))

        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        )

@app.post("/chat")
async def chat(
    data: dict,
    user_id: str = Depends(get_current_user_id),
):
    try:
        question = data.get("question")

        if not question or not question.strip():
            raise HTTPException(
                status_code=400,
                detail="Please enter a question.",
            )

        print("Chatbot question received:")
        print(question)

        private_docs = private_store.get_user_documents(
         user_id=user_id,
         question=question,
        )
        
        if private_docs:
             private_context = "\n\n".join(
             doc.page_content for doc in private_docs
        )

             combined_question = f"""
             User's question:
             {question}

             Relevant information from the user's uploaded medical documents:
             {private_context}

             Use this information when answering the user's question.
             If the documents do not contain the answer, do not invent details.
             """

             answer = rag.ask(combined_question)
        else:
             answer = rag.ask(question)


        return {
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Chatbot backend error:")
        print(type(error).__name__, str(error))

        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        )

SUPPORTED_UPLOAD_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}

MAX_DOCUMENT_SIZE = 10 * 1024 * 1024

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    try:
        # Validate supported document formats
        extension = os.path.splitext(file.filename or "")[1].lower()

        if extension not in SUPPORTED_UPLOAD_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only PDF, JPG, JPEG, PNG, and WebP files are allowed.",
            )

        # Create upload folder if it does not exist
        upload_dir = os.path.join(
         os.path.dirname(__file__),
         "user_documents",
         user_id,
        )

        os.makedirs(upload_dir, exist_ok=True)

        
        # Read uploaded PDF
        content = await file.read()

        # Check file size (maximum 10 MB)
        MAX_PDF_SIZE = 10 * 1024 * 1024

        if len(content) > MAX_PDF_SIZE:
            raise HTTPException(
                status_code=413,
                detail="PDF file is too large. Maximum allowed size is 10 MB."
            )

        
        # Validate the uploaded file's format
        if extension == ".pdf":
            valid_file = content.startswith(b"%PDF-")

        elif extension in [".jpg", ".jpeg"]:
            valid_file = content.startswith(b"\xff\xd8\xff")

        elif extension == ".png":
            valid_file = content.startswith(b"\x89PNG\r\n\x1a\n")

        elif extension == ".webp":
            valid_file = (
                content.startswith(b"RIFF")
                and content[8:12] == b"WEBP"
            )

        else:
            valid_file = False

        if not valid_file:
            raise HTTPException(
                status_code=400,
                detail="Invalid file. Please upload a valid PDF, JPG, PNG, or WebP."
            )

        # Save uploaded PDF with a unique filename
        safe_filename = f"{uuid4().hex}{extension}"
        file_path = os.path.join(upload_dir, safe_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        print(f"Uploaded PDF saved: {file_path}")

        # Add PDF contents to the chatbot knowledge base
        from chatbot.pdf_processor import load_and_split_pdf

        if extension == ".pdf":
            # Extract text from a PDF
            documents = load_and_split_pdf(file_path)

        else:
            # Extract text from a medical document image using Gemini
            documents = image_to_documents(
                image_bytes=content,
                mime_type=SUPPORTED_UPLOAD_TYPES[extension],
                filename=file.filename,
            )

        # Remove empty document chunks
        documents = [
            doc for doc in documents
            if doc.page_content.strip()
        ]

        # Reject PDFs with no readable text
        if not documents:
            os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail=(
                    "No readable text found in this PDF. "
                    "Please upload a text-based PDF."
                ),
            )

        chunks = private_store.add_user_documents(
            user_id=user_id,
            documents=documents,
        )

        print(
            f"Uploaded PDF added to knowledge base: {chunks} chunks"
        )

        return {
            "message": f"{file.filename} uploaded successfully",
            "chunks": chunks,
        }

    except HTTPException:
        raise

    except Exception as error:
        print("PDF upload error:")
        print(type(error).__name__, str(error))

        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        )

@app.post("/analyze-meal")
async def analyze_meal(
    file: UploadFile = File(...)
):
    # ----------------------------------------------
    # Validate file
    # ----------------------------------------------

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WebP image.",
        )

    # ----------------------------------------------
    # Read image
    # ----------------------------------------------

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    # ----------------------------------------------
    # Limit image size
    # ----------------------------------------------

    max_size = 10 * 1024 * 1024

    if len(image_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 10 MB.",
        )

    # ----------------------------------------------
    # PCOS-focused prompt
    # ----------------------------------------------

    prompt = """
You are a nutrition-focused AI assistant for a PCOS
wellness application.

Analyze the meal shown in the uploaded image.

Your job is to identify visible foods and provide a
general PCOS-oriented nutritional analysis.

IMPORTANT SAFETY RULES:

- You cannot diagnose PCOS from a meal image.
- Do not claim that this meal will treat, cure, or
  cause PCOS.
- Do not make individualized medical claims.
- Do not prescribe medication or supplements.
- Nutritional analysis from an image is approximate.
- You may not be able to identify every ingredient,
  cooking oil, portion size, or hidden ingredient.
- Clearly distinguish what is visible from what you
  are estimating.
- Encourage the user to consult a registered dietitian
  or qualified healthcare professional for personalized
  dietary advice.

Analyze these aspects:

1. Identify the foods that are visibly present.
2. Estimate the major nutritional characteristics
   of the meal where reasonably possible.
3. Identify aspects that may be supportive of
   PCOS-friendly eating patterns.
4. Identify aspects that may be less favorable
   depending on portion size, preparation, or the
   person's individual needs.
5. Suggest practical improvements or substitutions.
6. Give an overall qualitative rating:
   "More PCOS-friendly", "Mixed", or
   "Less PCOS-friendly".
7. Explain that this is a general educational
   assessment, not a medical diagnosis.

Return the result as JSON with exactly these fields:

{
  "meal_name": "short description",
  "foods_identified": [
    "food 1",
    "food 2"
  ],
  "healthy_aspects": [
    "aspect 1",
    "aspect 2"
  ],
  "pcos_considerations": [
    "consideration 1",
    "consideration 2"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2"
  ],
  "overall_rating": "More PCOS-friendly",
  "confidence": "High/Medium/Low",
  "disclaimer": "short educational disclaimer"
}

If you cannot confidently identify a food,
say so rather than inventing one.
"""

    # ----------------------------------------------
    # Send image to Gemini
    # ----------------------------------------------

    
    # ----------------------------------------------
    # Analyze meal: Gemini primary, Groq fallback
    # ----------------------------------------------

    import base64

    analysis_text = None
    

    # 1. Try Gemini first
    try:
        print("Trying Gemini meal analyzer...")
        

        gemini_response = meal_client.models.generate_content(
            model="gemini-3.7-flash",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=file.content_type,
                ),
                prompt,
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )

        if gemini_response.text:
            analysis_text = gemini_response.text
            print("Gemini meal analysis successful.")

    except Exception as error:
        print(
            "Gemini meal analysis failed:",
            type(error).__name__,
            str(error),
        )

    # 2. Try Groq if Gemini failed
    if analysis_text is None and groq_client is not None:
        try:
            print("Trying Groq meal analyzer fallback...")

            encoded_image = base64.b64encode(
                image_bytes
            ).decode("utf-8")

            image_url = (
                f"data:{file.content_type};base64,"
                f"{encoded_image}"
            )

            groq_response = groq_client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt,
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url
                                },
                            },
                        ],
                    }
                ],
                temperature=0.2,
                response_format={
                    "type": "json_object"
                },
            )

            analysis_text = (
                groq_response.choices[0].message.content
            )

            if not analysis_text:
                raise ValueError(
                    "Groq returned an empty response."
                )

            print("Groq meal analysis successful.")

        except Exception as error:
            print(
                "Groq meal analysis failed:",
                type(error).__name__,
                str(error),
            )

    # 3. Handle failure of both providers
    if not analysis_text:
        raise HTTPException(
            status_code=503,
            detail=(
                "The AI meal analyzer is temporarily "
                "unavailable. Please try again shortly."
            ),
        )


    # ----------------------------------------------
    # Parse response
    # ----------------------------------------------

    try:
        result = json.loads(analysis_text)

    except Exception:
        result = {
            "meal_name": "Meal analysis",
            "foods_identified": [],
            "healthy_aspects": [],
            "pcos_considerations": [],
            "suggestions": [],
            "overall_rating": "Mixed",
            "confidence": "Low",
            "disclaimer": analysis_text,
        }

    # ----------------------------------------------
    # Return result
    # ----------------------------------------------

    return {
        "success": True,
        "filename": file.filename,
        "analysis": result,
    }