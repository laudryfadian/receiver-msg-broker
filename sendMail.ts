import nodemailer from 'nodemailer';

export const sendEmail = (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    auth: {
      user: 'admin@laudryfadian.tech',
      pass: 'Closehead87_'
    },
    secure: true,
  });
  
  const mailOptions = {
    from: 'admin@laudryfadian.tech',
    to: to,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;

    } else {
      console.log('Email berhasil dikirim: ' + info.response);
    }
  });
}