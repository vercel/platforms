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
const url = constructPassportPcdGetRequestUrl<typeof EdDSAPCDPackage>(
  "https://zupass.org",
  `https://api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pcd/issue/callback`, // This endpoint will handle the request's results.
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

export async function GET(request: Request) {
  const response = (await fetch(url)).body;
  console.log("response: ", response);
  return NextResponse.json(response);
}
