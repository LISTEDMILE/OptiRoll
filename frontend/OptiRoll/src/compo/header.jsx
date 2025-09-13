import { useState } from "react";
import { ApiUrl } from "../../ApiUrl";
import { Link } from "react-router";
import { useSelector } from "react-redux";

export default function Header() {
  const [password, setPassword] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const { isLoggedIn, loginType } = useSelector((store) => store.userInfo);

  const logout = async () => {
    try {
      const ress = await fetch(`${ApiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const res = await ress.json();
      alert(res.errors ? res.errors : "Logout Successfully");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

  const deleteAccount = async () => {
    try {
      const ress = await fetch(`${ApiUrl}/auth/deleteAccount`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const res = await ress.json();
      if (res.errors) {
        alert(res.errors);
      } else {
        alert("Account deleted Successfully.");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error deleting Account:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent tracking-wide"
        >
          OptiRoll
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-4">
          {/* Home */}
          <Link
            to="/"
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black hover:scale-105 transition"
          >
            Home
          </Link>

          {/* Auth */}
          {!isLoggedIn ? (
            <Link
              to="/auth/login"
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:scale-105 transition"
            >
              Login / SignUp
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:scale-105 transition"
            >
              Logout
            </button>
          )}

          {/* Student */}
          {isLoggedIn && loginType === "student" && (
            <>
              <Link
                to="/student/studentDashboard"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:scale-105 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/student/studentAttendence"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-400 to-rose-500 text-white hover:scale-105 transition"
              >
                Analytics
              </Link>
            </>
          )}

          {/* Teacher */}
          {isLoggedIn && loginType === "teacher" && (
            <>
            <Link
              to="/teacher/markAttendence"
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 transition"
            >
              Mark Attendance
            </Link>
            <Link
                to="/teacher/toggleMarking"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-105 transition"
              >
                Toggle Attendence
              </Link>
              </>
          )}

          {/* Admin */}
          {isLoggedIn && loginType === "admin" && (
            <>
              <Link
                to="/admin/studentList"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-105 transition"
              >
                Students
              </Link>
              <button
                onClick={() => setShowDelete(true)}
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 transition"
              >
                Delete Account
              </button>
               <Link
                to="/admin/adminAttendence"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-105 transition"
              >
                Class data
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDelete(false)}
          ></div>

          <div className="relative bg-slate-900 rounded-xl shadow-xl w-[90%] md:w-[400px] p-6 border border-white/10 z-50">
            <h2 className="text-2xl font-bold text-center text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-slate-300 text-center mb-6">
              Enter your password to permanently delete your account.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-slate-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-800 text-white"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:scale-105 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
