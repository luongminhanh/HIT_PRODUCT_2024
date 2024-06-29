require('dotenv').config();
const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

const sendMail = async(to, subject, htmlContent) => {
  const transport = nodeMailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: false,
    auth: {
      user: mailConfig.USERNAME,
      pass: mailConfig.PASSWORD,
    },
  });

  const options = {
    from: mailConfig.FROM_ADDRESS,
    to: to,
    subject: subject,
    html: htmlContent,
  };
  try{
    await transport.sendMail(options);
  }catch(err){
    console.log(err);
  }
};

module.exports = {sendMail};
