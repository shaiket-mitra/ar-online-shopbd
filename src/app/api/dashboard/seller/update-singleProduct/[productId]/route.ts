// app/api/dashboard/seller/update-singleCake/[cakeId]/route.ts

import connectDb from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type Params = { productId: string };

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> } // ✅ params can be a Promise in newer Next.js
) {
  try {
    // ✅ unwrap params properly + sanitize
    const { productId: rawproductId } = await context.params;
    const productId = String(rawproductId).trim();

    // Optional debug logs (remove later)
    // console.log("rawCakeId:", rawCakeId);
    // console.log("cakeId(trimmed):", cakeId);
    // console.log("ObjectId.isValid:", ObjectId.isValid(cakeId));

    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID", success: false },
        { status: 400 }
      );
    }

    const productData = await request.json();

    // ✅ required fields validation (0 values won't fail)
    if (
      !productData?.name ||
      !productData?.category ||
      productData?.price === undefined ||
      productData?.quantity === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const { productsCollection } = await connectDb();
    const filter = { _id: new ObjectId(productId) };

    // Check if product exists
    const existingProduct = await productsCollection.findOne(filter);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Build update fields
    const updateFields: Record<string, any> = {
      name: String(productData.name),
      category: String(productData.category),
      description:
        productData.description !== undefined && productData.description !== null
          ? String(productData.description)
          : existingProduct.description,
      price: Number(productData.price),
      quantity: Number(productData.quantity),
      image:
        productData.image !== undefined && productData.image !== null
          ? String(productData.image)
          : existingProduct.image,
      updatedAt: new Date(),
    };

    // Conditionally add discountPrice if provided (supports 0 too)
    if (productData.discountPrice !== undefined && productData.discountPrice !== null) {
      updateFields["discount.discountPrice"] = Number(productData.discountPrice);
    }

    const result = await productsCollection.updateOne(filter, { $set: updateFields });

    // If nothing changed (same values)
    if (result.modifiedCount === 0) {
      const latestProduct = await productsCollection.findOne(filter);
      return NextResponse.json(
        {
          message: "No changes made to the product",
          success: true,
          data: latestProduct,
        },
        { status: 200 }
      );
    }

    const updatedProduct = await productsCollection.findOne(filter);

    return NextResponse.json(
      {
        message: "Product updated successfully",
        success: true,
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update product", error: error.message, success: false },
      { status: 500 }
    );
  }
}