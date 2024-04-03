import { RESPONSE_CODES } from "@/lib/app_constants";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";


export function apiErrorHandler(error, req:NextRequest) {
  // Default error status code
  let statusWithMsg = RESPONSE_CODES.InternalServerError;
  error?.code && (statusWithMsg.code = error?.code);
  error?.message && (statusWithMsg.message = error?.message);

  // Check if the error is a Node assert error
  if (error instanceof assert.AssertionError) {
    statusWithMsg.message =
      error?.message || RESPONSE_CODES.ExpectationFailed.message;
    statusWithMsg.code = RESPONSE_CODES.ExpectationFailed.code;
  }

  // Todo use winston to Log the error
  console.error(req.nextUrl.pathname, error);
  return NextResponse.json(
    { message: statusWithMsg.message, data: error },
    { status: statusWithMsg.code },
  );
}