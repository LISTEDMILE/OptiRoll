import React, { useMemo, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);



  const strength = useMemo(() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0-5
  }, [form.password]);

  const strengthLabel = [
    "Too short",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Excellent",
  ][strength];

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors([]);
    setMessage("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setErrors(["Please fill all required fields."]);
      return;
    }
    if (form.password !== form.confirm) {
      setErrors(["Passwords do not match."]);
      return;
    }
    if (strength < 5) {
      setErrors([
        "Use a strong password with mix of Upper Case and Lower Case , use numbers and symbols(only legal).",
      ]);
      return;
    }
    if (!form.agree) {
      setErrors(["Please accept the Terms & Privacy Policy."]);
      return;
    }

    setLoading(true);
    try {
      const ress = await fetch(`${ApiUrl}/auth/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });

      const res = await ress.json();
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setForm({
          name: "",
          email: "",
          password: "",
          confirm: "",
          agree: false,
        });
        if (res.message) {
          setMessage(res.message);
        }
        window.location.assign("/");
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
        <a
          href="#"
          className="text-sm text-white/70 hover:text-white/90 transition"
        >
          Need help?
        </a>
      </header>

      {/* Main Card */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-2 md:pt-4">
        {/* Left: Marketing */}
        <section className="relative hidden md:block">
          <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl shadow-black/40">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Join the{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                smart attendance
              </span>{" "}
              era.
            </h1>
            <p className="mt-4 text-white/70">
              Automatic marking. Instant analytics. Zero friction. Designed for
              classes, teams, and events.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-white/80">
              {[
                "One-tap sign-in & role-based access",
                "Real-time dashboards and CSV export",
                "Privacy-first, secure sessions",
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
              Trusted by modern classrooms
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Right: Form */}
        <section className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Create your account</h2>
              <p className="mt-1 text-sm text-white/60">
                Start marking attendance in minutes.
              </p>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.602 31.91 29.205 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.31 0 6.32 1.23 8.61 3.24l5.66-5.66C34.527 3.053 29.527 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22c12.15 0 22-9.85 22-22 0-1.47-.15-2.9-.389-4.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.818C14.39 16.23 18.835 13 24 13c3.31 0 6.32 1.23 8.61 3.24l5.66-5.66C34.527 3.053 29.527 1 24 1 15.316 1 7.914 5.74 4.306 12.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 45c5.16 0 9.86-1.97 13.42-5.18l-6.2-5.238C29.045 36.488 26.641 37 24 37c-5.176 0-9.59-3.088-11.313-7.49l-6.56 5.05C8.693 41.954 15.705 45 24 45z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.03 2.94-3.21 5.41-6.083 6.84l.004-.003 6.2 5.238C37.527 41.026 44 36 44 23c0-1.47-.15-2.9-.389-4.917z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.86 8.16 6.84 9.49.5.09.68-.22.68-.49v-1.72c-2.78.61-3.37-1.18-3.37-1.18-.46-1.18-1.12-1.49-1.12-1.49-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .85-.27 2.78 1.02.8-.22 1.66-.33 2.52-.33s1.72.11 2.52.33c1.93-1.29 2.78-1.02 2.78-1.02.55 1.38.2 2.41.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48 3.97-1.33 6.83-5.08 6.83-9.49 0-5.5-4.46-9.96-9.96-9.96z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-white/60">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              or
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Full Name
                </label>
                <div className="group relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@domain.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M12 13.5 2 6.75V18h20V6.75L12 13.5zM12 10.5 2 3h20l-10 7.5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-xs text-white/70 hover:text-white/90"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Strength meter */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < strength
                          ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                          : "bg-white/15"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-white/60">{strengthLabel}</span>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="Repeat password"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </div>

              {/* T&C */}
              <label className="mt-3 flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-0.5 h-5 w-5 rounded-md border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400"
                />
                I agree to the{" "}
                <a
                  className="mx-1 underline decoration-dotted underline-offset-4 hover:text-white"
                  href="#"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  className="underline decoration-dotted underline-offset-4 hover:text-white"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-slate-950 font-semibold transition active:scale-[.99] disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition group-hover:translate-x-0" />
                {loading ? "Creating account…" : "Create account"}
              </button>

              {message && (
                <div className={`mt-3 rounded-xl border px-4 py-3 text-sm `}>
                  {message}
                </div>
              )}
              {errors.length !== 0 && (
                <div
                  className={`mt-3 rounded-xl border px-4 py-3 text-sm border-rose-400/40 bg-rose-400/10 text-rose-200" `}
                >
                  {errors.map((err) => {
                    return <li>{err}</li>;
                  })}
                </div>
              )}
            </form>

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-white/70">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-white underline decoration-dotted underline-offset-4 hover:text-cyan-300"
              >
                Log in
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
