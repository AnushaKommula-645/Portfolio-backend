// // backend/index.js
// import express from 'express';
// import nodemailer from 'nodemailer';
// import cors from 'cors';

// const app = express();
// const PORT = process.env.PORT;


// app.use(cors());
// app.use(express.json());

// app.post('/contact', async (req, res) => {
//   const { name, mail, msg } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SMTP_USER, 
//       pass: process.env.SMTP_PASS  
//     }
//   });

//   const mailOptions = {
//     from: mail,
//     to: process.env.SMTP_USER,
//     subject: `Message from ${name}-${mail}`,
//     text: msg
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("Message sent successfully");
//   } catch (error) {
//     console.error("Email sending error:", error);
//     res.status(500).send("Failed to send message");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 10000;

//Allow your frontend domain only (for security)
app.use(
  cors({
    origin: [
      "https://myportfolio-gamma-three-96.vercel.app/", // ← replace this with your deployed frontend URL
      "http://localhost:5173", // for local React testing
    ],
    methods: ["POST", "GET"],
  })
);

app.use(express.json());


app.post("/contact", async (req, res) => {
  const { name, mail, msg } = req.body;

  if (!name || !mail || !msg) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Configure Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to YOU (your inbox)
    const mailOptions = {
      from: `${name} <${process.env.SMTP_USER}>`,
      replyTo: mail,
      to: process.env.SMTP_USER,
      subject: `New Message from ${name} (${mail})`,
      text: msg,
    };

    // Send main email
    await transporter.sendMail(mailOptions);

    // reply to the sender
    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: mail,
    //   subject: "Thanks for reaching out!",
    //   text: `Hi ${name},\n\nThank you for contacting me! I’ll get back to you soon.\n\n– Anusha Kommula`,
    // });

    console.log("Emails sent successfully!");
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
