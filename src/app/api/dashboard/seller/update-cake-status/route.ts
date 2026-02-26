import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
    const {orderId, orderStatus} = await request.json();
    const filter = {_id: new ObjectId(orderId) };
    const updateDoc = {
        $set: {status: orderStatus}
    }

    try {
        const {ordersCollection} = await connectDb()
        const result = await ordersCollection.updateOne(filter, updateDoc)
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({message: error.message})
    }
}