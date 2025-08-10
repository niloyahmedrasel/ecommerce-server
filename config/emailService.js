import http from 'http';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASS,
    // },
});

// Verify connection on startup
transporter.verify((error) => {
    if (error) {
      console.error('SMTP Connection Failed:', error);
    } else {
      console.log('SMTP Server Ready');
    }
  });

async function sendEmail(to, subject, text, html){
    // try {
    //     const info = await transporter.sendMail({
    //         from: `SHINE IIT ${process.env.EMAIL}`,
    //         to,
    //         subject,
    //         text,
    //         html,
    //     });
    //     console.log('Message Sent: ', info.messageId); 
    //     return { success: true, messageId: info.messageId };     
    // } catch (error) {
    //     console.error("Error Sending Email: ", error);
    //     return { 
    //         success: false, 
    //         error: error.response || error.message 
    //     };
    // }
}

export default sendEmail;