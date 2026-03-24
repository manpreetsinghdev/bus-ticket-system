import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GenerateTicket from "./pages/GenerateTicket";
import VerifyTicket from "./pages/VerifyTicket";
import Login from "./pages/Login";

function App() {
  const role = localStorage.getItem("role");

  return (
    <div className="container">
      <h1 className="title">
  Bus Ticket System 
  <span className="bus-icon">🚍</span>
</h1>
    <BrowserRouter>
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
    </BrowserRouter>
    
</div>
  );
}

export default App;