import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for navigation
import { ApiUrl } from "../../../ApiUrl";

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const sid = useParams(sid);
        const res = await fetch(`${ApiUrl}/admin/studentDashboard/${sid}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.errors?.[0] || "Failed to load students");
        }

        const data = await res.json();
        setStudents(data.studentsList || []);
      } catch (err) {
        console.error(err.messsage);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading)
    return <div className="p-4 text-center">Loading students...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {students.length === 0 ? (
        <div className="p-4 text-gray-500 text-center bg-gray-100 rounded">
          No students added yet.
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 p-3">#</th>
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
            {students.map((student, index) => (
              <tr
                key={student._id}
                className="text-center bg-white hover:bg-gray-50 transition"
              >
                <td className="border border-gray-300 p-3">{index + 1}</td>
                <td className="border border-gray-300 p-3">
                  {student.name || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {student.fatherName || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {student.class || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {student.phone || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {student.email || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {student.password || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  <button
                    onClick={() => navigate(`/attendance/${student._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    View Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
