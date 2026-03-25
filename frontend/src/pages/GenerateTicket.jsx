import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GenerateTicket() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    fare: "",
    busNo: ""
  });

  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Dummy fare calculation
  const getDistance = () => {
    const fakeDistance = Math.floor(Math.random() * 100);
    const fare = fakeDistance * 10;

    setForm({ ...form, fare });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleGenerateAndPrint = async () => {

    // ✅ Validation
    if (!form.from || !form.to || !form.fare || !form.busNo) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://bus-ticket-system-2.onrender.com/create-ticket",
        form
      );

      const qrCode = res.data.qr;
      setQr(qrCode);

      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
      <html>
      <head>
        <title>Bus Ticket</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: monospace;
          }
          .ticket {
            width: 250px;
            border: 2px dashed black;
            padding: 15px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <h2>STATE TRANSPORT</h2>
          <hr/>
          <p><b>From:</b> ${form.from}</p>
          <p><b>To:</b> ${form.to}</p>
          <p><b>Fare:</b> ₹${form.fare}</p>
          <p><b>Bus:</b> ${form.busNo}</p>
          <hr/>
          <img src="${qrCode}" width="120"/>
          <p>Valid Ticket</p>
        </div>
      </body>
      </html>
      `);

      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
        };
        

      }, 500);

    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Ticket</h2>

      {/* ✅ Controlled Inputs */}
      <input
        type="text"
        name="from"
        placeholder="From"
        value={form.from}
        onChange={handleChange}
      />

      <input
        type="text"
        name="to"
        placeholder="To"
        value={form.to}
        onChange={handleChange}
      />

      <input
        type="number"
        name="fare"
        value={form.fare}
        readOnly
      />

      <input
        type="text"
        name="busNo"
        placeholder="Bus Number"
        value={form.busNo}
        onChange={handleChange}
      />

      <button onClick={getDistance}>Calculate Fare</button>

      <button onClick={handleGenerateAndPrint} disabled={loading}>
        {loading ? "Generating..." : "Generate & Print Ticket 🖨️"}
      </button>

      <button onClick={handleLogout}>Logout 🚪</button>


    </div>
  );
}

export default GenerateTicket;