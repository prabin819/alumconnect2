const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (SMTP, Mailtrap, SendGrid, etc.)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com'
    port: process.env.SMTP_PORT, // e.g., 587 (Gmail)
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // your email (e.g., 'user@gmail.com')
      pass: process.env.SMTP_PASSWORD, // your email password or app password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"AlumConnect" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: options.email, // recipient (user's email)
    subject: options.subject, // email subject
    text: options.message, // plain text body
    // html: `<p>${options.message}</p>`, // (optional) HTML version
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
