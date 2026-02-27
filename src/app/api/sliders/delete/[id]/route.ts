import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import connectDb from "@/lib/connectDb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { slidersCollection } = await connectDb();
    const { id } = await params; // ✅ params is a Promise

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid slider ID" },
        { status: 400 }
      );
    }

    const result = await slidersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Banner deleted",
    });
  } catch (error) {
    console.error("Delete Slider Error:", error);

    return Response.json(
      { success: false, message: "Failed to delete slider" },
      { status: 500 }
    );
  }
}