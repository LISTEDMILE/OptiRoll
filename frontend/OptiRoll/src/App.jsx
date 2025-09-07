import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";



import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/auth/SignUp";

function App() {

  const route = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    {path:"/auth/signUp", element:<SignUp/>}
  ]);


  return <RouterProvider router={route}></RouterProvider>
}

export default App
