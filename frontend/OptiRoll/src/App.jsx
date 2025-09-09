import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Header from "./compo/header";
import AdminAddStudent from "./pages/admin/addStudent";
import AdminStudentList from "./pages/admin/adminStudentList";
import AdminStudentDashboard from "./pages/admin/adminStudentDashboard";

function Layout() {
  return (
    <>
      <Header />
      <Outlet /> {/* This is where the pages will render */}
    </>
  );
}

function App() {
  const route = createBrowserRouter(
    [{
      element: <Layout />,
      children: [{ path: "/", element: <LandingPage /> },
    { path: "/auth/signUp", element: <SignUp /> },
        { path: "/auth/login", element: <Login /> },
        { path: "/admin/addStudent", element: <AdminAddStudent /> },
        { path: "/admin/studentList", element: <AdminStudentList /> },
        {
          path:"/admin/studentDashboard/:sid", element:<AdminStudentDashboard/>
        }
      ]
    }
   
  ]);

  return (
  
     
      <RouterProvider router={route}></RouterProvider>
    
  );
}

export default App;
