// import { EdDSAPCDPackage } from "@pcd/eddsa-pcd";
// import {  ArgumentTypeName, EdDSAPCDPackage } from "@pcd/passport-interface"
import { EdDSAPCDPackage } from "@pcd/eddsa-pcd";
// import { constructPassportPcdGetRequestUrl } from "@pcd/passport-interface";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { constructPassportPcdGetRequestUrl } from "@/lib/pcd-light";

const url = constructPassportPcdGetRequestUrl<typeof EdDSAPCDPackage>(
  "https://zupass.org",
  `https://api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/pcd/issue/verify`, // This endpoint will handle the request's results.
  EdDSAPCDPackage.name,
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
  const response = await fetch(url).then((res) => res.json());
  console.log("response: ", response);
}
