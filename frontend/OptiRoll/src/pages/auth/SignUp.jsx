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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

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

  const onOtpChange = (e) => setOtp(e.target.value);

  const sendOtp = async () => {
    setErrors([]);
    setMessage("");
    if (!form.email) {
      setErrors(["Email is required for OTP."]);
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch(`${ApiUrl}/auth/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setErrors([data.message || "Failed to send OTP."]);
      }
    } catch (err) {
      setErrors([err.message || "Something went wrong."]);
    } finally {
      setOtpLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors([]);

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
        "Use a strong password with mix of Upper Case and Lower Case, numbers, and symbols.",
      ]);
      return;
    }
    if (!form.agree) {
      setErrors(["Please accept the Terms & Privacy Policy."]);
      return;
    }

    setLoading(true);
    try {
      // Sign-up along with OTP verification
      const res = await fetch(`${ApiUrl}/auth/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          otp, // OTP sent by user
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setForm({
          name: "",
          email: "",
          password: "",
          confirm: "",
          agree: false,
        });
        if (data.message) setMessage(data.message);
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
          href="/contact"
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

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@domain.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpLoading}
                    className="rounded-2xl text-nowrap  bg-cyan-400 px-4 py-2 text-slate-950 font-semibold hover:bg-cyan-500 disabled:opacity-70"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP */}
              {otpSent && (
                <div>
                  <label className="mb-1 block text-sm text-white/80">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={onOtpChange}
                    placeholder="123456"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Password
                </label>
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Confirm Password
                </label>
                <input
                  type={showPwd ? "text" : "password"}
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
                  className="underline decoration-dotted underline-offset-4 hover:text-white"
                  href="/privacyPolicy"
                >
                  Privacy Policy
                </a>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-slate-950 font-semibold transition active:scale-[.99] disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {/* Messages */}
              {message && (
                <div className="mt-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/80">
                  {message}
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  <ul className="list-disc list-inside">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
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
