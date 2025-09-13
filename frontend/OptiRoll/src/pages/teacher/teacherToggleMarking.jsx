import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";

export default function TeacherToggleMarking() {
  const [status, setStatus] = useState(null); // start or end
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${ApiUrl}/teacher/statusMarking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.errors) {
        setError(data.errors.join(", "));
      } else {
        setStatus(data.whatNext?.attendence?.whatNext || "start");
      }
    } catch {
      setError("Failed to fetch marking status.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setBtnLoading(true);
    setModalError("");
    try {
      const res = await fetch(`${ApiUrl}/teacher/startMarking`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.errors) {
        setModalError(data.errors.join(", "));
      } else {
        setStatus(data.status === "start" ? "end" : "start");
        setShowModal(false);
        setPassword("");
      }
    } catch {
      setModalError("Network error.");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Teacher Attendance
        </h1>
        <p className="text-sm text-white/70 mb-6">
          Toggle attendance marking for your class.
        </p>

        {error && (
          <p className="mb-4 text-red-400 text-sm bg-red-500/10 p-2 rounded-xl border border-red-500/20">
            {error}
          </p>
        )}

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium block mx-auto mb-4 w-fit ${
            status === "start"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          {status === "start" ? "Marking Closed" : "Marking Open"}
        </span>

        <button
          onClick={() => setShowModal(true)}
          className={`w-full py-3 rounded-2xl font-semibold shadow-lg transition active:scale-95 mb-3 ${
            status === "start"
              ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-900"
              : "bg-gradient-to-r from-rose-400 to-red-500 text-white"
          }`}
        >
          {status === "start" ? "Start Marking" : "End Marking"}
        </button>

        <button
          onClick={() => navigate("/teacher/markAttendence")}
          className="w-full py-3 rounded-2xl bg-white/6 text-white/90 font-medium hover:bg-white/10 transition"
        >
          Go to Mark Attendance →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white"
            >
              ❌
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {status === "start" ? "Start Marking" : "End Marking"} Confirmation
            </h2>
            <p className="text-sm text-white/70 mb-4 text-center">
              Enter your password to proceed.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-cyan-400 focus:bg-white/10 outline-none"
            />
            {modalError && (
              <p className="text-red-400 text-sm mt-2">{modalError}</p>
            )}
            <button
              onClick={handleToggle}
              disabled={btnLoading}
              className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-900 font-semibold hover:shadow-lg transition disabled:opacity-60"
            >
              {btnLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
