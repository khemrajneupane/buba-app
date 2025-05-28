import dbConnect from "@/backend/config/dbConnect";
import {
  deleteContent,
  getAContentById,
} from "@/backend/controllers/contentsControllers";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { getToken } from "next-auth/jwt";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
interface RequestContext {
  params: {
    id: string;
  };
}
//const routerOne = createEdgeRouter<NextRequest, RequestContext>();
const router = createEdgeRouter<NextRequest, void>();

router.get(getAContentById);
//router.use(isAuthenticatedUser).delete(deleteContent);
router.delete(deleteContent);
export async function GET(request: NextRequest): Promise<NextResponse> {
  return router.run(request) as Promise<NextResponse>;
}
/*
export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<NextResponse> {
  return routerOne.run(request, ctx) as Promise<NextResponse>;
}*/
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  return deleteContent(request, { params: { id } });
}
/*
export async function DELETE(
  request: NextRequest,
  ctx: RequestContext
): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}*/
