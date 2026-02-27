// import connectDb from "@/lib/connectDb";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest, { params }: any) {
//     const { email } = await params;
//     try {
//         const { ordersCollection } = await connectDb();
//         const query = { "seller": email };

//         const result = await ordersCollection
//             .aggregate([
//                 { $match: query },
//                 { $addFields: { cakeId: { $toObjectId: "$cakeId" } } },
//                 { $lookup: { from: "cakes", localField: "cakeId", foreignField: "_id", as: "cakes" } },
//                 { $unwind: "$cakes" },
//                 { $addFields: { name: "$cakes.name", image: "$cakes.image", category: "$cakes.category" } },
//                 { $project: { cakes: 0 } },
//                 { $sort: { createdAt: -1 } }
//             ])
//             .toArray();

//             console.log(result)
//         return NextResponse.json(result);
//     } catch (error: any) {
//         return NextResponse.json({ message: error.message });
//     }
// }


import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { ordersCollection } = await connectDb();

        const result = await ordersCollection
            .aggregate([
                { $addFields: { productId: { $toObjectId: "$productId" } } },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "products"
                    }
                },
                { $unwind: "$products" },
                {
                    $addFields: {
                        name: "$products.name",
                        image: "$products.image",
                        category: "$products.category"
                    }
                },
                { $project: { products: 0 } },
                { $sort: { createdAt: -1 } }
            ])
            .toArray();

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message });
    }
}