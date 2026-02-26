import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/connectDb";
import { mailSend } from "@/lib/mailSend";

export async function PATCH(request: NextRequest) {
    try {
        // Parse OTP from request body
        const { otp, email } = await request.json();

        // Get authenticated session
        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized request.",
            }, { status: 401 });
        }

        // Connect to DB
        const { usersCollection } = await connectDb();

        // Find user
        const existingUser = await usersCollection.findOne({ email: email });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found.",
            }, { status: 404 });
        }

        // Check if OTP matches
        if (existingUser.forgetPasswordOtp?.toString() !== otp?.toString()) {
            return NextResponse.json({
                success: false,
                message: "Invalid OTP.",
            }, { status: 400 });
        }

        // Update user's verification status
        const readymadePass = Math.floor(10000000 + Math.random() * 90000000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(readymadePass, salt);
        
        const result = await usersCollection.updateOne(
            { email },
            { $set: { password: hashedPassword }, $unset: { forgetPasswordOtp: "" } }
        );

        const mailInfo = {
            to: email,
            subject: "Account Login - Readymade Password",
            text: `Hello ${existingUser?.name},
    
                Thank you for stay with Mitra Cake Shop!
    
                To complete your login, please use the following Readymade Password:
    
                Readymade Password: ${readymadePass}
    
                This code is valid for 5 minutes. Please do not share this code with anyone.
    
                If you did not request this, please ignore this email.
    
                Best regards,
                Team Mitra`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <p style="color: #ec4899;">Hello ${existingUser?.name},</p>
                    <p style="color: black;">Thank you for stay with Mitra Cake Shop!</p>
                    <p style="font-size: 18px;">
                        <strong>Your Readymade Password:</strong> 
                        <span style="color: #ec4899; font-weight: bold;">${readymadePass}</span>
                    </p>
                    <p style="color: black;">Please do not share this password with anyone.</p>
                <p style="color: black;">If you did not request this, simply ignore this email.</p>
                <br/>
                <p style="color: black;">Best regards,<br/><strong>Team Mitra</strong></p>
                </div>`,
        };

        // Send verification email

        if (result.modifiedCount > 0) {
            await mailSend(mailInfo);
            return NextResponse.json({
                success: true,
                message: "We Send a email with password.",
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to send password.",
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("❌ Verification error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong. Please try again later.",
        }, { status: 500 });
    }
}
