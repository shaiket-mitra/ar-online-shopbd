import nodemailer from "nodemailer";

export async function mailSend(mailInfo: any) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Himu Mitra" <himu.mitra97@gmail.com>', // Sender name + email
            to: mailInfo.to,
            subject: mailInfo.subject,
            text: mailInfo.text,
            html: mailInfo.html || `<p>${mailInfo.text}</p>`, // Fallback to basic HTML
        });

        return { message: "Email sent successfully", success: true};

    } catch (error: any) {
        return { error: error.message };
    }
}
