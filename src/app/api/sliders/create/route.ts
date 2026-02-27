import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slidersCollection } = await connectDb();

    const body = await req.json();
    const { imgSrc, productLink } = body || {};

    if (!imgSrc || !productLink) {
      return Response.json(
        { success: false, message: "imgSrc and productLink are required" },
        { status: 400 }
      );
    }

    const newSlider = {
      imgSrc,
      productLink,
      createdAt: new Date(),
    };

    const result = await slidersCollection.insertOne(newSlider);

    return Response.json({
      success: true,
      message: "Banner added",
      slider: { _id: result.insertedId, ...newSlider },
    });
  } catch (error) {
    console.error("Create Slider Error:", error);

    return Response.json(
      { success: false, message: "Failed to create slider" },
      { status: 500 }
    );
  }
}