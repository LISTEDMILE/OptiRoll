import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

export default function AdminStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${ApiUrl}/admin/studentsList`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.errors) {
          setError(data.errors);
        } else {
          setStudents(data.studentsList || []);
        }
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl" />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 pb-16 md:pt-4">
        <div className="mb-8 mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">
            Student <span className="text-cyan-400">Directory</span>
          </h1>
          <Link
            to="/admin/addStudent"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 text-slate-950 font-semibold shadow-md hover:scale-105 transition"
          >
            + Add Student
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center fixed inset-0 h-screen w-screen bg-black/60">
            <p className="text-white/70">Loading students…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* Student Cards */}
        {!loading && !error && students.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((s) => (
              <div
                key={s._id}
                className="bg-white/5 rounded-3xl border border-white/10 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl flex flex-col items-center text-center transition hover:scale-[1.02]"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-4">
                  <img
                    src={s.profilePicture || "/defaultProfile.png"}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  {s.name}
                </h2>
                <p className="text-sm text-white/60 mb-1">
                  Roll No: {s.rollNumber}
                </p>
                <p className="text-sm text-white/60 mb-3">{s.email}</p>

                {/* Optional extra info */}
                {s.phone && (
                  <p className="text-xs text-white/50 mb-1">Phone: {s.phone}</p>
                )}
                {s.course && (
                  <p className="text-xs text-white/50 mb-1">
                    Course: {s.course}
                  </p>
                )}
                {s.section && (
                  <p className="text-xs text-white/50 mb-3">
                    Section: {s.section}
                  </p>
                )}

                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/admin/studentDashboard/${s._id}`}
                    className="inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`/admin/studentAttendence/${s._id}`}
                    className="inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Students */}
        {!loading && students.length === 0 && (
          <div className="flex flex-col justify-center items-center mt-20">
            <img
              src="/notFound.png"
              className="h-[300px]"
              style={{ filter: "drop-shadow(2px 2px 2px yellow)" }}
              alt="Image not found"
            />
            <p className="mt-12 text-white/60 text-lg text-center">
              No students found. Try adding some!
            </p>
          </div>
        )}
      </main>

      {/* Bottom Glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
