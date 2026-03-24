import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GenerateTicket from "./pages/GenerateTicket";
import VerifyTicket from "./pages/VerifyTicket";
import Login from "./pages/Login";

function App() {
  // ✅ State me role rakhenge
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  // ✅ Jab role change ho to update kare
  useEffect(() => {
    const updateRole = () => {
      setRole(sessionStorage.getItem("role"));
    };

    window.addEventListener("storage", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
    };
  }, []);

  return (
    <div className="container">
      <h1 className="title">
  Bus Ticket System 
  <span className="bus-icon">🚍</span>
</h1>
    <HashRouter>
      <Routes>
        {/* 🔐 Default login page */}
        <Route path="/login" element={<Login />} />

        {/* 👨‍✈️ Conductor */}
        <Route
          path="/"
          element={
            role === "conductor" ? <GenerateTicket /> : <Navigate to="/login" />
          }
        />

        {/* 🔍 Checker */}
        <Route
          path="/verify"
          element={
            role === "checker" ? <VerifyTicket /> : <Navigate to="/login" />
          }
        />

        {/* 🔥 Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
    
</div>
  );
}

export default App;