require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.PASS ? "Loaded ✅" : "Not Loaded ❌");

// Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// Debug mail
console.log("Transporter created 🚀");
transporter.verify((err, success) => {
  if (err) {
    console.log("Mail Error ❌:", err);
  } else {
    console.log("Mail server ready ✅");
  }
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  from: String,
  to: String,
  fare: Number,
  busNo: String,
  time: Date
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// ✅ CREATE TICKET (FIXED)
app.post("/create-ticket", async (req, res) => {
  try {
    const { from, to, fare, busNo } = req.body;

    if (!from || !to || !fare || !busNo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const ticketId = "TKT" + Date.now();

    const newTicket = new Ticket({
      ticketId,
      from,
      to,
      fare,
      busNo,
      time: new Date()
    });

    await newTicket.save();

    // ✅ MAIL SAFE (WILL NOT BREAK API)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "🚌 New Ticket Generated",
        text: `
From: ${from}
To: ${to}
Fare: ₹${fare}
Bus No: ${busNo}
Time: ${new Date().toLocaleString()}
`
      });
      console.log("Mail sent ✅");
    } catch (mailError) {
      console.log("Mail failed ❌:", mailError.message);
    }

    // ✅ ALWAYS SEND RESPONSE
    const qr = await QRCode.toDataURL(ticketId);

    res.status(200).json({ ticketId, qr });

  } catch (error) {
    console.log("Create Ticket Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// VERIFY API
app.get("/verify/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (ticket) {
      res.json({ status: "VALID", ticket });
    } else {
      res.status(404).json({ status: "INVALID" });
    }

  } catch (error) {
    console.log("Verify Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});