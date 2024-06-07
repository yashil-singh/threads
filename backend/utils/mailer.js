import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: {
        name: "Threads",
        address: process.env.MAILER_USER,
      },
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

export default sendMail;
