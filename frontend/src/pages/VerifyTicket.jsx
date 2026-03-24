import { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function VerifyTicket() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [startScan, setStartScan] = useState(false);

  // 🎥 Controlled Camera Scanner
  useEffect(() => {
    if (!startScan) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        setResult(decodedText);

        const res = await axios.get(
          `https://bus-ticket-system-2.onrender.com/verify/${decodedText}`
        );

        setStatus(res.data.status);

        // 🔥 Auto stop after scan
        scanner.clear();
        setStartScan(false);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [startScan]);
  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "#/login";
  };
  // 📂 Image Upload Scanner
  /*const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function () {
      img.src = reader.result;
    };

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setResult(code.data);

        const res = await axios.get(
          `http://localhost:5000/verify/${code.data}`
        );

        setStatus(res.data.status);
      } else {
        alert("QR not found ❌");
      }
    };

    reader.readAsDataURL(file);
  };*/

  return (
    <div className="card">
      <h2>Scan Ticket</h2>

      {/* 🔥 Control Buttons */}
      <button onClick={() => setStartScan(true)}>Start Scanning 📷</button>
      <button onClick={() => setStartScan(false)}>Stop Scanning ❌</button>

      {/* Camera Scanner */}
      {startScan && <div id="reader" style={{ width: "100%" }}></div>}

      {/*<h3>OR Upload QR Image</h3>*/}

      {/*<input type="file" accept="image/*" onChange={handleImageUpload} />*/}

      <h3>Scanned ID: {result}</h3>

      {status && (
        <h2 style={{ color: status === "VALID" ? "green" : "red" }}>
          {status}
        </h2>
      )}
      <button onClick={handleLogout}>Logout 🚪</button>
    </div>
    
  );
}

export default VerifyTicket;