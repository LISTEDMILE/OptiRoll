// Hugging Face ML API endpoint
const ML_URL = `${process.env.ML_BASE_URL}/predict`;
async function getFaceEncoding(imagePath) {
  const res = await fetch(ML_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-secret": process.env.API_SECRET,
    },
    body: JSON.stringify({ imagePath }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "ML service error");
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.embedding) {
    throw new Error("No face detected");
  }

  return data.embedding;
}

module.exports = { getFaceEncoding };
