import React, { useState } from "react";
import { ApiUrl } from "../../../ApiUrl";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors([]);
    setMessage("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors([]);

    if (!form.email || !form.password) {
      setErrors(["Please enter both email and password."]);
      return;
    }

    setLoading(true);
    try {
      const ress = await fetch(`${ApiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          remember: form.remember,
        }),
        credentials: "include",
      });

      const res = await ress.json();

      if (res.errors) {
        setErrors(res.errors);
      } else {
        setMessage(res.message || "Login successful!");
        setForm({ email: "", password: "", remember: false });
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
          <span className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20">OR</span>
          <span className="text-lg font-semibold tracking-wide text-white/90">OptiRoll</span>
        </div>
        <a href="#" className="text-sm text-white/70 hover:text-white/90 transition">Need help?</a>
      </header>

      {/* Main Card */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-2 md:pt-4">
        {/* Left: Marketing */}
        <section className="relative hidden md:block">
          <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl shadow-black/40">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Welcome back to <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">smart attendance</span>.
            </h1>
            <p className="mt-4 text-white/70">Manage your classes, teams, or events from one simple dashboard.</p>

            <ul className="mt-8 space-y-4 text-sm text-white/80">
              {[
                "Quick sign-in with saved credentials",
                "Secure sessions with cookies",
                "All your data in one place",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path fill="currentColor" d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L19.2 6z"/></svg>
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
              <h2 className="text-2xl font-semibold">Log in to your account</h2>
              <p className="mt-1 text-sm text-white/60">Access your dashboard and manage attendance easily.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@domain.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm text-white/80">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </div>

              {/* Remember Me */}
              <label className="mt-3 flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={onChange}
                  className="h-5 w-5 rounded-md border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400"
                />
                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-slate-950 font-semibold transition active:scale-[.99] disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition group-hover:translate-x-0" />
                {loading ? "Logging in…" : "Log in"}
              </button>

              {message && (
                <div className="mt-3 rounded-xl border px-4 py-3 text-sm">
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

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-white/70">
              Don’t have an account?{" "}
              <a href="#" className="text-white underline decoration-dotted underline-offset-4 hover:text-cyan-300">
                Sign up
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
