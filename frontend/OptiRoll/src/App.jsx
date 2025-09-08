import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";



import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";

function App() {

  const route = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/auth/signUp", element: <SignUp /> },
    {path:"/auth/login",element:<Login/>}
  ]);


  return <RouterProvider router={route}></RouterProvider>
}

export default App
