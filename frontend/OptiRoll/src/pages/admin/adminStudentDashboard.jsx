import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

export default function AdminStudentDashboard() {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${ApiUrl}/admin/studentDashboard/${sid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (data.errors) setErrors(data.errors);
        else setStudent(data.student);
      } catch (err) {
        console.error(err.message);
        setErrors(["Something went wrong"]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [sid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    try {
      const res = await fetch(`${ApiUrl}/admin/editStudentDashboard/${sid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(student),
      });

      const data = await res.json();
      if (data.errors) setErrors(data.errors);
      else setMessage("Student updated successfully!");
    } catch (err) {
      console.error(err.message);
      setErrors(["Something went wrong"]);
    }
  };

  const deleteStudent = async (e) => {
    try {
      const res = await fetch(`${ApiUrl}/admin/deleteStudent/${sid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.errors) setErrors(data.errors);
      else {
        alert("Student deleted successfully");
        navigate("/admin/studentList");
      }
    } catch (err) {
      console.error(err.message);
      setErrors(["Something went wrong"]);
    }
  };

  if (loading)
    return <div className="p-4 text-center text-white">Loading student...</div>;

  if (errors.length > 0)
    return (
      <div className="p-4 text-red-400 text-center">
        {errors.map((err, i) => (
          <div key={i}>{err}</div>
        ))}
      </div>
    );

  if (!student)
    return (
      <div className="p-4 text-gray-500 text-center bg-gray-100 rounded">
        No student found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Student Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={student.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/5 text-white placeholder-white/50 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
              placeholder="John Doe"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Father's Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={student.fatherName || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/5 text-white placeholder-white/50 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
              placeholder="Father's Name"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Class
            </label>
            <input
              type="text"
              name="class"
              value={student.class || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/5 text-white placeholder-white/50 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
              placeholder="10th Grade"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={student.phone || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/5 text-white placeholder-white/50 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Email
            </label>
            <input
              type="text"
              value={student.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/20 text-white/70 placeholder-white/50 outline-none cursor-not-allowed"
            />
          </div>

          {/* Password (Disabled) */}
          <div>
            <label className="block mb-1 font-semibold text-white/90">
              Password
            </label>
            <input
              type="text"
              value={student.password || ""}
              disabled
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/20 text-white/70 placeholder-white/50 outline-none cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-[0.98]"
          >
            Update Student
          </button>

          {message && (
            <div className="mt-3 text-green-400 font-medium text-center">
              {message}
            </div>
          )}
        </form>

        <button
          onClick={() => setShowDelete(true)}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-[0.98]"
        >
          Delete Student
        </button>
      </div>
      {showDelete && (
        <div className="inset-0 w-screen h-screen fixed flex flex-col justify-center items-center gap-12">
          {/* Modal */}
          <div className="z-20 bg-white rounded-3xl shadow-2xl p-6 w-96 flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Are you sure you want to delete this student?
            </h2>
            <div className="flex justify-between gap-4 mt-4 w-full">
              <button
                onClick={() => deleteStudent()}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-md transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 shadow-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div
            className="inset-0 w-screen h-screen fixed z-10 bg-black/60"
            onClick={() => setShowDelete(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
