import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
    const {email, role} = await request.json();
    const filter = {email};
    const updateDoc = {
        $set: {role, status: "Verified"}
    }

    try {
        const {usersCollection} = await connectDb()
        const result = await usersCollection.updateOne(filter, updateDoc)
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({message: error.message})
    }
}