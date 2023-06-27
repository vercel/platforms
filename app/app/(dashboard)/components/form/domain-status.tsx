"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import LoadingSpinner from "./loading-spinner";
import { useDomainStatus } from "./use-domain-status";

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return (
    <div className="absolute right-3 z-10 h-full flex items-center">
      {loading ? (
        <LoadingSpinner />
      ) : status === "Valid Configuration" ? (
        <CheckCircle2 fill="#2563EB" stroke="white" />
      ) : status === "Pending Verification" ? (
        <AlertCircle fill="#FBBF24" stroke="white" />
      ) : (
        <XCircle fill="#DC2626" stroke="white" />
      )}
    </div>
  );
}
