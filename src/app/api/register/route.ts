import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mailSend } from "@/lib/mailSend";

export async function POST(req: NextRequest) {
    try {
        const userInfo = await req.json();
        const { name, email, password = "halum", provider = "credentials", image = "https://res.cloudinary.com/dnr1svamu/image/upload/v1739601314/placeholder_c0lj2n.jpg" } = userInfo;
        const { usersCollection } = await connectDb();
        const query: any = { email };
        const existingUser = await usersCollection.findOne(query);

        if (existingUser) {
            return NextResponse.json({ message: "User already exists", success: true }, { status: 200 });

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const newUser = await usersCollection.insertOne({
            name,
            email,
            gender: "N/A",
            password: hashedPassword,
            provider,
            role: "Customer",
            image,
            isVerified: false,
            userVerificationOtp: otp,
            forgetPasswordOtp: "N/A",
            timestamp: Date.now(),
        });

        const mailInfo = {
            to: email,
            subject: "Account Verification - OTP Code",
            text: `Hello ${name},

            Thank you for registering with Mitra Cake Shop!

            To complete your registration, please use the following One-Time Password (OTP):

            OTP: ${otp}

            This code is valid for 5 minutes. Please do not share this code with anyone.

            If you did not request this, please ignore this email.

            Best regards,
            Team Mitra`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p style="color: #ec4899;">Hello ${name},</p>
            <p style="color: black;">Thank you for registering with Mitra Cake Shop!</p>
            <p style="font-size: 18px;">
                <strong>Your OTP:</strong> 
                <span style="color: #ec4899; font-weight: bold;">${otp}</span>
            </p>
            <p style="color: black;">This code is valid for 5 minutes. Please do not share this code with anyone.</p>
            <p style="color: black;">If you did not request this, simply ignore this email.</p>
            <br/>
            <p style="color: black;">Best regards,<br/><strong>Team Mitra</strong></p>
            </div>
            `,
        };

        // Send verification email
        const response = await mailSend(mailInfo);

        if (newUser.insertedId && response.success) {
            return NextResponse.json({ message: "New user created", success: true }, { status: 200 });
        }

        return NextResponse.json({ message: "User creation failed", success: false }, { status: 500 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
