"use client";

import { usePassportPopupSetup } from "@/app/[domain]/popup/passport-popup";


export default function PassportPopup() {
  return <div>{usePassportPopupSetup()}</div>;
}
