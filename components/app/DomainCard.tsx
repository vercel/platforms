import useSWR, { mutate } from "swr";
import { useState } from "react";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Site } from "@prisma/client";

type DomainData = Pick<
  Site,
  | "customDomain"
  | "description"
  | "id"
  | "image"
  | "imageBlurhash"
  | "name"
  | "subdomain"
>;

interface DomainCardProps<T = DomainData> {
  data: T;
}

export default function DomainCard({ data }: DomainCardProps) {
  const { data: valid, isValidating } = useSWR<Site>(
    `/api/domain/check?domain=${data.customDomain}`,
    fetcher,
    { revalidateOnMount: true, refreshInterval: 5000 }
  );
  const [recordType, setRecordType] = useState("CNAME");
  const [removing, setRemoving] = useState(false);
  const subdomain = // if domain is a subdomain
    data.customDomain && data.customDomain.split(".").length > 2
      ? data.customDomain.split(".")[0]
      : "";

  return (
    <div className="w-full max-w-2xl mt-10 border border-black rounded-lg py-10">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 justify-between px-10">
        <a
          className="text-xl font-semibold flex justify-center sm:justify-start items-center"
          href={`http://${data.customDomain}`}
          rel="noreferrer"
          target="_blank"
        >
          {data.customDomain}
          <span className="inline-block ml-2">
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
        <div className="flex space-x-3">
          <button
            onClick={() => {
              mutate(`/api/domain/check?domain=${data.customDomain}`);
            }}
            disabled={isValidating}
            className={`${
              isValidating
                ? "cursor-not-allowed bg-gray-100"
                : "bg-white hover:text-black hover:border-black"
            } text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {isValidating ? <LoadingDots /> : "Refresh"}
          </button>
          <button
            onClick={async () => {
              setRemoving(true);
              await fetch(
                `/api/domain?domain=${data.customDomain}&siteId=${data.id}`,
                {
                  method: HttpMethod.DELETE,
                }
              ).then((res) => {
                setRemoving(false);
                if (res.ok) {
                  mutate(`/api/site?siteId=${data.id}`);
                } else {
                  alert("Error removing domain");
                }
              });
            }}
            disabled={removing}
            className={`${
              removing ? "cursor-not-allowed bg-gray-100" : ""
            }bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {removing ? <LoadingDots /> : "Remove"}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 my-3 px-10">
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
            valid ? "text-black font-normal" : "text-red-700 font-medium"
          } text-sm`}
        >
          {valid ? "Valid" : "Invalid"} Configuration
        </p>
      </div>

      {!valid && (
        <>
          <div className="w-full border-t border-gray-100 mt-5 mb-8" />

          <div className="px-10">
            <div className="flex justify-start space-x-4">
              <button
                onClick={() => setRecordType("CNAME")}
                className={`${
                  recordType == "CNAME"
                    ? "text-black border-black"
                    : "text-gray-400 border-white"
                } text-sm border-b-2 pb-1 transition-all ease duration-150`}
              >
                CNAME Record (subdomains)
              </button>
              {/* if the custom domain is a subdomain, only show CNAME record */}
              {!subdomain && (
                <button
                  onClick={() => setRecordType("A")}
                  className={`${
                    recordType == "A"
                      ? "text-black border-black"
                      : "text-gray-400 border-white"
                  } text-sm border-b-2 pb-1 transition-all ease duration-150`}
                >
                  A Record (apex domain)
                </button>
              )}
            </div>
            <div className="my-3 text-left">
              <p className="my-5 text-sm">
                Set the following record on your DNS provider to continue:
              </p>
              <div className="flex justify-start items-center space-x-10 bg-gray-50 p-2 rounded-md">
                <div>
                  <p className="text-sm font-bold">Type</p>
                  <p className="text-sm font-mono mt-2">{recordType}</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Name</p>
                  {/* if the custom domain is a subdomain, the CNAME record is the subdomain */}
                  <p className="text-sm font-mono mt-2">
                    {recordType === "A"
                      ? "@"
                      : recordType == "CNAME" && subdomain
                      ? subdomain
                      : "www"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold">Value</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType == "CNAME" ? `cname.vercel.pub` : `76.76.21.21`}
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
