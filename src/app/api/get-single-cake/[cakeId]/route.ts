import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
    const { cakeId } = await params;
    try {
        const query = { _id: new ObjectId(cakeId) }
        const { cakesCollection } = await connectDb();
        const result = await cakesCollection.findOne(query)
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error })
    }
}