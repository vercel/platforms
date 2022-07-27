/* eslint-disable */

import Script from "next/script";
import { useRef, ReactNode, MouseEvent } from "react";

import type {
  CloudinaryCallbackImage,
  CloudinaryWidget,
  CloudinaryWidgetResult,
} from "@/types";

interface ChildrenProps {
  open: (e: MouseEvent) => void;
}

interface CloudinaryUploadWidgetProps {
  callback: (image: CloudinaryCallbackImage) => void;
  children: (props: ChildrenProps) => ReactNode;
}

const CloudinaryUploadWidget = ({
  callback,
  children,
}: CloudinaryUploadWidgetProps) => {
  const widget = useRef<CloudinaryWidget>();

  function open(e: MouseEvent) {
    e.preventDefault();
    if (widget.current) {
      widget.current.open();
    }
  }

  function handleOnLoad() {
    widget.current = window.cloudinary?.createUploadWidget(
      {
        cloudName: "vercel-platforms",
        uploadPreset: "w0vnflc6",
        cropping: true,
      },
      (error: unknown | undefined, result: CloudinaryWidgetResult) => {
        if (!error && result && result.event === "success") {
          callback(result.info);
        }
      }
    );
  }
  return (
    <>
      {children({ open })}
      <Script
        id="cloudinary"
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        onLoad={handleOnLoad}
      />
    </>
  );
};

export default CloudinaryUploadWidget;
