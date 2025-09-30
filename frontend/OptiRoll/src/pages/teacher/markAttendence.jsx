import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { ApiUrl } from "../../../ApiUrl";

export default function TeacherMarkAttendance() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [preview, setPreview] = useState(null); // <-- new state

  const handleSubmit = useCallback(async () => {
    setErrors([]);
    setSuccess(null);

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setErrors(["Could not capture image."]);
      return;
    }

    setPreview(imageSrc); // <-- show preview
    setLoading(true);
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("faceImage", blob, "face.jpg");

      const response = await fetch(`${ApiUrl}/teacher/markAttendance`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.errors) {
        setErrors(data.errors || ["Failed to mark attendance."]);
        return;
      }

      setSuccess({
        name: data.student.name,
        email: data.student.email,
        time: data.markedAt,
        status: data.status,
      });
    } catch (err) {
      console.error(err);
      setErrors(["Network error. Try again."]);
    } finally {
      setLoading(false);
      setPreview(null); // <-- hide preview after result
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Quick Attendance
        </h1>
        <p className="text-center text-sm text-white/70 mb-6">
          Show your face to the camera — attendance will be marked automatically.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-2xl border border-white/16"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-2xl border border-white/16"
              />
            )}
            <div className="absolute right-3 top-3 text-white/60 select-none">
              📸
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Marking…" : "Mark Attendance"}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrors([]);
                setSuccess(null);
              }}
              className="px-4 py-3 rounded-2xl bg-white/6 text-white/90 font-medium hover:bg-white/10 transition"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {errors.length > 0 && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/8 px-4 py-3 text-sm text-rose-200">
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{success.name}</div>
                <div className="text-xs text-white/80">{success.email}</div>
                <div className="text-xs text-white/70 mt-1">
                  {success.status === "start" && "Opened at"}
                  {success.status === "end" && "Closed at"}{" "}
                  {new Date(success.time).toLocaleString()}
                </div>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          )}

          {!success && errors.length === 0 && (
            <div className="text-xs text-white/60">Tip: Press the button to capture face.</div>
          )}
        </div>
      </div>
    </div>
  );
}
