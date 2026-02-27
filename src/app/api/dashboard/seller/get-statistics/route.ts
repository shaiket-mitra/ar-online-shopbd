import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { productsCollection, ordersCollection, usersCollection } = await connectDb();

        // Fetch counts
        const totalUser = await usersCollection.estimatedDocumentCount();
        const totalproducts = await productsCollection.estimatedDocumentCount();

        // Fetch all orders
        const totalOrders = await ordersCollection.find().toArray();

        // Calculate total price
        const totalPrice = totalOrders.reduce((sum: any, order: any) => sum + (order.price || 0), 0);

        return NextResponse.json({ totalUser, totalproducts, totalOrders: totalOrders.length, totalPrice });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
