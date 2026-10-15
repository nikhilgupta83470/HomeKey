import nodemailer from "nodemailer";

export async function notifyAdmin(subject, text) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    NOTIFY_EMAIL,
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.warn(
      "Email notification skipped: SMTP_USER, SMTP_PASS, or NOTIFY_EMAIL is missing.",
    );
    return;
  }

  
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
  },
});


 try {
   console.log("Checking Gmail SMTP connection...");

   await transporter.verify();

   console.log("SMTP connection verified successfully.");
   const info = await transporter.sendMail({
     from: `"House Broker Website" <${SMTP_USER}>`,
     to: NOTIFY_EMAIL,
     subject,
     text,
   });

   console.log("Admin notification email sent:", info.messageId);
 } catch (error) {
   console.error("Email delivery error:", error.message);
   throw error;
 }
}
