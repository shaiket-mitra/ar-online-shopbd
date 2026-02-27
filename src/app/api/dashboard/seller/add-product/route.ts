import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const productData = await request.json();
    try {
        const { productsCollection } = await connectDb()
        const result = await productsCollection.insertOne(productData)
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ message: error })
    }
}