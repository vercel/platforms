import { NextResponse } from "next/server";
import { genPassport, issueEmailPCDs } from "../generate";

export async function POST() {
  const { passport, identity } = await genPassport();
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

  const feed = await fetch("/api/pcd/feeds/", {
    method: "POST",
    body: JSON.stringify({
      feedId: "1",
      pcd: emailPCDString,
    }),
  }).then((r) => r.json());

  return NextResponse.json(passport.serialize(emailPCD));
}
