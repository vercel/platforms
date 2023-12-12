// import { EdDSAPCDPackage } from "@pcd/eddsa-pcd";
// import {  ArgumentTypeName, EdDSAPCDPackage } from "@pcd/passport-interface"
// import { constructPassportPcdGetRequestUrl } from "@pcd/passport-interface";
// import { ArgumentTypeName } from "@pcd/pcd-types";
import {
  constructPassportPcdGetRequestUrl,
  ArgumentTypeName,
  EdDSAPCDPackage,
  EdDSAPCDTypeName,
} from "@/lib/pcd-light";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const callbackUrl = `https://api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pcd/issue/callback`;
  console.log("callbackUrl: ", callbackUrl);
  const url = constructPassportPcdGetRequestUrl<typeof EdDSAPCDPackage>(
    "https://zupass.org",
    callbackUrl, // This endpoint will handle the request's results.
    EdDSAPCDTypeName,
    {
      id: {
        argumentType: ArgumentTypeName.String,
      },
      message: {
        argumentType: ArgumentTypeName.StringArray,
        value: ["0x32"],
      },
      privateKey: {
        argumentType: ArgumentTypeName.String,
        userProvided: true,
      },
    },
    {
      genericProveScreen: true,
    },
  );

  const response = await fetch(url);
  console.log("response: ", response);
  return NextResponse.json(response);
}
