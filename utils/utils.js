import nodemailer from "nodemailer";

export async function sendMessage(sub, txt) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  const message = {
    from: process.env.MAIL_USERNAME,
    to: process.env.MESSAGE_TO,
    subject: sub,
    text: txt,
  };

  

  try {
    await transporter.sendMail(message);
    console.log("Message sent with OAuth2");
  } catch (err) {
    console.error("Message not sent - " + err);
  }
}
