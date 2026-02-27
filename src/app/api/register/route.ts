import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mailSend } from "@/lib/mailSend";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    // 1) Parse body
    const userInfo = await req.json();

    const name = (userInfo?.name || "").trim();
    const email = (userInfo?.email || "").trim().toLowerCase();
    const password = (userInfo?.password || "").toString();

    // provider: "credentials" | "google" | ...
    const provider = (userInfo?.provider || "credentials").toString();

    const image =
      userInfo?.image ||
      "https://res.cloudinary.com/dnr1svamu/image/upload/v1739601314/placeholder_c0lj2n.jpg";

    const isGoogle = provider === "google";
    const isCredentials = provider === "credentials";

    // 2) Basic validation
    if (!name) {
      return NextResponse.json(
        { message: "Name is required", success: false },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: "Valid email is required", success: false },
        { status: 400 }
      );
    }

    // Password only required for credentials signup
    if (isCredentials) {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters", success: false },
          { status: 400 }
        );
      }
    }

    // 3) DB connect
    const { usersCollection } = await connectDb();

    // 4) Check existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 409 }
      );
    }

    // 5) Hash password only for credentials
    let hashedPassword: string | null = null;

    if (isCredentials) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // 6) OTP only for credentials (Google => verified, no OTP)
    const otp = isGoogle ? "N/A" : Math.floor(100000 + Math.random() * 900000);

    // 7) Insert user
    const insertRes = await usersCollection.insertOne({
      name,
      email,
      gender: "N/A",

      // credentials => hashed password, google => null
      password: hashedPassword,

      provider,
      role: "Customer",
      image,

      // ✅ Google login => verified
      isVerified: isGoogle ? true : false,
      userVerificationOtp: otp,

      forgetPasswordOtp: "N/A",
      timestamp: Date.now(),
    });

    if (!insertRes?.insertedId) {
      return NextResponse.json(
        { message: "User creation failed", success: false },
        { status: 500 }
      );
    }

    // 8) Send OTP mail only for credentials users
    if (!isGoogle) {
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
</div>`,
      };

      const mailRes = await mailSend(mailInfo);

      if (!mailRes?.success) {
        console.error("MAIL SEND FAILED =>", mailRes?.error || mailRes);

        return NextResponse.json(
          {
            message:
              "User created but verification email failed. Please try resend OTP.",
            success: false,
            emailSent: false,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "New user created. OTP sent.", success: true, emailSent: true },
        { status: 200 }
      );
    }

    // 9) Google user success response
    return NextResponse.json(
      {
        message: "New Google user created & verified.",
        success: true,
        emailSent: false,
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("REGISTER ERROR =>", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    return NextResponse.json(
      { message: error?.message || "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}