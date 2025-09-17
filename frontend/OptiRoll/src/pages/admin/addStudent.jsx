import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { ApiUrl } from "../../../ApiUrl";
import "../../main.css";

export default function AdminAddStudent() {
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  // webcam images
  const [images, setImages] = useState([]); // data URLs
  const webcamRef = useRef(null);

  // webcam settings (adjust if you want different resolution)
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors([]);
    setMessage("");
  };

  // Capture one photo from the webcam
  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot(); // data:image/jpeg;base64,...
    if (!imageSrc) {
      setErrors(["Unable to capture image — please allow camera access and try again."]);
      return;
    }
    if (images.length >= 5) {
      setErrors(["Maximum 5 images allowed."]);
      return;
    }
    setImages((prev) => [...prev, imageSrc]);
    setErrors([]);
  };

  // Remove single thumbnail
  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Clear all captures
  const clearImages = () => setImages([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    if (!form.name || !form.rollNo || !form.email) {
      setErrors(["Please fill all fields"]);
      return;
    }

    if (images.length < 3) {
      setErrors(["Please capture at least 3 images for reliable recognition"]);
      return;
    }

    setLoading(true);
    try {
      const ress = await fetch(`${ApiUrl}/admin/addStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          rollNo: form.rollNo,
          email: form.email,
          images, // array of data URLs
        }),
      });

      const res = await ress.json();
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setMessage(res.message || "Student added successfully!");
        setForm({ name: "", rollNo: "", email: "" });
        setImages([]);
      }
    } catch (err) {
      setErrors([err.message || "Something went wrong."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl" />

      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            OR
          </span>
          <span className="text-lg font-semibold tracking-wide text-white/90">
            OptiRoll
          </span>
        </div>
        <a href="#" className="text-sm text-white/70 hover:text-white/90 transition">
          Need help?
        </a>
      </header>

      {/* Main Card */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-2 md:pt-4">
        {/* Left Info Section */}
        <section className="relative hidden md:block">
          <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl shadow-black/40">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Add{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                new students
              </span>{" "}
              easily.
            </h1>
            <p className="mt-4 text-white/70">
              Quickly register students into your system and start tracking
              attendance efficiently.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-white/80">
              {[
                "Fast student registration",
                "Automatic password generation",
                "Linked with admin dashboard",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path
                        fill="currentColor"
                        d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L19.2 6z"
                      />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-4 text-xs text-white/60">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              Managed by Admins
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Right Form Section */}
        <section className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Add a Student</h2>
              <p className="mt-1 text-sm text-white/60">
                Fill out the details below to add a new student.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              {/* Roll No */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={form.rollNo}
                  onChange={onChange}
                  placeholder="123456"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="student@school.com"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              {/* Webcam Capture UI */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Capture Face Images</label>
                <div className="grid gap-3 md:flex md:items-start">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 p-2">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-72 h-48 object-cover rounded-lg"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={capture}
                        disabled={images.length >= 5}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-cyan-500/90 text-slate-950 font-medium disabled:opacity-60"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={clearImages}
                        disabled={images.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-rose-600/80 text-white font-medium disabled:opacity-60"
                      >
                        Clear
                      </button>
                      <div className="ml-auto text-xs text-white/60 self-center">
                        {images.length}/5 (min 3)
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto mt-2 md:mt-0">
                    {images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt={`capture-${i}`}
                          className="w-20 h-20 rounded-lg object-cover border border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-1 text-xs"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-white/60">
                  Take 3–5 photos: front, slight left, slight right for best results.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-slate-950 font-semibold transition active:scale-[.99] disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition group-hover:translate-x-0" />
                {loading ? "Adding…" : "Add Student"}
              </button>

              {/* Messages */}
              {message && (
                <div className="mt-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}
              {errors.length > 0 && (
                <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Bottom Glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
