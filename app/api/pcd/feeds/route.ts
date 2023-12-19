import { PollFeedRequest } from "@pcd/passport-interface";
import { NextRequest, NextResponse } from "next/server";
import { feedHost } from "./feeds";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const reqHeaders = headers();
  //   await EdDSAPCDPackage.init?.({});
  //   await EdDSATicketPCDPackage.init?.({});
  //   const feedHost = await initFeedHost()
  try {
    // const feedsRequest = (await request.json()) as ListFeedsRequest;
    // console.log("feedsRequest", feedsRequest);
    const feedsResponse = await feedHost.handleListFeedsRequest(null);

    return NextResponse.json(feedsResponse);
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    return NextResponse.json({ message: message }, { status: 400 });
  }
}

const getErrorMessage = (error: any) => {
  if (error?.message) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  }

  return "Unexpected error";
};

export async function POST(request: NextRequest) {
  try {
    const feedsRequest = (await request.json()) as PollFeedRequest;
    const feedsResponse = await feedHost.handleFeedRequest(feedsRequest);
    return NextResponse.json(feedsResponse);
  } catch (error: any) {
    const message = getErrorMessage(error);
    console.error(message);
    return NextResponse.json({ message }, { status: 400 });
  }
}
