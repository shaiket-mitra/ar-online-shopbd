import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
    const { productId } = await params;
    try {
        const query = { _id: new ObjectId(productId) }
        const { productsCollection } = await connectDb();
        const result = await productsCollection.findOne(query)
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error })
    }
}