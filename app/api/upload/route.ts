import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const runtime = "edge";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export async function POST(req: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }

  const file = req.body || "";
  const contentType = req.headers.get("content-type") || "text/plain";
  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  const { data, error } = await supabase.storage
    .from("media")
    .upload(`/public/${filename}`, file);

  if (error || !data?.path) {
    return NextResponse.json({ error: "Failed to upload file." });
  }

  const url = `${supabaseUrl}/storage/v1/object/public/media/${data.path}`;

  return NextResponse.json({ url });
}
