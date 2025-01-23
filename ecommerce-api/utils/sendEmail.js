import nodemailer from "nodemailer";

/**
 * Sends an email using the specified options.
 * @param {Object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.html - The HTML content of the email.
 */
const sendEmail = async (options) => {
  // 1) Create a transporter (service responsible for sending emails)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address
    port: 465, // Secure port for Gmail
    secure: true, // Use SSL/TLS for secure connection
    logger: true, // Log email communication (for debugging purposes)
    debug: true, // Debug email communication (for detailed logs)
    secureConnection: true, // Enforce a secure connection
    auth: {
      user: process.env.EMAIL_HOST_USERNAME, // Email username from environment variables
      pass: process.env.EMAIL_HOST_PASSWORD, // Email password from environment variables
    },
    tls: {
      rejectUnauthorized: true, // Enforce certificate validation
    },
  });

  // 2) Define email options (sender, recipient, subject, and email content)
  const mailOptions = {
    from: "Buyfy Application <no-reply@buyfy.com>", // Email sender's name
    to: options.email, // Recipient's email address
    subject: options.subject, // Subject of the email
    html: options.html, // HTML content of the email
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
