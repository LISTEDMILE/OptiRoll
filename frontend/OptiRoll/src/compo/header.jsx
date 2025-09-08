import { ApiUrl } from "../../ApiUrl";

export default function Header() {
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
  return (
    <header>
      <button onClick={() => logout()}>Logout</button>
    </header>
  );
}
