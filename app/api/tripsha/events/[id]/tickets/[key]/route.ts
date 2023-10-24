/* 
    This was the migration script we used to migrate from
    our old database to the new Vercel Postgres database.
    It's not needed anymore, but I'm keeping it here for
    posterity.
*/

import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/tripsha/models/bookings";
import dbConnect from "@/lib/tripsha/db-connect";
// import { getSession } from "@/lib/auth";
// import prisma from "@/lib/prisma";
import { Types } from "mongoose";

const ZUCONNECT_TRIP_ID = "64ff3a6eb4b6950008dee4f8";

const selectTicketName = (booking: any) => booking?.rooms?.[0]?.variant?.name;
const selectOptions = (booking: any) =>
  booking?.addOns?.length > 0
    ? booking?.addOns?.map(
        (addon: { variant: { id: string; name: string } }) => ({
          id: addon.variant.id,
          name: addon.variant.name,
        }),
      )
    : undefined;

export async function GET(
  request: Request,
  { params }: { params?: { id: string; key: string } },
) {
  if (!params?.id) {
    return NextResponse.json("Trip ID is required", { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  console.log("searchParams", searchParams, searchParams.get("key"));
  const apiKey = searchParams.get("key") || params.key;

  if (apiKey !== process.env.TRIPSHA_API_KEY) {
    return NextResponse.json("Invalid API Key", { status: 400 });
  }

  // only allow this for one trip for now
  if (params.id !== ZUCONNECT_TRIP_ID) {
    return NextResponse.json("Invalid Request", { status: 400 });
  }

  await dbConnect();

  const bookings = await Booking.aggregate([
    { $match: { tripId: new Types.ObjectId(params.id), status: "approved" } },
    {
      $lookup: {
        from: "users",
        localField: "memberId",
        foreignField: "_id",
        as: "memberDetails",
      },
    },
    {
      $unwind: {
        path: "$memberDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  const tickets = bookings.map((booking) => {
    return {
      id: booking._id,
      options: selectOptions(booking),
      ticketName: selectTicketName(booking),
      email: booking?.memberDetails?.email,
      first: booking?.memberDetails?.firstName,
      last: booking?.memberDetails?.lastName,
    };
  });
  return NextResponse.json(
    { tickets },
    {
      status: 200,
    },
  );
}
