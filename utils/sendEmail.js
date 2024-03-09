import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, htmlbody) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.BREVO_MAIL_API_KEY,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to:email,
      subject: subject, 
      html: htmlbody
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  } catch (error) {
    console.log(error);
  }
};
