import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest, {params}: any) {
    const {orderId} = await params;
    try {
        const query = {_id: new ObjectId(orderId)}
        const {ordersCollection} = await connectDb()
        const order = await ordersCollection.findOne(query)
        if (order?.status === "Delivered") {
            return NextResponse.json("Can't cancel once the product is delivered", {status: 409})
        }
        const result = await ordersCollection.deleteOne(query)
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({message: error})
    }
}