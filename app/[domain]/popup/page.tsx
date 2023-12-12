"use client";
import { useZupassPopupSetup } from "@pcd/passport-interface";
// import { usePassportPopupSetup } from "./passport-popup";

export default function PassportPopup() {
  

  return <div>{useZupassPopupSetup()}</div>;
}
