import "./App.css";
import React, { useState, useEffect } from "react";
import PAGES from "./controllers/pages";
import LOGIN from "./pages/login";
import SIGNUP from "./pages/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VERIFY from "./pages/verify";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return children;
};

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PAGES />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LOGIN />} />
          <Route path="/signup" element={<SIGNUP />} />
          <Route path="/verify" element={<VERIFY />} />
          <Route path="/profile/:userName" element={<PAGES />} />
          <Route path="/:userName" element={<PAGES />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
