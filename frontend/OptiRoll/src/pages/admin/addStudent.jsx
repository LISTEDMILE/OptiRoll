import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { ApiUrl } from "../../../ApiUrl";
import "../../main.css";
import imageCompression from "browser-image-compression";

export default function AdminAddStudent() {
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    profilePicture: null,
    course: "",
    year: "",
    section: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    hobbies: [],
    bio: "",
    skills: [],
    achievements: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  // webcam images
  const [images, setImages] = useState([]); // data URLs
  const webcamRef = useRef(null);

  // camera device handling
  const [facingMode, setFacingMode] = useState("user");
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [cameraPermissionError, setCameraPermissionError] = useState(null);

  const effectiveVideoConstraints = selectedDeviceId
    ? {
        deviceId: { exact: selectedDeviceId },
        width: { ideal: 640 },
        height: { ideal: 480 },
      }
    : { facingMode, width: { ideal: 640 }, height: { ideal: 480 } };

  useEffect(() => {
    let mounted = true;
    async function fetchDevices() {
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err) {}
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vids = devices.filter((d) => d.kind === "videoinput") || [];
        if (mounted) setVideoDevices(vids);
        if (stream) stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        if (mounted)
          setCameraPermissionError(
            "Unable to access camera devices. Please allow camera permission in your browser."
          );
      }
    }
    fetchDevices();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setForm((f) => ({ ...f, profilePicture: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setErrors([]);
    setMessage("");
  };

  const capture = () => {
    if (!webcamRef.current) return;
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");
      if (images.length >= 5) {
        setErrors(["Maximum 5 images allowed."]);
        return;
      }
      setImages((prev) => [...prev, imageSrc]);
      setErrors([]);
    } catch (err) {
      setErrors([
        "Unable to capture image — please allow camera access and try again.",
      ]);
    }
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  const clearImages = () => setImages([]);

  // --- Dynamic array input component (keeps all existing functionality) ---
  function ArrayInput({ label, name, values }) {
    const [input, setInput] = useState("");

    const addItem = () => {
      const v = input.trim();
      if (!v) return;
      setForm((prev) => ({ ...prev, [name]: [...prev[name], v] }));
      setInput("");
      setErrors([]);
      setMessage("");
    };

    const removeItem = (i) =>
      setForm((prev) => ({
        ...prev,
        [name]: prev[name].filter((_, idx) => idx !== i),
      }));

    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addItem();
      }
    };

    return (
      <div>
        <label className="pl-3 mb-1 block text-sm text-white/80">{label}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Add ${label}`}
            className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
          />
          <button
            type="button"
            onClick={addItem}
            className="rounded-xl bg-cyan-500/90 px-3 py-2 text-slate-950 font-medium"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 flex flex-wrap gap-2">
          {values.map((val, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-sm text-white"
            >
              {val}
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-rose-400 hover:text-rose-500"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    if (!form.name || !form.rollNumber || !form.email) {
      return setErrors(["Please fill all required fields"]);
    }
    if (images.length < 3) {
      return setErrors(["Capture at least 3 images"]);
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("rollNumber", form.rollNumber);
      formData.append("email", form.email);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("gender", form.gender);
      formData.append("phone", form.phone);
      formData.append("address[street]", form.street);
      formData.append("address[city]", form.city);
      formData.append("address[state]", form.state);
      formData.append("address[zip]", form.zip);
      formData.append("address[country]", form.country);
      formData.append("profilePicture", form.profilePicture);
      formData.append("course", form.course);
      formData.append("year", form.year);
      formData.append("section", form.section);
      formData.append("parentName", form.parentName);
      formData.append("parentPhone", form.parentPhone);
      formData.append("parentEmail", form.parentEmail);
      formData.append("emergencyContact[name]", form.emergencyName);
      formData.append("emergencyContact[relation]", form.emergencyRelation);
      formData.append("emergencyContact[phone]", form.emergencyPhone);

      formData.append("bio", form.bio);
      form.hobbies.forEach((h) => formData.append("hobbies[]", h));
      form.skills.forEach((s) => formData.append("skills[]", s));
      form.achievements.forEach((a) => formData.append("achievements[]", a));

      for (let i = 0; i < images.length; i++) {
        let blob;
        try {
          blob = await (await fetch(images[i])).blob();
          if (!blob.size) throw new Error();
        } catch {
          setErrors([`Could not process image ${i + 1}`]);
          setLoading(false);
          return;
        }
        let compressedBlob;
        try {
          compressedBlob = await imageCompression(blob, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 640,
            useWebWorker: true,
          });
        } catch {
          setErrors([`Image compression failed for image ${i + 1}`]);
          setLoading(false);
          return;
        }
        formData.append("images", compressedBlob, `capture-${i}.jpg`);
      }

      const res = await fetch(`${ApiUrl}/admin/addStudent`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.errors) setErrors(data.errors);
      else {
        setMessage(data.message || "Student added successfully!");
        setForm({
          name: "",
          rollNumber: "",
          email: "",
          dateOfBirth: "",
          gender: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          profilePicture: null,
          course: "",
          year: "",
          section: "",
          parentName: "",
          parentPhone: "",
          parentEmail: "",
          emergencyName: "",
          emergencyRelation: "",
          emergencyPhone: "",
          hobbies: [],
          bio: "",
          skills: [],
          achievements: [],
        });
        setImages([]);
      }
    } catch (err) {
      setErrors([err.message || "Something went wrong"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-16 justify-center items-center fixed inset-0 h-screen w-screen bg-black/60 z-60">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-fuchsia-500 animate-spin-slow"></div>
          </div>
          <p className="text-white text-xl text-center animate-pulse">
            Adding Student. It may take a while…
          </p>
        </div>
      )}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            OR
          </span>
          <span className="text-lg font-semibold tracking-wide text-white/90">
            OptiRoll
          </span>
        </div>
        <a
          href="#"
          className="text-sm text-white/70 hover:text-white/90 transition"
        >
          Need help?
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-2 md:pt-4">
        {/* Left Info */}
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

        {/* Right Form */}
        <section className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Add a Student</h2>
              <p className="mt-1 text-sm text-white/60">
                Fill out the details below to add a new student.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Existing fields (name, roll, email) */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={onChange}
                  placeholder="123456"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="student@school.com"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              {/* New fields */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="1234567890"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="pl-3 mb-1 block text-sm text-white/80">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="pl-3 mb-1 block text-sm text-white/80">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="pl-3 mb-1 block text-sm text-white/80">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="pl-3 mb-1 block text-sm text-white/80">
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="pl-3 mb-1 block text-sm text-white/80">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={onChange}
                  accept="image/*"
                  className="w-full text-white/80"
                />
              </div>

              {/* Other new fields */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Parent Info */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={form.parentName}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Parent Phone
                </label>
                <input
                  type="text"
                  name="parentPhone"
                  value={form.parentPhone}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Parent Email
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  value={form.parentEmail}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Emergency Contact */}
              <h1 className="mt-10">Emergency Contact</h1>
              <div className="flex flex-col md:flex-row flex-wrap min-w-[50%] justify-between">
                <div>
                  <label className="pl-3 mb-2 mt-2  block text-sm text-white/80">
                    {" "}
                    Name
                  </label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={form.emergencyName}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="pl-3 mb-2 mt-4 block text-sm text-white/80">
                    Relation
                  </label>
                  <input
                    type="text"
                    name="emergencyRelation"
                    value={form.emergencyRelation}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="pl-3 mb-2 block text-sm text-white/80">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={form.emergencyPhone}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Hobbies, Skills, Achievements */}
              <ArrayInput
                label="Hobbies"
                name="hobbies"
                values={form.hobbies}
              />
              <ArrayInput label="Skills" name="skills" values={form.skills} />
              <ArrayInput
                label="Achievements"
                name="achievements"
                values={form.achievements}
              />

              {/* Webcam */}
              <div>
                <label className="pl-3 mb-1 block text-sm text-white/80">
                  Capture Face Images
                </label>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <select
                      value={selectedDeviceId ?? ""}
                      onChange={(e) =>
                        setSelectedDeviceId(e.target.value || null)
                      }
                      className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 outline-none"
                    >
                      <option value="">Default (use facing mode)</option>
                      {videoDevices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label || `Camera ${d.deviceId}`}
                        </option>
                      ))}
                    </select>
                    <div className="ml-auto text-xs text-white/60">
                      {selectedDeviceId
                        ? "Using selected device"
                        : `Facing: ${facingMode}`}
                    </div>
                  </div>
                  <Webcam
                    key={selectedDeviceId ?? facingMode}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={effectiveVideoConstraints}
                    className="w-full h-48 object-cover rounded-lg"
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
                  <div className="flex gap-2 overflow-x-auto mt-2">
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
                  <p className="mt-2 text-xs text-white/60">
                    Take 3–5 photos: front, slight left, slight right for best
                    results.
                  </p>
                  {cameraPermissionError && (
                    <div className="mt-2 text-xs text-rose-300">
                      {cameraPermissionError}
                    </div>
                  )}
                </div>
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
                <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-8 py-3 text-sm text-rose-200">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
