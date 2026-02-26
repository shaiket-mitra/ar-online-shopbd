import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
    const { email } = await params;
    try {
        const { ordersCollection } = await connectDb();
        const query = { "customer.email": email };

        const result = await ordersCollection
            .aggregate([
                { $match: query },
                { $addFields: { cakeId: { $toObjectId: "$cakeId" } } },
                { $lookup: { from: "cakes", localField: "cakeId", foreignField: "_id", as: "cakes" } },
                { $unwind: "$cakes" },
                { $addFields: { name: "$cakes.name", image: "$cakes.image", category: "$cakes.category" } },
                { $project: { cakes: 0 } },
                { $sort: { createdAt: -1 } }
            ])
            .toArray();

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message });
    }
}
