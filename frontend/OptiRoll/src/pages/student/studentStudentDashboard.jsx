import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../../ApiUrl";

export default function StudentStudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [errorsInside, setErrorsInside] = useState([]);
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
    setErrorsInside([]);
    setMessage("");

    try {
      const formData = new FormData();

      for (const key in student) {
        if (Array.isArray(student[key])) {
          student[key].forEach((item) => { if (item) formData.append(key, item) });
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

      if (data.errors && data.errors.length > 0) {
        setErrorsInside(data.errors);
        setMessage("");
      } else if (data.student) {
        setMessage("Profile updated successfully!");
        setNewProfilePic(null);
        setPreviewPic(null);
        setStudent(data.student);
      } else {
        setErrorsInside(["Something went wrong"]);
      }
    } catch (err) {
      console.error(err.message);
      setErrorsInside(["Something went wrong"]);
    }
  };

  if (loading)
    return   <div className="flex flex-col gap-16 justify-center items-center fixed inset-0 h-screen w-screen bg-black/60 z-60">
          <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin"></div>
      <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-fuchsia-500 animate-spin-slow"></div>
    </div>
          <p className="text-white text-xl text-center animate-pulse">Loading…</p>
           
          </div>
    

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
            src={previewPic || student.profilePicture || "/defaultAvatar.png"}
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

          {/* Dynamic Array Fields */}
          <DynamicArrayInput
            label="Hobbies"
            values={student.hobbies || []}
            setValues={(arr) => setStudent({ ...student, hobbies: arr })}
          />
          <InputField label="Bio" name="bio" value={student.bio} onChange={handleChange} />
          <DynamicArrayInput
            label="Skills"
            values={student.skills || []}
            setValues={(arr) => setStudent({ ...student, skills: arr })}
          />
          <DynamicArrayInput
            label="Achievements"
            values={student.achievements || []}
            setValues={(arr) => setStudent({ ...student, achievements: arr })}
          />

          {/* Contact Info */}
          <InputField label="Phone" name="phone" value={student.phone} onChange={handleChange} />
          <InputField label="Email" value={student.email} disabled />

          {/* Errors & Submit */}
          {errorsInside.length > 0 && (
            <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-8 py-3 text-sm text-rose-200">
              {errorsInside.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </div>
          )}
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

// Dynamic Array Input
function DynamicArrayInput({ label, values, setValues }) {
  const addItem = () => setValues([...values, ""]);
  const removeItem = (index) => setValues(values.filter((_, i) => i !== index));
  const handleChange = (index, val) => {
    const newArr = [...values];
    newArr[index] = val;
    setValues(newArr);
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold text-white/90">{label}</label>
      {values.map((val, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            className="flex-1 px-4 py-2 rounded-2xl border border-white/20 bg-white/5 text-white outline-none"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="px-3 py-2 bg-red-500 rounded-xl text-white font-semibold hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="mt-2 px-4 py-2 bg-cyan-400 rounded-xl text-slate-950 font-semibold hover:bg-cyan-500"
      >
        Add {label}
      </button>
    </div>
  );
}
