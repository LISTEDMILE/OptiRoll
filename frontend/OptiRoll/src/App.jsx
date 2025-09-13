import React, { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Header from "./compo/header";
import AdminAddStudent from "./pages/admin/addStudent";
import AdminStudentList from "./pages/admin/adminStudentList";
import AdminStudentDashboard from "./pages/admin/adminStudentDashboard";
import StudentStudentDashboard from "./pages/student/studentStudentDashboard";
import TeacherMarkAttendance from "./pages/teacher/markAttendence";
import AdminStudentAttendance from "./pages/admin/adminStudentAttendence";
import StudentStudentAttendence from "./pages/student/studentStudentAttendence";
import { ApiUrl } from "../ApiUrl";
import TeacherToggleMarking from "./pages/teacher/teacherToggleMarking";
import AdminAdminAttendence from "./pages/admin/adminAdminAttendence";
import Footer from "./compo/footer";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer/>
    </>
  );
}

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAboutLogin = async () => {
      try {
        const response = await fetch(`${ApiUrl}/auth/me`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          dispatch(
            userActions.Login({
              loginType:data.loginType
            })
          );
        
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchAboutLogin();
  }, []);


  const route = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/auth/signUp", element: <SignUp /> },
        { path: "/auth/login", element: <Login /> },
        { path: "/admin/addStudent", element: <AdminAddStudent /> },
        { path: "/admin/studentList", element: <AdminStudentList /> },
        {
          path: "/admin/studentDashboard/:sid",
          element: <AdminStudentDashboard />,
        },
        {
          path: "/student/studentDashboard",
          element: <StudentStudentDashboard />,
        },
        { path: "/teacher/markAttendence", element: <TeacherMarkAttendance /> },
        { path: "/admin/studentAttendence/:sid", element: <AdminStudentAttendance /> },
        { path: "/student/studentAttendence", element: <StudentStudentAttendence /> },
        { path: "/teacher/toggleMarking", element: <TeacherToggleMarking /> },
        {path:"/admin/adminAttendence", element:<AdminAdminAttendence/>}
      ],
    },
  ]);

  return <RouterProvider router={route}></RouterProvider>;
}

export default App;
