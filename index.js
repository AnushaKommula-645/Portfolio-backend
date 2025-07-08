// backend/index.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, mail, msg } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS  
    }
  });

  const mailOptions = {
    from: mail,
    to: process.env.SMTP_USER,
    subject: `Message from ${name}`,
    text: msg
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).send("Failed to send message");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
