import sys
import json
from deepface import DeepFace
import cv2

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        return

    image_path = sys.argv[1]

    try:
        img = cv2.imread(image_path)
        if img is None:
            print(json.dumps({"error": "Invalid image file"}))
            return

        # Only use public API, do not try to load model manually
        embedding_objs = DeepFace.represent(
            img_path=image_path,
            model_name="Facenet",
            enforce_detection=True
        )

        embedding = embedding_objs[0]["embedding"]
        embedding_list = [float(x) for x in embedding]

        print(json.dumps({"embedding": embedding_list}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()