import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    // 👨‍✈️ Conductor login
    if (id === "conductor123" && pass === "123") {
      localStorage.setItem("role", "conductor");
      window.location.href = "/";
    }

    // 🔍 Checker login
    else if (id === "checker123" && pass === "123") {
      localStorage.setItem("role", "checker");
      window.location.href =  "/verify";
    }

    else {
      setError("Invalid Credentials ❌");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="User ID"
        onChange={(e) => setId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;