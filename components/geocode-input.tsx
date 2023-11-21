"use client";
import { geocodeAction } from "@/lib/actions";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import debounce from "lodash/debounce";

export const GeocodeInput = () => {
  const [address, setAddress] = useState("");
  const [results, setResults] = useState<{ formatted_address: string }[]>([]);

  // const debouncedGeocode = useCallback(
  //   (address: string) =>
  //     debounce(
  //       (a) =>
  //         geocodeAction(a).then((res) => {
  //           console.log("response: ", res);
  //           setResults(res);
  //         }),
  //       500,
  //       { leading: true, trailing: true },
  //     ),
  //   [],
  // ); // 500ms delay

  useEffect(() => {
    if (address) {
      geocodeAction(address).then((res) => {
        console.log("response: ", res);
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
              setResults([])
            }}
          >
            {result.formatted_address}
          </li>
        ))}
      </ul>
    </div>
  );
};
