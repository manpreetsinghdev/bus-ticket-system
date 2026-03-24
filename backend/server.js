const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/busTickets")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

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

// Create Ticket API
app.post("/create-ticket", async (req, res) => {
  const { from, to, fare, busNo } = req.body;

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

  const qr = await QRCode.toDataURL(ticketId);

  res.json({ ticketId, qr });
});

// Verify Ticket API
app.get("/verify/:id", async (req, res) => {
  const ticket = await Ticket.findOne({ ticketId: req.params.id });

  if (ticket) {
    res.json({ status: "VALID", ticket });
  } else {
    res.json({ status: "INVALID" });
  }
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});