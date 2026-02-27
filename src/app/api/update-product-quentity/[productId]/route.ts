import connectDb from '@/lib/connectDb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: any) {
    const { productId } = await params;
    const { quantityToUpdate, status } = await request.json();

    // console.log(cakeId, quantityToUpdate, status)
    if (!ObjectId.isValid(productId)) {
        return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    try {
        const { productsCollection } = await connectDb();
        const filter = { _id: new ObjectId(productId) };

        const updateDoc = {
            $inc: { quantity: status === "decrease" ? -quantityToUpdate : quantityToUpdate }
        };

        const result = await productsCollection.updateOne(filter, updateDoc);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
