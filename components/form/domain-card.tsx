"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { fetcher } from "@/lib/utils";

import type { Site } from "@prisma/client";

export default function DomainCard({ customDomain }: { customDomain: string }) {
  const { data: valid, isValidating } = useSWR<Site>(
    `/api/domain/check?domain=${customDomain}`,
    fetcher,
    { revalidateOnMount: true, refreshInterval: 5000 },
  );
  const [recordType, setRecordType] = useState("CNAME");
  const subdomain = // if domain is a subdomain
    customDomain && customDomain.split(".").length > 2
      ? customDomain.split(".")[0]
      : "";

  return (
    <div className="mt-10 w-full max-w-2xl rounded-lg border border-black py-10">
      <div className="flex flex-col justify-between space-y-4 px-10 sm:flex-row sm:space-x-4">
        <a
          className="flex items-center justify-center text-xl font-semibold sm:justify-start"
          href={`http://${customDomain}`}
          rel="noreferrer"
          target="_blank"
        >
          {customDomain}
          <span className="ml-2 inline-block">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </span>
        </a>
      </div>

      <div className="my-3 flex items-center space-x-3 px-10">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle cx="12" cy="12" r="10" fill={valid ? "#1976d2" : "#d32f2f"} />
          {valid ? (
            <>
              <path
                d="M8 11.8571L10.5 14.3572L15.8572 9"
                fill="none"
                stroke="white"
              />
            </>
          ) : (
            <>
              <path d="M15 9l-6 6" stroke="white" />
              <path d="M9 9l6 6" stroke="white" />
            </>
          )}
        </svg>
        <p
          className={`${
            valid ? "font-normal text-black" : "font-medium text-red-700"
          } text-sm`}
        >
          {valid ? "Valid" : "Invalid"} Configuration
        </p>
      </div>

      {!valid && (
        <>
          <div className="mb-8 mt-5 w-full border-t border-gray-100" />

          <div className="px-10">
            <div className="flex justify-start space-x-4">
              <button
                onClick={() => setRecordType("CNAME")}
                className={`${
                  recordType == "CNAME"
                    ? "border-black text-black"
                    : "border-white text-gray-400"
                } ease border-b-2 pb-1 text-sm transition-all duration-150`}
              >
                CNAME Record (subdomains)
              </button>
              {/* if the custom domain is a subdomain, only show CNAME record */}
              {!subdomain && (
                <button
                  onClick={() => setRecordType("A")}
                  className={`${
                    recordType == "A"
                      ? "border-black text-black"
                      : "border-white text-gray-400"
                  } ease border-b-2 pb-1 text-sm transition-all duration-150`}
                >
                  A Record (apex domain)
                </button>
              )}
            </div>
            <div className="my-3 text-left">
              <p className="my-5 text-sm">
                Set the following record on your DNS provider to continue:
              </p>
              <div className="flex items-center justify-start space-x-10 rounded-md bg-gray-50 p-2">
                <div>
                  <p className="text-sm font-bold">Type</p>
                  <p className="mt-2 font-mono text-sm">{recordType}</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Name</p>
                  {/* if the custom domain is a subdomain, the CNAME record is the subdomain */}
                  <p className="mt-2 font-mono text-sm">
                    {recordType === "A"
                      ? "@"
                      : recordType == "CNAME" && subdomain
                      ? subdomain
                      : "www"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold">Value</p>
                  <p className="mt-2 font-mono text-sm">
                    {recordType == "CNAME"
                      ? `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                      : `76.76.21.21`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
