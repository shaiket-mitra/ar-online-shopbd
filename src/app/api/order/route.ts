import connectDb from "@/lib/connectDb";
import { mailSend } from "@/lib/mailSend";
import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeName(input: any) {
  const name = (typeof input === "string" ? input : "").trim();
  return name || "Customer";
}

export async function POST(request: NextRequest) {
  const orderDetails = await request.json();

  try {
    const { ordersCollection } = await connectDb();
    const result = await ordersCollection.insertOne(orderDetails);

    // ✅ orderDetails থেকে name/email নাও (PurchaseModal থেকে আসছে)
    const rawEmail = orderDetails?.customer?.email;
    const rawName = orderDetails?.customer?.name;

    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    // "Guest" বা empty হলে mail যাবে না
    const hasValidEmail =
      !!email && email !== "guest" && isValidEmail(email);

    if (result?.insertedId && hasValidEmail) {
      const name = safeName(rawName);

      const mailData = {
        to: email,
        subject: "Order Successful",
        text: `Hello, ${name},

Thank you for ordering from AR Online ShopBD!

Your order has been placed successfully.

Best regards,
Team AR Online ShopBD`,
        html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p style="color: #ec4899;">Hello ${name},</p>
  <p style="color: black;">Thank you for ordering from AR Online ShopBD!</p>
  <p style="font-size: 18px;">
    <span style="color: #ec4899; font-weight: bold;">Your order has been placed successfully.</span>
  </p>
  <br/>
  <p style="color: black;">Best regards,<br/><strong>Team AR Online ShopBD</strong></p>
</div>`,
      };

      const mailRes = await mailSend(mailData);
      console.log("ORDER MAIL RESULT =>", mailRes);
    } else {
      console.log("ORDER MAIL SKIPPED =>", {
        inserted: !!result?.insertedId,
        email,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}