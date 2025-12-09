import nodemailer from "nodemailer";

// Transporter Config (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Apni .env file me ye add karein
    pass: process.env.EMAIL_PASS, // App Password (Not regular password)
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"DevSamp Notifications" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text, // Plain text version
      html: html || text, // HTML version (Optional)
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return false;
  }
};