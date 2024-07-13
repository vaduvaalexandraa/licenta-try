const nodemailer = require('nodemailer');

// Funcție pentru trimiterea email-ului
const sendEmail = async (name, email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "alexandravaduva68@gmail.com",
            pass: "jrns yubl diai kacg",
        }
    });

    const mailOptions = {
        from: `${name} <${email}>`, 
        to: 'readwithmelicenta@gmail.com', 
        subject: subject,
        text: `${name} (${email}) a transmis urmatorul mesaj: ${message}`
    };

    try {
        // Trimiterea email-ului
        const info = await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes:', info.messageId);
        return { success: true, message: 'Email trimis cu succes.' };
    } catch (error) {
        console.error('Eroare la trimiterea emailului:', error);
        return { success: false, message: 'Eroare la trimiterea emailului.' };
    }
};

module.exports = { sendEmail };
