import nodemailer from "nodemailer";

type MailInfo = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export const mailSend = async (mailInfo: MailInfo) => {
  const user = process.env.NODEMAILER_USER;
  const pass = process.env.NODEMAILER_PASS;

  // 1) Guard: env missing হলে এখানেই থামাও (না হলে 500 হয়ে যাবে)
  if (!user || !pass) {
    console.error("MAIL ENV MISSING =>", {
      hasUser: !!user,
      passLen: pass?.length,
    });
    return {
      success: false,
      error: new Error("Nodemailer env missing (NODEMAILER_USER/PASS)"),
    };
  }

  try {
    console.log("MAIL ENV CHECK =>", {
      user,
      passLen: pass.length,
      to: mailInfo?.to,
    });

    // 2) Create transporter (explicit SMTP config for Gmail)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // secure port
      secure: true, // true for 465, false for 587
      auth: {
        user,
        pass,
      },
      // optional but helpful debug
      logger: true,
      debug: true,
    });

    // 3) Verify (auth + connection check)
    await transporter.verify();
    console.log("MAIL VERIFY OK");

    // 4) Send mail
    const info = await transporter.sendMail({
      from: `"Mitra Mart" <${user}>`, // from mismatch কমে
      to: mailInfo.to,
      subject: mailInfo.subject,
      text: mailInfo.text || "",
      html: mailInfo.html || "",
    });

    console.log("MAIL SENT =>", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return { success: true, info };
  } catch (error: any) {
    // 5) Print maximum useful info (Gmail সাধারণত এখানে 535/EAUTH দেয়)
    console.error("MAIL ERROR =>", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
      responseCode: error?.responseCode,
      command: error?.command,
      stack: error?.stack,
    });

    return { success: false, error };
  }
};