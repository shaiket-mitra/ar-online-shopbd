import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const { email } = await request.json();
    try {
        const { usersCollection } = await connectDb();
        const query = { email }
        const user = await usersCollection.findOne(query)

        if (!user || user?.status === "Requested") {
            return NextResponse.json({ message: "You have already requested. Admin will call you." }, { status: 400 })
        }

        const updateDoc = {
            $set: {
                status: "Requested"
            }
        }

        await usersCollection.updateOne(query, updateDoc)

        return NextResponse.json({ message: "Successfully applied to become a seller." })

    } catch (error) {
        return NextResponse.json({ message: error })
    }
}