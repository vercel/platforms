// import { ListFeedsRequest, PollFeedRequest } from "@pcd/passport-interface";
// import { NextRequest, NextResponse } from "next/server";
// import { feedHost, initFeedHost } from "./feeds";
// import { EdDSAPCDPackage } from "@/lib/pcd-light";
// import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";

// async function initPCD() {
//   const [pcd, ticket, feed] = await Promise.all([
//     EdDSAPCDPackage.init?.({}),
//     EdDSATicketPCDPackage.init?.({}),
//     initFeedHost(),
//   ]);

//   return { pcd, ticket, feed };
// }

// let pcd;

// export async function GET(request: NextRequest) {
//     initPCD()
//   const feedsRequest = (await request.json()) as ListFeedsRequest;
//   console.log("feedsRequest", feedsRequest);

//   return NextResponse.json(await feedHost.handleListFeedsRequest(feedsRequest));
// }

// export async function POST(request: NextRequest) {
//   const feedsRequest = (await request.json()) as PollFeedRequest;
//   console.log("feedsRequest", feedsRequest);

//   return NextResponse.json(await feedHost.handleFeedRequest(feedsRequest));
// }
