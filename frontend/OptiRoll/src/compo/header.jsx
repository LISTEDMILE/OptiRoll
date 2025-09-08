import { useState } from "react";
import { ApiUrl } from "../../ApiUrl";

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
      const ress = await fetch(`${ApiUrl}/auth/deleteAccount`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password:password
          })

        }
      );
      const res = await ress.json();
      if (res.errors) {
        alert(res.errors);
      }
      else {
        alert("Account deleted Successfully.");
        window.location.href = "/";
      }
    }
    catch (err) {
      console.error("Error deleting Account : ", err);
      alert( "Something went wrong.");
    }
  }
  return (
    <header>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => setShowDelete(true)}>Delete Account</button>
      {showDelete && (
        <div className="inset-0 h-screen w-screen fixed flex justify-center items-center z-10">
  <div className="inset-0 bg-black h-screen w-screen fixed z-20 opacity-60" onClick={() => setShowDelete(false)}></div>
          <div className="h-[80%] w-[90%] md:w-[69%] bg-gray-400 z-30 rounded-lg flex flex-col justify-center items-center gap-12">
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white"></input>
            <button onClick={()=>{deleteAccount()}} >sdfsdf</button>
          </div>
          </div>
      )}
    
    </header>
  );
}
