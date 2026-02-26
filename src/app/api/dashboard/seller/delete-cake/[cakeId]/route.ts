import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: any) {
    const { cakeId } = await params;
    try {
        const { cakesCollection } = await connectDb();
        const query = { _id: new ObjectId(cakeId) }
        const result = await cakesCollection.deleteOne(query)

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "cake not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "cake deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}