import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { cakesCollection } = await connectDb();
        const result = await cakesCollection.find({
            "discount.isDiscounted": true
        }).sort({ _id: -1 }).toArray();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || error }, { status: 500 });
    }
}