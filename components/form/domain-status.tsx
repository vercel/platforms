"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

import LoadingSpinner from "./loading-spinner";
import { useDomainStatus } from "./use-domain-status";

export default function DomainStatus({ domain }: { domain: string }) {
  const { loading, status } = useDomainStatus({ domain });

  return loading ? (
    <LoadingSpinner />
  ) : status === "Valid Configuration" ? (
    <CheckCircle2
      className="text-white dark:text-black"
      fill="#2563EB"
      stroke="currentColor"
    />
  ) : status === "Pending Verification" ? (
    <AlertCircle
      className="text-white dark:text-black"
      fill="#FBBF24"
      stroke="currentColor"
    />
  ) : (
    <XCircle
      className="text-white dark:text-black"
      fill="#DC2626"
      stroke="currentColor"
    />
  );
}
