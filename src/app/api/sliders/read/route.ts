import connectDb from "@/lib/connectDb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { slidersCollection } = await connectDb();

    const sliders = await slidersCollection
      .find({})
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return Response.json({ success: true, sliders });
  } catch (error) {
    console.error("Get Sliders Error:", error);

    return Response.json(
      { success: false, message: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}