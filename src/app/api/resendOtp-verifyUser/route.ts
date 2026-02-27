import connectDb from "@/lib/connectDb";
import { mailSend } from "@/lib/mailSend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const { email } = await request.json();
    try {
        const { usersCollection } = await connectDb();
        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const mailInfo = {
                to: email,
                subject: "Account Verification - OTP Code",
                text: `Hello ${existingUser.name},
    
                Thank you for registering with AR_Online_Shopbd!
    
                To complete your registration, please use the following One-Time Password (OTP):
    
                OTP: ${otp}
    
                This code is valid for 5 minutes. Please do not share this code with anyone.
    
                If you did not request this, please ignore this email.
    
                Best regards,
                Team Mitra`,
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <p style="color: #ec4899;">Hello ${existingUser.name},</p>
                    <p style="color: black;">Thank you for registering with AR_Online_Shopbd!</p>
                    <p style="font-size: 18px;">
                        <strong>Your OTP:</strong> 
                        <span style="color: #ec4899; font-weight: bold;">${otp}</span>
                    </p>
                    <p style="color: black;">This code is valid for 5 minutes. Please do not share this code with anyone.</p>
                <p style="color: black;">If you did not request this, simply ignore this email.</p>
                <br/>
                <p style="color: black;">Best regards,<br/><strong>Team Mitra</strong></p>
                </div>`,
            };

            // Send verification email
           const mailResponse = await mailSend(mailInfo);
            const expiry = Date.now() + 5 * 60 * 1000; // 5 mins later
            const result = await usersCollection.updateOne(
                { email },
                { $set: { userVerificationOtp: otp, otpExpiry: expiry } }
            );

            if (result.modifiedCount > 0 && mailResponse.success) {
                return NextResponse.json({ success: true, message: "OTP send to your email" });
            } else {
                return NextResponse.json({ success: false, message: "OTP send failed" });
            }

        }
    } catch (error: any) {
        console.log("Problem in resend otp - verify user route", error.message)
        return NextResponse.json({ message: "Something went wrong. Please try again later.", success: false })
    }
}