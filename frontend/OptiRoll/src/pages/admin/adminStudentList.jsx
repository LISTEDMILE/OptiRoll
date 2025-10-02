import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

export default function AdminStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

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

  // 🔍 Filtering
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.rollNumber?.toString().toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.course?.toLowerCase().includes(term) ||
      s.section?.toLowerCase().includes(term)
    );
  });

  // ↕️ Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "roll-asc":
        return (a.rollNumber || "").toString().localeCompare((b.rollNumber || "").toString());
      case "roll-desc":
        return (b.rollNumber || "").toString().localeCompare((a.rollNumber || "").toString());
      default:
        return 0;
    }
  });

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

        {/* 🔍 Search & Sort Controls */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, roll no, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 rounded-lg bg-slate-800/60 px-4 py-2 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-lg bg-slate-800/60 px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="roll-asc">Roll No (Asc)</option>
            <option value="roll-desc">Roll No (Desc)</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-16 justify-center items-center fixed inset-0 h-screen w-screen bg-black/60 z-60">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-fuchsia-500 animate-spin-slow"></div>
            </div>
            <p className="text-white text-xl text-center animate-pulse">Loading…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* Students List */}
        <div className="flex flex-wrap justify-left gap-6">
          {sortedStudents.map((s) => (
            <div
              key={s._id}
              className="w-full sm:w-[48%] lg:w-[31%] 
                 bg-gradient-to-br from-slate-900/60 to-slate-800/40 
                 rounded-2xl border border-white/10 p-5 
                 shadow-lg shadow-black/40 backdrop-blur-xl 
                 flex flex-col justify-between 
                 hover:scale-[1.02] transition duration-300"
            >
              {/* Top section: Profile + Info */}
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cyan-400/30 shadow-md">
                  <img
                    src={s.profilePicture || "/defaultAvatar.png"}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{s.name}</h2>
                  <p className="text-sm text-cyan-300">Roll No: {s.rollNumber}</p>
                  <p className="text-xs text-white/70">{s.email}</p>
                </div>
              </div>

              {/* Extra Info */}
              <div className="mt-3 text-xs text-white/60 space-y-1">
                {s.phone && <p>📞 {s.phone}</p>}
                {s.course && <p>📘 {s.course}</p>}
                {s.section && <p>🏫 {s.section}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/admin/studentDashboard/${s._id}`}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/admin/studentAttendence/${s._id}`}
                  className="flex-1 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 shadow-md hover:scale-105 transition"
                >
                  Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Students */}
        {!loading && sortedStudents.length === 0 && (
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
