# import sys
# import json
# import os
# from deepface import DeepFace
# import cv2

# # Set DeepFace to use your local weight folder
# os.environ["DEEPFACE_HOME"] = "deepfaceWeights"  # folder containing facenet_weights.h5

# def main():
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "No image path provided"}))
#         return

#     image_path = sys.argv[1]

#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             print(json.dumps({"error": "Invalid image file"}))
#             return

#         # Only use public API, do not try to load model manually
#         embedding_objs = DeepFace.represent(
#             img_path=image_path,
#             model_name="Facenet",
#             enforce_detection=True
#         )

#         embedding = embedding_objs[0]["embedding"]
#         embedding_list = [float(x) for x in embedding]

#         print(json.dumps({"embedding": embedding_list}))

#     except Exception as e:
#         print(json.dumps({"error": str(e)}))

# if __name__ == "__main__":
#     main()



import sys
import json
import os
from deepface import DeepFace
import cv2

# Set DeepFace to use your local weight folder
os.environ["DEEPFACE_HOME"] = "deepfaceWeights"

# 🔥 LOAD MODEL ONCE AT STARTUP
print(json.dumps({"status": "loading model"}), flush=True)
model = DeepFace.build_model("Facenet")
print(json.dumps({"status": "model loaded"}), flush=True)
 
# 🔁 KEEP LISTENING FOR REQUESTS
for line in sys.stdin:
    try:
        data = json.loads(line.strip())
        image_path = data.get("image")

        if not image_path:
            print(json.dumps({"error": "No image path provided"}), flush=True)
            continue

        img = cv2.imread(image_path)
        if img is None:
            print(json.dumps({"error": "Invalid image file"}), flush=True)
            continue

        embedding_objs = DeepFace.represent(
            img_path=image_path,
            model_name="Facenet",
            detector_backend="opencv",  # ⚡ faster
            enforce_detection=True,
            align=False
        )

        embedding = embedding_objs[0]["embedding"]
        embedding_list = [float(x) for x in embedding]

        print(json.dumps({"embedding": embedding_list}), flush=True)

    except Exception as e:
        print(json.dumps({"error": str(e)}), flush=True)
