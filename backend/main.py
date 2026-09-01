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

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from schemas import PCOSInput
from model_utils import predict_pcos
from xai_utils import explain_pcos_prediction
from chatbot.rag import PCOSRAG


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