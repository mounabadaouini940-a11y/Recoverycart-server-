// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* CONFIGURATION - عمري الإيميل و App Password فـ .env */
const STORE_EMAIL = process.env.STORE_EMAIL;
const STORE_APP_PASSWORD = process.env.STORE_APP_PASSWORD;
const STORE_NAME = process.env.STORE_NAME || "My Store";

/* EMAIL TRANSPORT */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: STORE_EMAIL,
    pass: STORE_APP_PASSWORD
  }
});

/* EMAIL TEMPLATES */
const emails  = [
  {
    delay: 60 * 60 * 1000, // 1 hour
    subject: "You left something behind 🛒",
    html: (storeName, cartUrl) => `<p>Hi there 👋</p>
           <p>It looks like you added some items to your cart but didn’t complete your checkout.</p>
           <p>Your cart is still saved and waiting for you.</p>
           <p>👉 <a href="${cartUrl}">Complete your purchase</a> anytime before items run out.</p>
           <p>Best regards,<br><strong>${storeName}</strong></p>`
  },
  {
    delay: 24 * 60 * 60 * 1000, // 24 hours
    subject: "Your cart is waiting for you",
    html: (storeName, cartUrl) => `<p>Hi 👋</p>
           <p>Your cart is still waiting.</p>
           <p>Many customers love these items — don’t miss out.</p>
           <p>🛒 <a href="${cartUrl}">Resume your checkout</a> anytime.</p>
           <p>Warm regards,<br><strong>${storeName}</strong></p>`
  },
  {
    delay: 72 * 60 * 60 * 1000, // 72 hours
    subject: "Final reminder — your cart will expire soon",
    html: (storeName, cartUrl) => `<p>Hello 👋</p>
           <p>This is a final reminder about the items left in your cart.</p>
           <p>⏳ <a href="${cartUrl}">Complete your purchase</a> before they go out of stock.</p>
           <p>Thank you for visiting <strong>${storeName}</strong>.</p>`
  }
];

/* ROUTE لاستقبال بيانات السلة من السكريبت */
app.post("/abandoned-cart", (req, res) => {
  const { email, cartUrl, storeDomain } = req.body;

  if (!email || !cartUrl) {
    return res.status(400).json({ message: "Missing email or cartUrl" });
  }

  console.log(`New abandoned cart from ${storeDomain}: ${email} - ${cartUrl}`);

  // Schedule emails
  emails.forEach(template => {
    setTimeout(() => {
      transporter.sendMail({
        from: STORE_EMAIL,
        to: email,
        subject: template.subject,
        html: template.html(STORE_NAME, cartUrl)
      }, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }, template.delay);
  });

  res.json({ message: "Abandoned cart recorded. Emails will be sent." });
});

/* START SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
