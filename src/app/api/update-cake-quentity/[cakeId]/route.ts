import connectDb from '@/lib/connectDb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: any) {
    const { cakeId } = await params;
    const { quantityToUpdate, status } = await request.json();

    // console.log(cakeId, quantityToUpdate, status)
    if (!ObjectId.isValid(cakeId)) {
        return NextResponse.json({ message: "Invalid cake ID" }, { status: 400 });
    }

    try {
        const { cakesCollection } = await connectDb();
        const filter = { _id: new ObjectId(cakeId) };

        const updateDoc = {
            $inc: { quantity: status === "decrease" ? -quantityToUpdate : quantityToUpdate }
        };

        const result = await cakesCollection.updateOne(filter, updateDoc);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
