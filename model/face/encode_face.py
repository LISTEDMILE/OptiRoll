# import os
# from fastapi import FastAPI, HTTPException, Header
# from pydantic import BaseModel
# from deepface import DeepFace
# from dotenv import load_dotenv

# # -----------------------------
# # LOAD ENV
# # -----------------------------
# load_dotenv()
# API_KEY = os.environ.get("API_SECRET")

# if not API_KEY:
#     raise RuntimeError("API_SECRET not set")

# # -----------------------------
# # PATH SETUP
# # -----------------------------
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
# DEEPFACE_HOME = os.path.join(PROJECT_ROOT, "deepfaceWeights")

# os.environ["DEEPFACE_HOME"] = DEEPFACE_HOME
# os.makedirs(os.path.join(DEEPFACE_HOME, ".deepface", "weights"), exist_ok=True)

# # -----------------------------
# # FASTAPI APP
# # -----------------------------
# app = FastAPI()

# print("⏳ Loading FaceNet model...")
# model = DeepFace.build_model("Facenet")
# print("✅ FaceNet model loaded")

# # -----------------------------
# # REQUEST SCHEMA
# # -----------------------------
# class ImageRequest(BaseModel):
#     imagePath: str

# # -----------------------------
# # API ENDPOINT (PROTECTED)
# # -----------------------------
# @app.post("/predict")
# def predict(
#     req: ImageRequest,
#     api_secret: str = Header(None)
# ):
#     # 🔐 API KEY CHECK
#     if api_secret != API_KEY:
#         raise HTTPException(status_code=403, detail="Unauthorized")

#     if not req.imagePath:
#         raise HTTPException(status_code=400, detail="No image path provided")

#     try:
#         embedding_objs = DeepFace.represent(
#             img_path=req.imagePath,
#             model_name="Facenet",
#             detector_backend="opencv",
#             enforce_detection=True,
#             align=False
#         )

#         embedding = embedding_objs[0]["embedding"]
#         return {"embedding": [float(x) for x in embedding]}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



import os
import base64
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from deepface import DeepFace
from dotenv import load_dotenv

# -----------------------------
# LOAD ENV
# -----------------------------
load_dotenv()
API_SECRET = os.environ.get("API_SECRET")

if not API_SECRET:
    raise RuntimeError("API_SECRET not set")

# -----------------------------
# PATH SETUP (UNCHANGED)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
DEEPFACE_HOME = os.path.join(PROJECT_ROOT, "deepfaceWeights")

os.environ["DEEPFACE_HOME"] = DEEPFACE_HOME
os.makedirs(os.path.join(DEEPFACE_HOME, ".deepface", "weights"), exist_ok=True)

# -----------------------------
# FASTAPI APP
# -----------------------------
app = FastAPI()

print("⏳ Loading FaceNet model...")
model = DeepFace.build_model("Facenet")
print("✅ FaceNet model loaded")

# -----------------------------
# REQUEST SCHEMA (UNCHANGED NAME)
# -----------------------------
class ImageRequest(BaseModel):
    imageData: str   # ⚠️ now holds BASE64, not file path

# -----------------------------
# API ENDPOINT (PROTECTED)
# -----------------------------
@app.post("/predict")
def predict(
    req: ImageRequest,
    api_secret: str = Header(None)
):
    # 🔐 API KEY CHECK
    if api_secret != API_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not req.imageData:
        raise HTTPException(status_code=400, detail="No image data provided")

    try:
        # 🔥 NEW: decode base64 instead of reading file
        image_bytes = base64.b64decode(req.imageData)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Invalid image data")

        # 🔁 SAME DeepFace call as before
        embedding_objs = DeepFace.represent(
            img_path=img,
            model_name="Facenet",
            detector_backend="opencv",
            enforce_detection=True,
            align=False
        )

        embedding = embedding_objs[0]["embedding"]
        return {"embedding": [float(x) for x in embedding]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))