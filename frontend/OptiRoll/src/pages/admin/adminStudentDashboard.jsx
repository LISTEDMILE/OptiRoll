import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";

export default function AdminStudentDashboard() {
  const { sid } = useParams();
  const [student, setStudent] = useState(null); // single student
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${ApiUrl}/admin/studentDashboard/${sid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (data.errors) {
          setErrors(data.errors);
        } else {
          setStudent(data.student); // set the single student object
        }
      } catch (err) {
        console.error(err.message);
        setErrors(["Something went wrong"]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [sid]);

  if (loading) return <div className="p-4 text-center">Loading student...</div>;

  if (errors.length > 0)
    return (
      <div className="p-4 text-red-500 text-center">
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Student Dashboard
      </h1>

      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Father's Name</th>
            <th className="border border-gray-300 p-3">Class</th>
            <th className="border border-gray-300 p-3">Phone</th>
            <th className="border border-gray-300 p-3">Email</th>
            <th className="border border-gray-300 p-3">Password</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center bg-white hover:bg-gray-50 transition">
            <td className="border border-gray-300 p-3">{student.name || "N/A"}</td>
            <td className="border border-gray-300 p-3">{student.fatherName || "N/A"}</td>
            <td className="border border-gray-300 p-3">{student.class || "N/A"}</td>
            <td className="border border-gray-300 p-3">{student.phone || "N/A"}</td>
            <td className="border border-gray-300 p-3">{student.email || "N/A"}</td>
            <td className="border border-gray-300 p-3">{student.password || "N/A"}</td>
            <td className="border border-gray-300 p-3">
              <button
                onClick={() => navigate(`/attendance/${student._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                View Attendance
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
