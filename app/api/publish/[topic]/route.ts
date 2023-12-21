import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Client } from "@upstash/qstash";

const q = new Client({
  token: process.env.QSTASH_TOKEN || "",
});

export async function POST(
  request: NextRequest,
  { params: { topic } }: { params: { topic: string } },
) {
  // 1) Authentication step
  const session = await getSession();

  if (!session) {
    return NextResponse.json({
      error: "Not authenticated",
    });
  }
  

  const result = await q.publishJSON({
    topic,
    body: { ...request.body, session },
  });

  return NextResponse.json(result, { status: 200 });
}
