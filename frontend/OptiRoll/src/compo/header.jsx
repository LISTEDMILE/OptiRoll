import { useState } from "react";
import { ApiUrl } from "../../ApiUrl";
import { Link } from "react-router";

export default function Header() {
  const [password, setPassword] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const logout = async () => {
    try {
      const ress = await fetch(`${ApiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const res = await ress.json();
      if (res.errors) {
        alert(res.errors);
      } else {
        alert("Logout Successfully");
      }
    } catch (err) {
      alert([err.message || "Something went wrong."]);
    }
  };

  const deleteAccount = async () => {
    try {
      const ress = await fetch(`${ApiUrl}/auth/deleteAccount`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: password,
        }),
      });
      const res = await ress.json();
      if (res.errors) {
        alert(res.errors);
      } else {
        alert("Account deleted Successfully.");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error deleting Account : ", err);
      alert("Something went wrong.");
    }
  };
  return (
    <header className="flex justify-end p-4 bg-gray-800 text-white shadow-md">
      <Link
        to={"/"}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        Home
      </Link>

      <button
        onClick={logout}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium mr-3 transition"
      >
        Logout
      </button>
      <Link
        to={"/admin/studentList"}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        Students
      </Link>
      <button
        onClick={() => setShowDelete(true)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
      >
        Delete Account
      </button>
       <Link
        to={"/auth/login"}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        Login/SignUp
      </Link>

      {showDelete && (
        <div className="inset-0 fixed flex justify-center items-center z-50">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setShowDelete(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-lg w-[90%] md:w-[500px] p-6 z-50">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Confirm Account Deletion
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Please enter your password to permanently delete your account.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
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
