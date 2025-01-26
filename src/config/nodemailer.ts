import nodemailer from 'nodemailer';

const transporter  = nodemailer.createTransport({
    service:"gmail",
    port:587,
    secure:false,
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
})

export default transporter;