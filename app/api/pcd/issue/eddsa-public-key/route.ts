import { getEdDSAPublicKey } from "@pcd/eddsa-pcd";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    await getEdDSAPublicKey(process.env.SERVER_PRIVATE_KEY as string),
  );
}
