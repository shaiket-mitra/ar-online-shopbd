import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { productsCollection } = await connectDb();
        const result = await productsCollection.find({}).sort({ _id: -1 }).toArray();
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ message: error })
    }
}