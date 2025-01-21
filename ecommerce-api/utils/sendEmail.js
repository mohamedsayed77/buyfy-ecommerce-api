import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1) create transporter (service that will send email )
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: true,
    auth: {
      user: process.env.EMAIL_HOST_USERNAME,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  //   2) define email options (from, to, subject,email contents,)
  const mailOptions = {
    from: "Buyfy Application",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  // 3) send email
  await transporter.sendMail(mailOptions);
};
export default sendEmail;
