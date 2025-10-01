import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";

export default function StudentStudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${ApiUrl}/student/studentDashboard`, {
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setStudent((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    try {
      const formData = new FormData();

      for (const key in student) {
        if (Array.isArray(student[key])) {
          formData.append(key, student[key].join(","));
        } else if (typeof student[key] === "object" && student[key] !== null) {
          for (const nestedKey in student[key]) {
            formData.append(`${key}[${nestedKey}]`, student[key][nestedKey]);
          }
        } else {
          formData.append(key, student[key]);
        }
      }

      if (newProfilePic) formData.append("profilePicture", newProfilePic);

      const res = await fetch(`${ApiUrl}/student/editStudentDashboard`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.errors) setErrors(data.errors);
      else {
        setMessage("Profile updated successfully!");
        setNewProfilePic(null);
        setPreviewPic(null);
        window.location.reload();
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">
          My Dashboard
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={previewPic || student.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
          />
          <label className="mt-4 cursor-pointer text-cyan-400 hover:underline">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <InputField label="Name" name="name" value={student.name} onChange={handleChange} />
          <InputField label="Roll Number" name="rollNumber" value={student.rollNumber} onChange={handleChange} />
          <InputField type="date" label="Date of Birth" name="dateOfBirth" value={student.dateOfBirth?.slice(0, 10)} onChange={handleChange} />
          <InputField label="Gender" name="gender" value={student.gender} onChange={handleChange} />
          <InputField label="Course" name="course" value={student.course} onChange={handleChange} />
          <InputField label="Year" name="year" value={student.year} onChange={handleChange} />
          <InputField label="Section" name="section" value={student.section} onChange={handleChange} />

          {/* Address */}
          <InputField label="Street" name="address.street" value={student.address?.street} onChange={handleChange} />
          <InputField label="City" name="address.city" value={student.address?.city} onChange={handleChange} />
          <InputField label="State" name="address.state" value={student.address?.state} onChange={handleChange} />
          <InputField label="ZIP" name="address.zip" value={student.address?.zip} onChange={handleChange} />
          <InputField label="Country" name="address.country" value={student.address?.country} onChange={handleChange} />

          {/* Parent Info */}
          <InputField label="Parent Name" name="parentName" value={student.parentName} onChange={handleChange} />
          <InputField label="Parent Phone" name="parentPhone" value={student.parentPhone} onChange={handleChange} />
          <InputField label="Parent Email" name="parentEmail" value={student.parentEmail} onChange={handleChange} />

          {/* Emergency Contact */}
          <InputField label="Emergency Contact Name" name="emergencyContact.name" value={student.emergencyContact?.name} onChange={handleChange} />
          <InputField label="Relation" name="emergencyContact.relation" value={student.emergencyContact?.relation} onChange={handleChange} />
          <InputField label="Emergency Phone" name="emergencyContact.phone" value={student.emergencyContact?.phone} onChange={handleChange} />

          {/* Extra */}
          <InputField label="Hobbies (comma separated)" name="hobbies" value={student.hobbies?.join(", ")} onChange={(e) => setStudent({ ...student, hobbies: e.target.value.split(",").map((h) => h.trim()) })} />
          <InputField label="Bio" name="bio" value={student.bio} onChange={handleChange} />
          <InputField label="Skills (comma separated)" name="skills" value={student.skills?.join(", ")} onChange={(e) => setStudent({ ...student, skills: e.target.value.split(",").map((s) => s.trim()) })} />
          <InputField label="Achievements (comma separated)" name="achievements" value={student.achievements?.join(", ")} onChange={(e) => setStudent({ ...student, achievements: e.target.value.split(",").map((a) => a.trim()) })} />

          {/* Contact Info */}
          <InputField label="Phone" name="phone" value={student.phone} onChange={handleChange} />
          <InputField label="Email" value={student.email} disabled />

          {/* Submit */}
          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-[0.98]">
            Update Profile
          </button>
          {message && <div className="mt-3 text-green-400 font-medium text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}

// Reusable InputField
function InputField({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block mb-1 font-semibold text-white/90">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-2xl border ${
          disabled
            ? "bg-white/20 text-white/70 cursor-not-allowed"
            : "bg-white/5 text-white focus:border-cyan-400 focus:bg-white/10"
        } border-white/20 placeholder-white/50 outline-none transition`}
        placeholder={label}
      />
    </div>
  );
}
