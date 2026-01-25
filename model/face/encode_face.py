# import sys
# import json
# import os
# from deepface import DeepFace
# import cv2

# # Set DeepFace to use your local weight folder
# os.environ["DEEPFACE_HOME"] = "deepfaceWeights"

# # 🔥 LOAD MODEL ONCE AT STARTUP
# print(json.dumps({"status": "loading model"}), flush=True)
# model = DeepFace.build_model("Facenet")
# print(json.dumps({"status": "model loaded"}), flush=True)
 
# # 🔁 KEEP LISTENING FOR REQUESTS
# for line in sys.stdin:
#     try:
#         data = json.loads(line.strip())
#         image_path = data.get("image")

#         if not image_path:
#             print(json.dumps({"error": "No image path provided"}), flush=True)
#             continue

#         img = cv2.imread(image_path)
#         if img is None:
#             print(json.dumps({"error": "Invalid image file"}), flush=True)
#             continue

#         embedding_objs = DeepFace.represent(
#             img_path=image_path,
#             model_name="Facenet",
#             detector_backend="opencv",  # ⚡ faster
#             enforce_detection=True,
#             align=False
#         )

#         embedding = embedding_objs[0]["embedding"]
#         embedding_list = [float(x) for x in embedding]

#         print(json.dumps({"embedding": embedding_list}), flush=True)

#     except Exception as e:
#         print(json.dumps({"error": str(e)}), flush=True)


# import os
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from deepface import DeepFace
# import cv2

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DEEPFACE_HOME = os.path.join(BASE_DIR, "..", "deepfaceWeights")

# # Same as before
# os.environ["DEEPFACE_HOME"] = "deepfaceWeights"

# app = FastAPI()

# print("⏳ Loading FaceNet model...")
# model = DeepFace.build_model("Facenet")
# print("✅ FaceNet model loaded")


# # request schema
# class ImageRequest(BaseModel):
#     imagePath: str


# @app.post("/predict")
# def predict(req: ImageRequest):
#     image_path = req.imagePath

#     if not image_path:
#         raise HTTPException(status_code=400, detail="No image path provided")

#     img = cv2.imread(image_path)
#     if img is None:
#         raise HTTPException(status_code=400, detail="Invalid image file")

#     try:
#         embedding_objs = DeepFace.represent(
#             img_path=image_path,
#             model_name="Facenet",
#             detector_backend="opencv",
#             enforce_detection=True,
#             align=False
#         )

#         embedding = embedding_objs[0]["embedding"]
#         embedding_list = [float(x) for x in embedding]

#         return {"embedding": embedding_list}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

import os
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from deepface import DeepFace
from dotenv import load_dotenv

# -----------------------------
# LOAD ENV
# -----------------------------
load_dotenv()
API_KEY = os.environ.get("API_SECRET")

if not API_KEY:
    raise RuntimeError("API_SECRET not set")

# -----------------------------
# PATH SETUP
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
# REQUEST SCHEMA
# -----------------------------
class ImageRequest(BaseModel):
    imagePath: str

# -----------------------------
# API ENDPOINT (PROTECTED)
# -----------------------------
@app.post("/predict")
def predict(
    req: ImageRequest,
    api_secret: str = Header(None)
):
    # 🔐 API KEY CHECK
    if API_SECRET != API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not req.imagePath:
        raise HTTPException(status_code=400, detail="No image path provided")

    try:
        embedding_objs = DeepFace.represent(
            img_path=req.imagePath,
            model_name="Facenet",
            detector_backend="opencv",
            enforce_detection=True,
            align=False
        )

        embedding = embedding_objs[0]["embedding"]
        return {"embedding": [float(x) for x in embedding]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))