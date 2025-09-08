import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Header from "./compo/header";

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
    { path: "/auth/login", element: <Login /> },]
    }
   
  ]);

  return (
  
     
      <RouterProvider router={route}></RouterProvider>
    
  );
}

export default App;
