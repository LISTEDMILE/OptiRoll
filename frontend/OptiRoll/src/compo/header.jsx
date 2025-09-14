import { useState } from "react";
import { ApiUrl } from "../../ApiUrl";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { MdOutlineMenu } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";


export default function Header() {
  const [password, setPassword] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const { isLoggedIn, loginType } = useSelector((store) => store.userInfo);
  const [ showMenu, setShowMenu ] = useState(false);

  const logout = async () => {
    try {
      const ress = await fetch(`${ApiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const res = await ress.json();
      alert(res.errors ? res.errors : "Logout Successfully");
      window.location.assign("/");
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
        window.location.assign("/");
      }
    } catch (err) {
      console.error("Error deleting Account:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between w-full px-6 py-2 md:px-12 md:py-4 ">
        {/* Brand Logo */}
        <Link to="/" className="flex gap-2 items-center">
          <img src="/Logo.png"  className="h-[40px]"/>
        <div
          
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent tracking-wide"
        >
           OptiRoll
          </div>
        </Link>

        

        <button onClick={() => setShowMenu(!showMenu)}> <MdOutlineMenu  className="text-3xl text-white"/></button>
       
        



        {showMenu &&
  <div className="fixed">
    <div
      className="inset-0 fixed h-screen w-screen z-10 bg-black opacity-60"
      onClick={() => setShowMenu(false)}
    ></div>
    <div className="scrollbar-hide right-0 top-0 overflow-y-scroll fixed min-h-screen w-[300px] bg-gradient-to-b from-slate-900 to-slate-800 p-8 shadow-2xl z-20 border-l border-white/10">
      {/* Close Button */}
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowMenu(false)}>
          <RxCross1 className="text-3xl text-white hover:text-rose-400 transition" />
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-4 text-white text-lg font-medium">
        <Link
          to="/"
          className="px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition"
          onClick={() => setShowMenu(false)}
        >
          Home
        </Link>

        {!isLoggedIn && (
          <Link
            to="/auth/login"
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:scale-105 transition"
            onClick={() => setShowMenu(false)}
          >
            Login / SignUp
          </Link>
        )}

        {isLoggedIn && loginType === "student" && (
          <>
            <Link
              to="/student/studentDashboard"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Student Dashboard
            </Link>
            <Link
              to="/student/studentAttendence"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Analytics
            </Link>
          </>
        )}

        {isLoggedIn && loginType === "teacher" && (
          <>
            <Link
              to="/teacher/markAttendence"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Mark Attendance
            </Link>
            <Link
              to="/teacher/toggleMarking"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Toggle Attendance
            </Link>
          </>
        )}

        {isLoggedIn && loginType === "admin" && (
          <>
            <Link
              to="/admin/studentList"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Manage Students
            </Link>
            <Link
              to="/admin/adminAttendence"
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 hover:scale-105 transition"
              onClick={() => setShowMenu(false)}
            >
              Class Data
            </Link>
            <button
              onClick={() => {
                setShowDelete(true);
                setShowMenu(false);
              }}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 transition"
            >
              Delete Account
            </button>
          </>
        )}

                {isLoggedIn && (
                  <>
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 hover:scale-105 transition"
          >
            Logout
                    </button>
                    </>
        )}
      </div>
    </div>
  </div>
        }
        



        
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 h-screen w-screen z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 h-screen w-screen bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDelete(false)}
          ></div>

          <div className="absolute bg-slate-900 rounded-xl shadow-xl w-[90%] md:w-[400px] p-6 border border-white/10 z-50">
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
