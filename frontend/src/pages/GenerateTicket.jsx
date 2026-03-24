import { useState } from "react";
import axios from "axios";

function GenerateTicket() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    fare: "",
    busNo: ""
  });

  const [qr, setQr] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Dummy fare calculation (for now)
  const getDistance = () => {
    const fakeDistance = Math.floor(Math.random() * 100);
    const fare = fakeDistance * 1;

    setForm({ ...form, fare });
  };
  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };
  const handleGenerateAndPrint = async () => {
    try {
      const res = await axios.post("http://localhost:5000/create-ticket", form);

      const qrCode = res.data.qr;
      setQr(qrCode);

      // 🔥 Print window open
      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
      <html>
      <head>
        <title>Bus Ticket</title>
        <style>
          @media print {
            body {
              margin: 0;
            }
          }
  
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
  
          h2 {
            margin: 5px 0;
          }
  
          p {
            margin: 4px 0;
          }
  
          hr {
            margin: 8px 0;
          }
  
          img {
            margin-top: 10px;
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
        <script>
        window.onbeforeunload = function () {
          window.close();
        };
      </script>
      </body>
    </html>
      `);


      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();


        // ✅ print hone ke baad window close
        printWindow.onafterprint = () => {
          printWindow.close();
        };
        // ✅ Form reset
        setForm({
          from: "",
          to: "",
          fare: "",
          busNo: ""
        });

        // ✅ QR bhi hata do
        setQr("");

        // 🔥 fallback (agar event na chale)
        setTimeout(() => {
          printWindow.close();
        }, 2000);
        

      }, 800);


    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <h2>Generate Ticket</h2>

      <input type="text" name="from" placeholder="From" onChange={handleChange} />
      <input type="text" name="to" placeholder="To" onChange={handleChange} />
      <input type="number" name="fare" value={form.fare} readOnly />
      <input type="text" name="busNo" placeholder="Bus Number" onChange={handleChange} />

      <button onClick={getDistance}>Calculate Fare</button>
      <button onClick={handleGenerateAndPrint}>
        Generate & Print Ticket 🖨️
      </button>

      <button onClick={handleLogout}>Logout 🚪</button>


      {qr && (
        <div className="qr-box">
          <h3>Your Ticket QR</h3>
          <img src={qr} alt="QR" />

        </div>
      )}
    </div>
  );
}

export default GenerateTicket;