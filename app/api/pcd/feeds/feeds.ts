import {
  EdDSATicketPCD,
  EdDSATicketPCDPackage,
  ITicketData,
} from "@pcd/eddsa-ticket-pcd";
import { EmailPCDPackage } from "@pcd/email-pcd";
import {
  FeedHost,
  PollFeedRequest,
  PollFeedResponseValue,
  verifyFeedCredential,
} from "@pcd/passport-interface";
import {
  DeleteFolderPermission,
  PCDAction,
  PCDActionType,
  PCDPermissionType,
  ReplaceInFolderPermission,
} from "@pcd/pcd-collection";
import { ArgumentTypeName, SerializedPCD } from "@pcd/pcd-types";
import { SemaphoreSignaturePCDPackage } from "@pcd/semaphore-signature-pcd";
import _ from "lodash";
import { Ticket, loadTickets } from "./config";
import path from "node:path";
// import { ZUPASS_PUBLIC_KEY } from "./main";

export const ZUPASS_PUBLIC_KEY = JSON.parse(
  process.env.ZUPASS_PUBLIC_KEY as string,
);
// console.log('ZUPASS_PUBLIC_KEY')
// const PUBLIC_KEY = "8afb266cb9c2f78a042d97dd02488ffc7d726def6c314112f0a1a96c30326e02"

const fullPath = path.join(__dirname, "../artifacts/");
SemaphoreSignaturePCDPackage.init?.({
  zkeyFilePath: fullPath + "16.zkey",
  wasmFilePath: fullPath + "16.wasm",
});

export let feedHost: FeedHost = initFeedHost();

export function initFeedHost() {
  const tickets = loadTickets();
  const folders = Object.keys(tickets);
  return new FeedHost(
    [
      {
        feed: {
          id: "1",
          name: "First feed",
          description: "First test feed",
          permissions: folders.flatMap((folder) => {
            return [
              {
                folder,
                type: PCDPermissionType.ReplaceInFolder,
              } as ReplaceInFolderPermission,
              {
                folder,
                type: PCDPermissionType.DeleteFolder,
              } as DeleteFolderPermission,
            ];
          }),
          credentialRequest: {
            signatureType: "sempahore-signature-pcd",
            pcdType: "email-pcd",
          },
        },
        handleRequest: async (
          req: PollFeedRequest,
        ): Promise<PollFeedResponseValue> => {
          console.log("inside handle request");
          if (req.pcd === undefined) {
            throw new Error(`Missing credential`);
          }
          const { payload } = await verifyFeedCredential(req.pcd);
          console.log("payload: ", payload);
          if (payload?.pcd && payload.pcd.type === EmailPCDPackage.name) {
            const pcd = await EmailPCDPackage.deserialize(payload?.pcd.pcd);
            const verified =
              (await EmailPCDPackage.verify(pcd)) &&
              _.isEqual(pcd.proof.eddsaPCD.claim.publicKey, ZUPASS_PUBLIC_KEY);
            if (verified) {
              return {
                actions: await feedActionsForEmail(
                  pcd.claim.emailAddress,
                  pcd.claim.semaphoreId,
                ),
              };
            }
          }
          return { actions: [] };
        },
      },
    ],
    "http://api.localhost:3000/pcd/feeds",
    "Test Feed Server",
  );
}

async function feedActionsForEmail(
  emailAddress: string,
  semaphoreId: string,
): Promise<PCDAction[]> {
  const ticketsForUser: Record<string, Ticket[]> = {};

  const tickets = loadTickets();

  for (const [folder, folderTickets] of Object.entries(tickets)) {
    for (const ticket of folderTickets) {
      if (ticket.attendeeEmail === emailAddress) {
        if (!ticketsForUser[folder]) {
          ticketsForUser[folder] = [];
        }
        ticketsForUser[folder].push(ticket);
      }
    }
  }

  const actions = [];

  for (const [folder, tickets] of Object.entries(ticketsForUser)) {
    // Clear out the folder
    actions.push({
      type: PCDActionType.DeleteFolder,
      folder,
      recursive: false,
    });

    actions.push({
      type: PCDActionType.ReplaceInFolder,
      folder,
      pcds: await Promise.all(
        tickets.map((ticket) => issueTicketPCD(ticket, semaphoreId)),
      ),
    });
  }

  return actions;
}

async function issueTicketPCD(
  ticket: Ticket,
  semaphoreId: string,
): Promise<SerializedPCD<EdDSATicketPCD>> {
  const ticketData: ITicketData = {
    ...ticket,
    checkerEmail: "",
    isConsumed: false,
    isRevoked: false,
    attendeeSemaphoreId: semaphoreId,
    timestampConsumed: 0,
    timestampSigned: Date.now(),
  };

  const pcd = await EdDSATicketPCDPackage.prove({
    ticket: {
      value: ticketData,
      argumentType: ArgumentTypeName.Object,
    },
    privateKey: {
      value: process.env.SERVER_PRIVATE_KEY,
      argumentType: ArgumentTypeName.String,
    },
    id: {
      value: undefined,
      argumentType: ArgumentTypeName.String,
    },
  });

  return EdDSATicketPCDPackage.serialize(pcd);
}
