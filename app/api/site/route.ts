import prisma from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { apiErrorHandler } from "../api-utils";

// export const dynamic = "force-dynamic";
// todo check for auth or not
export async function GET(request: NextRequest) {
  try {
    const sites: any[] = await prisma.site.findMany();
    
    return NextResponse.json(sites);
  } catch (error:any) {
    return apiErrorHandler(error, request)
  }
}
