console.log("⏳ Face model is starting...");
let modelReady = false;

const { spawn } = require("child_process");

const pythonCmd =
  process.env.NODE_ENV === "production" ? "./venv/bin/python" : "py";

// 🔥 START PYTHON ONCE
const py = spawn(pythonCmd, ["./face/encode_face.py"]);

let buffer = "";

py.stdout.on("data", (data) => {
  const text = data.toString();
  buffer += text;

  if (text.includes('"status": "model loaded"')) {
    modelReady = true;
    console.log("✅ Face model loaded and ready");
  }
});

function getFaceEncoding(imagePath) {
  return new Promise((resolve, reject) => {
    if (!modelReady) {
      return reject("Face model is starting, please try again");
    }

    // send request
    py.stdin.write(JSON.stringify({ image: imagePath }) + "\n");

    const check = () => {
      const idx = buffer.indexOf("\n");
      if (idx === -1) {
        setImmediate(check);
        return;
      }

      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);

      try {
        const result = JSON.parse(line);
        if (result.error) reject(result.error);
        else if (result.embedding) resolve(result.embedding);
        else setImmediate(check);
      } catch (e) {
        reject(e);
      }
    };

    check();
  });
}

module.exports = { getFaceEncoding };
