import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import connectDb from '@/lib/connectDb';
export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const userInfoForUpdate = await request.json()
    try {
        const { usersCollection } = await connectDb();
        const existingUser = await usersCollection.findOne({ email: user?.email })
        if (existingUser) {
            const result = await usersCollection.updateOne({ email: user?.email }, {
                $set: {
                    name: userInfoForUpdate.full_name,
                    image: userInfoForUpdate.image,
                }
            });

            if (result.modifiedCount > 0) {
                return NextResponse.json({ success: true, message: "Profile updated successfully" });
            } else {
                return NextResponse.json({ success: false, message: "No changes made" });
            }
        } else {
            return NextResponse.json({ success: false, message: "User not found" });
        }

    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}