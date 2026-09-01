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

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from schemas import PCOSInput
from model_utils import predict_pcos
from xai_utils import explain_pcos_prediction
from chatbot.rag import PCOSRAG
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not configured."
    )

meal_client = genai.Client(
    api_key=GEMINI_API_KEY
)


app = FastAPI(title="PCOS Prediction API")
# Initialize PCOS RAG chatbot
rag = PCOSRAG()


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
async def chat(data: dict):
    try:
        question = data.get("question")

        if not question or not question.strip():
            raise HTTPException(
                status_code=400,
                detail="Please enter a question.",
            )

        print("Chatbot question received:")
        print(question)

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

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # Only allow PDF files
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed.",
            )

        # Create upload folder if it does not exist
        upload_dir = os.path.join(
            os.path.dirname(__file__),
            "uploads",
            "pdfs",
        )

        os.makedirs(upload_dir, exist_ok=True)

        # Save uploaded PDF
        file_path = os.path.join(
            upload_dir,
            file.filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

        print(f"Uploaded PDF saved: {file_path}")

        # Add PDF contents to the chatbot knowledge base
        chunks = rag.add_pdf(file_path)

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

    response = None
    last_error = None

    models_to_try = [
     "gemini-3.7-flash",
     "gemini-3.6-flash",
      "gemini-3.5-flash",
    ]
    for model_name in models_to_try:
     for attempt in range(2):
        try:
            print(
                f"Trying meal analyzer model: "
                f"{model_name} "
                f"(attempt {attempt + 1})"
            )

            response = meal_client.models.generate_content(
                model=model_name,
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

            break

        except Exception as error:
            last_error = error

            print(
                f"{model_name} attempt "
                f"{attempt + 1} failed:"
            )
            print(
                type(error).__name__,
                str(error)
            )

            if attempt < 1:
                time.sleep(5)

        if response is not None:
         break



    if response is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "The AI meal analyzer is temporarily busy. "
                "Please try again in a few moments."
            ),
        )

    # ----------------------------------------------
    # Parse response
    # ----------------------------------------------

    try:
        result = json.loads(response.text)

    except Exception:
        result = {
            "meal_name": "Meal analysis",
            "foods_identified": [],
            "healthy_aspects": [],
            "pcos_considerations": [],
            "suggestions": [],
            "overall_rating": "Mixed",
            "confidence": "Low",
            "disclaimer": response.text,
        }

    # ----------------------------------------------
    # Return result
    # ----------------------------------------------

    return {
        "success": True,
        "filename": file.filename,
        "analysis": result,
    }