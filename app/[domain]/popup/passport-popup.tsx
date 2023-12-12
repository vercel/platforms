"use client";
import { useEffect, useState } from "react";

/**
 * React hook that listens for PCDs and PendingPCDs from a passport popup window
 * using message passing and event listeners.
 */
export function usePassportPopupMessages() {
  const [pcdStr, setPCDStr] = useState("");
  const [pendingPCDStr, setPendingPCDStr] = useState("");

  // Listen for PCDs coming back from the Passport popup
  useEffect(() => {
    function receiveMessage(ev: MessageEvent<any>) {
      // Extensions including Metamask apparently send messages to every page. Ignore those.
      if (ev.data.encodedPCD) {
        console.log("Received PCD", ev.data.encodedPCD);
        setPCDStr(ev.data.encodedPCD);
      } else if (ev.data.encodedPendingPCD) {
        console.log(ev.data);
        setPendingPCDStr(ev.data.encodedPendingPCD);
      }
    }
    window.addEventListener("message", receiveMessage, false);
    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  return [pcdStr, pendingPCDStr];
}

/**
 * A react hook that sets up necessary passport popup logic on a specific route.
 * A popup page must be hosted on the website using the passport, as data can't
 * be passed between a website and a popup on a different origin like zupass.org.
 * This hook sends messages with a full client-side PCD or a server-side PendingPCD
 * that can be processed by the `usePassportPopupMessages` hook. PendingPCD requests
 * can further be processed by `usePendingPCD` and `usePCDMultiplexer`.
 */
export function usePassportPopupSetup() {
  // Usually this page redirects immediately. If not, show an error.
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.opener == null) {
      setError("Not a popup window");
      return;
    }

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const paramsProofUrl = params.get("proofUrl");
    const paramsProof = params.get("proof");
    const paramsEncodingPendingPCD = params.get("encodedPendingPCD");
    const finished = params.get("finished");

    // First, this page is window.open()-ed. Redirect to the Passport app.
    if (paramsProofUrl != null) {
      window.location.href = decodeURIComponent(paramsProofUrl);
    } else if (finished) {
      // Later, the Passport redirects back with a result. Send it to our parent.
      if (paramsProof != null) {
        window.opener.postMessage({ encodedPCD: paramsProof }, "*");
      }

      window.close();
      setTimeout(() => {
        setError("Finished. Please close this window.");
      }, 1000 * 3);
    } else if (paramsEncodingPendingPCD != null) {
      // Later, the Passport redirects back with a encodedPendingPCD. Send it to our parent.
      window.opener.postMessage(
        { encodedPendingPCD: paramsEncodingPendingPCD },
        "*",
      );
      window.close();
      setTimeout(() => {
        setError("Finished. Please close this window.");
      }, 1000 * 3);
    }
  }, []);

  return error;
}

/**
 * Open up a passport popup window using proofUrl from specific PCD integrations
 * and popupUrl, which is the route where the usePassportPopupSetup hook is being
 * served from.
 */
export function openPassportPopup(popupUrl: string, proofUrl: string) {
  const url = `${popupUrl}?proofUrl=${encodeURIComponent(proofUrl)}`;
  window.open(url, "_blank", "width=360,height=480,top=100,popup");
}
