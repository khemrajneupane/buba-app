import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import {
  getAllContents,
  uploadContents,
} from "@/backend/controllers/contentsControllers";

// Correct type parameters
const router = createEdgeRouter<NextRequest, void>();

router.use(isAuthenticatedUser).post(uploadContents);
router.get(getAllContents);

export async function GET(request: NextRequest): Promise<NextResponse> {
  return router.run(request) as Promise<NextResponse>;
}
export async function POST(request: NextRequest): Promise<NextResponse> {
  return router.run(request) as Promise<NextResponse>;
}
