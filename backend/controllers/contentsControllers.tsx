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
  const session = await getToken({ req });
  const user = await Contents.create({
    title,
    description,
    user: session?.user,
  });

  return NextResponse.json({
    success: true,
    user,
  });
});

// Get all contents
export const getAllContents = async () => {
  await dbConnect();
  const contents = await Contents.find({})
    .populate("user", "name email") // 👈 only include name, email
    .exec();
  return NextResponse.json({ contents });
};

// Get a content details => /api/contents/:id
export const getAContentById = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const content = await Contents.findById(params.id)
      .populate("user", "name email") // 👈 only include name, email
      .exec();
    if (!content) {
      return NextResponse.json(
        {
          message: "content not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      success: true,
      content,
    });
  }
);

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
      //@ts-ignore
      if (session?.user?.role !== "admin") throw new Error("Unauthorized");

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
