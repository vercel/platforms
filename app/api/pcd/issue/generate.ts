import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";
import { EmailPCD, EmailPCDPackage } from "@pcd/email-pcd";
import { PCDCollection } from "@pcd/pcd-collection";
import { ArgumentTypeName, PCDPackage, SerializedPCD } from "@pcd/pcd-types";
import { Identity } from "@semaphore-protocol/identity";
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd";
import {
  SemaphoreSignaturePCD,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { ISSUANCE_STRING } from "@pcd/passport-interface";
import path from "path";

let pcdPackages: Promise<PCDPackage[]> | undefined;

export async function getPackages(): Promise<PCDPackage[]> {
  if (pcdPackages !== undefined) {
    return pcdPackages;
  }

  pcdPackages = loadPackages();
  return pcdPackages;
}

export async function genIdentity() {}

export async function genPassport() {
  const identity = new Identity();
  const identityPCD = await SemaphoreIdentityPCDPackage.prove({ identity });

  const passport = new PCDCollection(await getPackages(), [identityPCD]);

  return { identity, identityPCD, passport };
  //   return pcds;

  //   console.log("pcds: ", pcds);

  await savePCDs(passport);

  //   window.location.hash = "#/new-passport?email=" + encodeURIComponent(email);

  //   update({ pcds });
}

const COLLECTION_KEY = "pcd_collection";

export async function savePCDs(pcds: PCDCollection): Promise<void> {
  const serialized = await pcds.serializeCollection();
  //   window.localStorage[COLLECTION_KEY] = serialized;
}

async function loadPackages(): Promise<PCDPackage[]> {
  // await SemaphoreGroupPCDPackage.init({
  //   wasmFilePath: "/semaphore-artifacts/16.wasm",
  //   zkeyFilePath: "/semaphore-artifacts/16.zkey"
  // });

  await SemaphoreSignaturePCDPackage.init?.({
    wasmFilePath: path.resolve(__dirname, "../feeds/artifacts/16.wasm"),
    zkeyFilePath: path.resolve(__dirname, "../feeds/artifacts/16.zkey"),
  });

  // await EthereumOwnershipPCDPackage.init({
  //   wasmFilePath: "/semaphore-artifacts/16.wasm",
  //   zkeyFilePath: "/semaphore-artifacts/16.zkey"
  // });

  // await RSATicketPCDPackage.init({
  //   makeEncodedVerifyLink
  // });

  // await EdDSAFrogPCDPackage.init({
  //   makeEncodedVerifyLink
  // });

  await EdDSATicketPCDPackage.init?.({
    makeEncodedVerifyLink,
  });

  // await ZKEdDSAEventTicketPCDPackage.init({
  //   wasmFilePath: "/artifacts/zk-eddsa-event-ticket-pcd/circuit.wasm",
  //   zkeyFilePath: "/artifacts/zk-eddsa-event-ticket-pcd/circuit.zkey"
  // });

  // await ZKEdDSAFrogPCDPackage.init({
  //   wasmFilePath: "/artifacts/zk-eddsa-frog-pcd/circuit.wasm",
  //   zkeyFilePath: "/artifacts/zk-eddsa-frog-pcd/circuit.zkey"
  // });

  return [
    //   SemaphoreGroupPCDPackage,
    SemaphoreIdentityPCDPackage,
    SemaphoreSignaturePCDPackage,
    //   EthereumOwnershipPCDPackage,
    //   HaLoNoncePCDPackage,
    //   RSAPCDPackage,
    //   RSATicketPCDPackage,
    //   EdDSAPCDPackage,
    //   EdDSAFrogPCDPackage,
    //   ZKEdDSAFrogPCDPackage,
    EdDSATicketPCDPackage,
    //   ZKEdDSAEventTicketPCDPackage,
    //   RSAImagePCDPackage,
    EmailPCDPackage,
  ];
}
export function makeEncodedVerifyLink(encodedPCD: string): string {
  const link = `${window.location.origin}/#/verify?pcd=${encodeURIComponent(
    encodedPCD,
  )}`;
  return link;
}

/**
 * Issues email PCDs based on the user's verified email address.
 * Currently we only verify a single email address, but could provide
 * multiple PCDs if it were possible to verify secondary emails.
 */
export async function issueEmailPCDs({
  email,
  identityCommitment,
  privateKey,
}: {
  email: string;
  identityCommitment: string;
  privateKey: string;
  //   credential: SemaphoreSignaturePCD,
}): Promise<EmailPCD> {
  const stableId = "attested-email-" + email;

  return EmailPCDPackage.prove({
    privateKey: {
      value: privateKey,
      argumentType: ArgumentTypeName.String,
    },
    id: {
      value: stableId,
      argumentType: ArgumentTypeName.String,
    },
    emailAddress: {
      value: email,
      argumentType: ArgumentTypeName.String,
    },
    semaphoreId: {
      value: identityCommitment,
      argumentType: ArgumentTypeName.String,
    },
  });
}

export async function genSignedPCDIdentity(
  identity: Identity,
): Promise<SerializedPCD<SemaphoreSignaturePCD>> {
  // let cachedSignaturePCD = loadCheckinCredential(
  //   identity.getCommitment().toString(),
  // );
  // if (!cachedSignaturePCD) {
    // cachedSignaturePCD =
    return await SemaphoreSignaturePCDPackage.serialize(
      await SemaphoreSignaturePCDPackage.prove({
        identity: {
          argumentType: ArgumentTypeName.PCD,
          value: await SemaphoreIdentityPCDPackage.serialize(
            await SemaphoreIdentityPCDPackage.prove({
              identity,
            }),
          ),
        },
        signedMessage: {
          argumentType: ArgumentTypeName.String,
          value: ISSUANCE_STRING,
        },
      }),
    );

    // saveCheckinCredential(
    //   identity.getCommitment().toString(),
    //   cachedSignaturePCD,
    // );
  // }

  // return cachedSignaturePCD;
}

export function loadCheckinCredential(
  key: string,
): SerializedPCD<SemaphoreSignaturePCD> | undefined {
  try {
    const serializedPCD = JSON.parse(
      window.localStorage[`checkin_credential_${key}`],
    );
    if (serializedPCD) {
      return serializedPCD;
    }
  } catch (e) {
    // Do nothing
  }
  return undefined;
}

export function saveCheckinCredential(
  key: string,
  serializedPCD: SerializedPCD<SemaphoreSignaturePCD>,
): void {
  window.localStorage[`checkin_credential_${key}`] =
    JSON.stringify(serializedPCD);
}
