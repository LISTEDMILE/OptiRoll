import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Assuming React Router
import { ApiUrl } from "../../../ApiUrl";
import Header from "../../compo/header";

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
        <div className="mb-8 flex items-center justify-between">
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

        {/* Error/Loading States */}
        {loading && <p className="text-white/70">Loading students…</p>}
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* Students Table */}
        {!loading && !error && students.length > 0 && (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10 text-sm text-white/70">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s._id}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4">{s.rollNo}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/studentDashboard/${s._id}`}
                        className="inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                      >
                        View Dashboard
                      </Link>

                      <Link
                        to={`/admin/studentAttendence/${s._id}`}
                        className="inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                      >
                        View Analytics
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && students.length === 0 && (
          <p className="mt-6 text-white/60 text-center">
            No students found. Try adding some!
          </p>
        )}
      </main>

      {/* Bottom Glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
