// app/api/dashboard/seller/update-singleCake/[cakeId]/route.ts

import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type Params = { cakeId: string };

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> } // ✅ params can be a Promise in newer Next.js
) {
  try {
    // ✅ unwrap params properly + sanitize
    const { cakeId: rawCakeId } = await context.params;
    const cakeId = String(rawCakeId).trim();

    // Optional debug logs (remove later)
    // console.log("rawCakeId:", rawCakeId);
    // console.log("cakeId(trimmed):", cakeId);
    // console.log("ObjectId.isValid:", ObjectId.isValid(cakeId));

    if (!ObjectId.isValid(cakeId)) {
      return NextResponse.json(
        { message: "Invalid cake ID", success: false },
        { status: 400 }
      );
    }

    const cakeData = await request.json();

    // ✅ required fields validation (0 values won't fail)
    if (
      !cakeData?.name ||
      !cakeData?.category ||
      cakeData?.price === undefined ||
      cakeData?.quantity === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const { cakesCollection } = await connectDb();
    const filter = { _id: new ObjectId(cakeId) };

    // Check if cake exists
    const existingCake = await cakesCollection.findOne(filter);
    if (!existingCake) {
      return NextResponse.json(
        { message: "Cake not found", success: false },
        { status: 404 }
      );
    }

    // Build update fields
    const updateFields: Record<string, any> = {
      name: String(cakeData.name),
      category: String(cakeData.category),
      description:
        cakeData.description !== undefined && cakeData.description !== null
          ? String(cakeData.description)
          : existingCake.description,
      price: Number(cakeData.price),
      quantity: Number(cakeData.quantity),
      image:
        cakeData.image !== undefined && cakeData.image !== null
          ? String(cakeData.image)
          : existingCake.image,
      updatedAt: new Date(),
    };

    // Conditionally add discountPrice if provided (supports 0 too)
    if (cakeData.discountPrice !== undefined && cakeData.discountPrice !== null) {
      updateFields["discount.discountPrice"] = Number(cakeData.discountPrice);
    }

    const result = await cakesCollection.updateOne(filter, { $set: updateFields });

    // If nothing changed (same values)
    if (result.modifiedCount === 0) {
      const latestCake = await cakesCollection.findOne(filter);
      return NextResponse.json(
        {
          message: "No changes made to the cake",
          success: true,
          data: latestCake,
        },
        { status: 200 }
      );
    }

    const updatedCake = await cakesCollection.findOne(filter);

    return NextResponse.json(
      {
        message: "Cake updated successfully",
        success: true,
        data: updatedCake,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update cake", error: error.message, success: false },
      { status: 500 }
    );
  }
}