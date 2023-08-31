import nodemailer from 'nodemailer';

export  const Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ,
    port:  587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
    }
});