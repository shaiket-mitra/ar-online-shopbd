import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cakeData = await request.json();
    try {
        const { cakesCollection } = await connectDb()
        const result = await cakesCollection.insertOne(cakeData)
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ message: error })
    }
}