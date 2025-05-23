import { NextRequest, NextResponse } from "next/server";
import { deleteImage } from "@/backend/controllers/imageControllers";
import { createEdgeRouter } from "next-connect";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";

interface RequestContext {
  params: {
    id: string;
  };
}
const router = createEdgeRouter<NextRequest, void>();

router.delete(deleteImage);
/*
export async function DELETE(
  request: NextRequest,
  ctx: RequestContext
): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}*/

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  return deleteImage(request, { params: { id } });
}
