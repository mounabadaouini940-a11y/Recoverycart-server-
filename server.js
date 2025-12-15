‏const express = require("express");
‏const bodyParser = require("body-parser");
‏const nodemailer = require("nodemailer");
‏const cors = require("cors");

‏const app = express();
‏app.use(cors());
‏app.use(bodyParser.json());

/*
‏CONFIGURATION
كل متجر خاصو يعمّر هاد المعلومات ديالو
*/
‏const STORE_EMAIL = process.env.STORE_EMAIL;
‏const STORE_APP_PASSWORD = process.env.STORE_APP_PASSWORD;
‏const STORE_NAME = process.env.STORE_NAME;

/*
‏EMAIL TRANSPORT
*/
‏const transporter = nodemailer.createTransport({
‏  service: "gmail",
‏  auth: {
‏    user: STORE_EMAIL,
‏    pass: STORE_APP_PASSWORD
  }
});

/*
‏EMAIL TEMPLATES
*/
‏const emails  = [
  {
    delay: 60 * 60 * 1000,
    subject: "You left something behind 🛒",
    html: `<p>Hi there 👋</p>
           <p>It looks like you added some items to your cart but didn’t complete your checkout.</p>
           <p>Your cart is still saved and waiting for you.</p>
           <p>👉 Complete your purchase anytime before items run out.</p>
           <p>Best regards,<br><strong>${STORE_NAME}</strong></p>`
  },
  {
    delay: 24 * 60 * 60 * 1000,
    subject: "Your cart is waiting for you",
    html: `<p>Hi 👋</p>
           <p>Your cart is still waiting.</p>
           <p>Many customers love these items — don’t miss out.</p>
           <p>🛒 Resume your checkout anytime.</p>
           <p>Warm regards,<br><strong>${STORE_NAME}</strong></p>`
  },
  {
    delay: 72 * 60 * 60 * 1000,
    subject: "Final reminder — your cart will expire soon",
    html: `<p>Hello 👋</p>
           <p>This is a final reminder about the items left in your cart.</p>
           <p>⏳ Complete your purchase before they go out of stock.</p>
           <p>Thank you for visiting <strong>${STORE_NAME}</strong>.</p>`
  }
];
