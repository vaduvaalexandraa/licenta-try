const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
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
        text: "Buna! Multumim ca ti-ai creat cont pe platforma noastra!\nNe bucuram ca acum faci parte din membri comunitatii noastre!\n Iti uram lectura placuta!\nEchipa Read with me!",
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