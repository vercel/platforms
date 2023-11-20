"use client";
import { geocodeAction } from "@/lib/actions";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import debounce from "lodash/debounce";

const debouncedGeocode = debounce(
  (address: string) => {
    return geocodeAction(address)
  },
  500,
  { leading: true, trailing: true },
); // 500ms delay

export const GeocodeInput = () => {
  const [address, setAddress] = useState("");
  const [results, setResults] = useState<{ formatted_address: string }[]>([]);


  useEffect(() => {
    if (address) {
      debouncedGeocode(address).then((res) => {
        setResults(res);
      });
    }
  }, [address]);

  return (
    <div>
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <ul>
        {results.map((result, index) => (
          <li
            key={index}
            onClick={() => {
              setAddress(result.formatted_address);
            }}
          >
            {result.formatted_address}
          </li>
        ))}
      </ul>
    </div>
  );
};
