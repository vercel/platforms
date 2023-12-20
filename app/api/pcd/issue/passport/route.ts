// import { getEdDSAPublicKey } from "@pcd/eddsa-pcd";
import { NextResponse } from "next/server";
import { genPassport, genSignedPCDIdentity, issueEmailPCDs } from "../generate";
import {
  SemaphoreSignaturePCD,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { verifyFeedCredential } from "@pcd/passport-interface";

export async function GET() {
  const { passport, identity, identityPCD } = await genPassport();
  const emailPCD = await issueEmailPCDs({
    email: "test@example.com",
    identityCommitment: identity.commitment.toString(),
    privateKey: process.env.SERVER_PRIVATE_KEY as string,
  });
  passport.add(emailPCD);

  //   new SemaphoreSignaturePCD('')
  //   const signedPCDIdentity = await genSignedPCDIdentity(identity);

  const passportString = await passport.serializeCollection();
  const emailPCDString = passport.serialize(emailPCD);

  const feed = await fetch("http://api.localhost:3000/pcd/feeds/", {
    method: "POST",
    body: JSON.stringify({
      feedId: "1",
      pcd: emailPCDString,
    }),
  }).then((r) => r.json());

  return NextResponse.json(passport.serialize(emailPCD));
}
