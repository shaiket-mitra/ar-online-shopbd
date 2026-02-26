// import connectDb from "@/lib/connectDb";
// import { mailSend } from "@/lib/mailSend";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//     const orderDetails = await request.json();
//     try {
//         const {ordersCollection} = await connectDb();
//         const result = await ordersCollection.insertOne(orderDetails)
//         if (result?.insertedId) {
//             const mailData = {
//                 address: orderDetails.customer.email,
//                 subject: "Order Successfull",
//                 body: "You have placed an order successfully."
//             }

//             await mailSend(mailData)
//         }

//         return NextResponse.json(result)
//     } catch (error) {
//         return NextResponse.json({ message: error })
//     }
// }


import connectDb from "@/lib/connectDb";
import { mailSend } from "@/lib/mailSend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const orderDetails = await request.json();

    try {
        const { ordersCollection } = await connectDb();
        const result = await ordersCollection.insertOne(orderDetails);

        // ✅ Only send email if a valid email exists
        const email = orderDetails?.customer?.email;
        const hasValidEmail =
            typeof email === "string" &&
            email.trim().length > 0 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

        if (result?.insertedId && hasValidEmail) {
            const mailData = {
                address: email.trim(),
                subject: "Order Successful",
                body: "You have placed an order successfully.",
            };

            try {
                await mailSend(mailData);
            } catch (mailError) {
                // ✅ mail fail হলেও order success থাকবে
                console.error("Mail send failed:", mailError);
            }
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Something went wrong" },
            { status: 500 }
        );
    }
}