import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: any) {
    const { productId } = await params;
    try {
        const { productsCollection } = await connectDb();
        const query = { _id: new ObjectId(productId) }
        const result = await productsCollection.deleteOne(query)

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "product deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}