require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider
  auth: {
    user: "pixel8ddesign@gmail.com",
    pass: "Theredeemer",
  },
});

const cors = require("cors");
app.use(cors());
// Email sending endpoint
app.post("/send-order", async (req, res) => {
  const {
    name,
    lastName,
    tel,
    email,
    address,
    paymentMethod,
    deliveryMethod,
    itemsInCart,
  } = req.body;

  const itemsList = itemsInCart
    .map((item) => `- ${item.title} x ${item.quantity}`)
    .join("\n");

  const mailOptions = {
    from: "pixel8ddesign@gmail.com",
    to: "Nahtty38@gmail.com",
    subject: "New Order Received!",
    text: `
    New Order
    Customer Name: ${name} ${lastName}
    Phone: ${tel}
    Email: ${email}
    Address: ${address}
    Payment Method: ${paymentMethod}
    Delivery Method: ${deliveryMethod}

    Items in Cart:
    ${itemsList}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
app.all("*", (req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
