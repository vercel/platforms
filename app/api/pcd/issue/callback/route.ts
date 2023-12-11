import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("request: ", request);
  return NextResponse.json(request);
}
