import { NextRequest, NextResponse } from "next/server";
import Image from "../models/images";
import { upload_file, delete_file } from "../utils/cloudinary";
import dbConnect from "../config/dbConnect";
import { getToken } from "next-auth/jwt";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Contents from "../models/contents";

// uploadContents
export const uploadContents = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const { title, description } = body;

  const user = await Contents.create({
    title,
    description,
  });

  return NextResponse.json({
    success: true,
    user,
  });
});

// Get all contents
export const getAllContents = async () => {
  await dbConnect();
  const contents = await Contents.find({});
  return NextResponse.json({ contents });
};

// Delete a content
export const deleteContent = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getToken({ req });
    try {
      await dbConnect();
      const contents = await Contents.findById(params.id);

      if (!contents) {
        return NextResponse.json(
          { error: "Contents not found" },
          { status: 404 }
        );
      }
      if (!session?.name) throw new Error("Unauthorized");

      await Contents.findByIdAndDelete(params.id);

      return NextResponse.json({
        success: true,
        message: "Contents deleted successfully",
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Delete failed" },
        { status: 500 }
      );
    }
  }
);
