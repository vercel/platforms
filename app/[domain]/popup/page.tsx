"use client";
import { usePassportPopupSetup } from "@pcd/passport-interface";

/**  This popup sends requests and receives PCDs from the passport. */
export default function PassportPopupRedirect() {
  console.log('usePassportPopupSetup: ', usePassportPopupSetup)
  const error = usePassportPopupSetup();
  console.log('error: ', error)
  return <div>{error}</div>;
}