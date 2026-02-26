import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/connectDb";


export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userPassInfo = await request.json();

    if (userPassInfo.new_password !== userPassInfo.confirm_new_password) {
        return NextResponse.json({
            message: "New Password and Confirm New Password do not match.",
            success: false
        });
    }

    try {
        const { usersCollection } = await connectDb();

        const existingUser = await usersCollection.findOne({ email: user.email });

        if (!existingUser) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(
            userPassInfo.current_password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Current Password is not matched"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userPassInfo.new_password, salt);

        const result = await usersCollection.updateOne(
            { email: user.email },
            { $set: { password: hashPassword } }
        );

        if (result.modifiedCount > 0) {
            return NextResponse.json({
                success: true,
                message: "Password changed successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Password change failed"
            });
        }
    } catch (error) {
        console.error("Error updating user password:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
