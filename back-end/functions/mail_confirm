const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for all other ports
  auth: {
    user: "alexandravaduva68@gmail.com",
    pass: "jrns yubl diai kacg",
  },
});

const sendMail = async (toEmail) => {
    try {
      const mailOptions = {
        from: 'Read with me! <alexandravaduva68@gmail.com>',
        to: toEmail,
        subject: "Welcome to Read with me!",
        text: "Hello! Thank you for registering on our website!\nWe are glad to have you as a member of our community!"
      };
      await transporter.sendMail(mailOptions);
      console.log('Email sent');
    } catch (err) {
      console.log(err);
    }
};

module.exports = sendMail;
  
  // Exemplu de folosire a funcției sendMail
  //sendMail('creator.stardoll1@gmail.com', 'Subiectul emailului', 'Acesta este conținutul emailului.');


// const mailOptions = {
//   from: 'creator.stardoll1@gmail.com',
//   to: 'vasileandrei21@stud.ase.ro',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!',
// };

// const sendMail = async () => {
//   try{
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent');
//   }catch(err){
//     console.log(err);
//   }
// };

// sendMail();