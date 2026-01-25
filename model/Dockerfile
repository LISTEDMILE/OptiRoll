FROM python:3.10-slim

WORKDIR /app

# system deps for opencv + deepface
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["uvicorn", "face.encode_face:app", "--host", "0.0.0.0", "--port", "7860"]