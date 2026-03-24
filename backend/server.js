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

//  Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  from: String,
  to: String,
  fare: Number,
  busNo: String,
  time: Date
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// ✅ Create Ticket API (Error Handling Added)
app.post("/create-ticket", async (req, res) => {
  try {
    const { from, to, fare, busNo } = req.body;

    // Validation (important)
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

    const qr = await QRCode.toDataURL(ticketId);

    res.status(200).json({ ticketId, qr });

  } catch (error) {
    console.log("Create Ticket Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Verify Ticket API (Error Handling Added)
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

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});