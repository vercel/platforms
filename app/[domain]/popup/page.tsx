"use client";
import { usePassportPopupSetup } from "./passport-popup";

export default function PassportPopup() {
  return <div>{usePassportPopupSetup()}</div>;
}
