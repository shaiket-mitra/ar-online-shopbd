import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const {usersCollection} = await connectDb()
        const users = await usersCollection.find({}).sort({ name: 1 }).toArray();
        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({message: error.message})
    }
}