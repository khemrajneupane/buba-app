import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../config/dbConnect";
import Contents from "../models/contents";
import { getToken } from "next-auth/jwt";
import redis from "../utils/redis";

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

  // Invalidate the Redis cache for contents list
  await redis.del("all_contents");

  return NextResponse.json({
    success: true,
    user,
  });
});

// Get all contents
export const getAllContents = async () => {
  await dbConnect();
  const cacheKey = "all_contents";
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json({ contents: JSON.parse(cached), cache: true });
  }
  const contents = await Contents.find({})
    .populate("user", "name email") //only include name, email
    .exec();
  await redis.set(cacheKey, JSON.stringify(contents), "EX", 3600); // expires in 1 hour

  return NextResponse.json({ contents });
};

// Get a content details => /api/contents/:id
export const getAContentById = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const cacheKey = `all_contents_${params.id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        content: JSON.parse(cached),
        cache: true,
      });
    }

    const content = await Contents.findById(params.id)
      .populate("user", "name email")
      .exec();

    if (!content) {
      return NextResponse.json(
        { message: "content not found" },
        { status: 404 }
      );
    }

    await redis.set(cacheKey, JSON.stringify(content), "EX", 3600); // 1 hr

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

      // Delete from MongoDB
      await Contents.findByIdAndDelete(params.id);

      // Invalidate/delete cache in Redis
      const cacheKey = `all_contents:${params.id}`;
      await redis.del(cacheKey); // remove specific content
      await redis.del("all_contents"); // optionally clear all contents list cache too

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

// Update a content
export const updateContent = catchAsyncErrors(
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

      const body = await req.json();
      const { title, description } = body;

      // Ensure at least one field is being updated
      if (!title && !description) {
        return NextResponse.json(
          { error: "No valid fields provided for update" },
          { status: 400 }
        );
      }

      if (title) contents.title = title;
      if (description) contents.description = description;
      contents.updatedAt = new Date();

      await contents.save();

      // Invalidate/update cache
      const cacheKey = `all_contents:${params.id}`;
      await redis.del(cacheKey);
      await redis.del("all_contents");

      return NextResponse.json({
        success: true,
        message: "Contents updated successfully",
        contents,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Update failed" },
        { status: 500 }
      );
    }
  }
);
