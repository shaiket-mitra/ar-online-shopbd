import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

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
        const existingUser = await usersCollection.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found.",
            }, { status: 404 });
        }

        // Check if OTP matches
        if (String(existingUser.userVerificationOtp) !== String(otp)) {
            return NextResponse.json({
                success: false,
                message: "Invalid OTP.",
            }, { status: 400 });
        }

        // Update user's verification status
        const result = await usersCollection.updateOne(
            { email },
            { $set: { isVerified: true }, $unset: { userVerificationOtp: "" } }
        );

        if (result.modifiedCount > 0) {
            return NextResponse.json({
                success: true,
                message: "User verified successfully.",
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to verify user.",
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("❌ Verification error:", error.message);
        return NextResponse.json({
            success: false,
            message: "Something went wrong. Please try again later.",
        }, { status: 500 });
    }
}
