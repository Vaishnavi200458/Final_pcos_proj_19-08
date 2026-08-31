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


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import PCOSInput
from model_utils import predict_pcos
from xai_utils import explain_pcos_prediction


app = FastAPI(title="PCOS Prediction API")


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