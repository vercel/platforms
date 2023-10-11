/* 
    This was the migration script we used to migrate from
    our old database to the new Vercel Postgres database.
    It's not needed anymore, but I'm keeping it here for
    posterity.
*/

import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/tripsha/models/bookings";
import dbConnect from "@/lib/tripsha/db-connect";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, {params}: { params?: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json("Trip ID is required", { status: 400 });
  }
  await dbConnect();

  const bookings = await Booking.find({ tripId: params.id });
  return NextResponse.json({ bookings });
}
