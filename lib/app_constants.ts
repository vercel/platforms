

export const RESPONSE_CODES = {
  Continue: {
    code: 100,
    shortName: "Continue",
    message:
      "The server has received the request header and is waiting for the rest of the request.",
  },
  SwitchingProtocols: {
    code: 101,
    shortName: "SwitchingProtocols",
    message:
      "The server agrees to switch protocols, as indicated by the Upgrade header in the request.",
  },
  Processing: {
    code: 102,
    shortName: "Processing",
    message:
      "The server has received and is processing the request, but no response is available yet.",
  },
  OK: {
    code: 200,
    shortName: "OK",
    message: "The request was successful.",
  },
  Created: {
    code: 201,
    shortName: "Created",
    message:
      "The request has been fulfilled and resulted in a new resource being created.",
  },
  Accepted: {
    code: 202,
    shortName: "Accepted",
    message:
      "The request has been accepted for processing, but the processing has not been completed.",
  },
  NonAuthoritativeInformation: {
    code: 203,
    shortName: "NonAuthoritativeInformation",
    message:
      "The response to the request may not be authoritative for the origin server.",
  },
  NoContent: {
    code: 204,
    shortName: "NoContent",
    message:
      "The server has successfully processed the request, but is not returning any content.",
  },
  ResetContent: {
    code: 205,
    shortName: "ResetContent",
    message:
      "The client should reset the document view which caused the request to be sent.",
  },
  PartialContent: {
    code: 206,
    shortName: "PartialContent",
    message:
      "The server is delivering only part of the resource due to a Range header sent by the client.",
  },
  MultiStatus: {
    code: 207,
    shortName: "MultiStatus",
    message:
      "The message body contains a status line for each resource in the request.",
  },
  AlreadyReported: {
    code: 208,
    shortName: "AlreadyReported",
    message: "The request has already been acted upon and is now being resent.",
  },
  IMUsed: {
    code: 226,
    shortName: "IMUsed",
    message:
      "The server has fulfilled a request for the resource, and the resource is now locked.",
  },
  MultipleChoices: {
    code: 300,
    shortName: "MultipleChoices",
    message:
      "The request has several possible responses. The user agent should choose the preferred one.",
  },
  MovedPermanently: {
    code: 301,
    shortName: "MovedPermanently",
    message: "The resource has been permanently moved to a new location.",
  },
  Found: {
    code: 302,
    shortName: "Found",
    message: "The resource has been temporarily moved to a new location.",
  },
  SeeOther: {
    code: 303,
    shortName: "SeeOther",
    message: "The response to the request can be found at another URI.",
  },
  NotModified: {
    code: 304,
    shortName: "NotModified",
    message:
      "The resource has not been modified since last accessed by the client.",
  },
  UseProxy: {
    code: 305,
    shortName: "UseProxy",
    message: "The requested resource is available through a proxy server.",
  },
  TemporaryRedirect: {
    code: 307,
    shortName: "TemporaryRedirect",
    message: "The server is sending temporary redirect.",
  },
  PermanentRedirect: {
    code: 308,
    shortName: "PermanentRedirect",
    message: "The server is sending permanent redirect.",
  },
  BadRequest: {
    code: 400,
    shortName: "BadRequest",
    message:
      "The request could not be understood by the server due to invalid syntax.",
  },
  Unauthorized: {
    code: 401,
    shortName: "Unauthorized",
    message: "The client is not authorized to access the requested resource.",
  },
  PaymentRequired: {
    code: 402,
    shortName: "PaymentRequired",
    message: "Payment is required for the requested resource.",
  },
  Forbidden: {
    code: 403,
    shortName: "Forbidden",
    message: "The server has refused to fulfill the request.",
  },
  NotFound: {
    code: 404,
    shortName: "NotFound",
    message: "The requested resource could not be found.",
  },
  MethodNotAllowed: {
    code: 405,
    shortName: "MethodNotAllowed",
    message:
      "The request method is not supported by the server for this resource.",
  },
  NotAcceptable: {
    code: 406,
    shortName: "NotAcceptable",
    message:
      "The requested resource is not acceptable according to the content negotiation headers sent by the client.",
  },
  ProxyAuthenticationRequired: {
    code: 407,
    shortName: "ProxyAuthenticationRequired",
    message: "The client must first authenticate itself with the proxy server.",
  },
  RequestTimeout: {
    code: 408,
    shortName: "RequestTimeout",
    message: "The server timed out waiting for the request to be sent.",
  },
  Conflict: {
    code: 409,
    shortName: "Conflict",
    message:
      "The request could not be completed due to a conflict with the current state of the resource.",
  },
  Gone: {
    code: 410,
    shortName: "Gone",
    message:
      "The requested resource is no longer available and will not be available again.",
  },
  LengthRequired: {
    code: 411,
    shortName: "LengthRequired",
    message: "The request must include a content length header.",
  },
  PreconditionFailed: {
    code: 412,
    shortName: "PreconditionFailed",
    message:
      "The precondition given in one or more request headers evaluated to false as per the server.",
  },
  PayloadTooLarge: {
    code: 413,
    shortName: "PayloadTooLarge",
    message:
      "The server refused to accept the request because the payload was too large.",
  },
  URITooLong: {
    code: 414,
    shortName: "URITooLong",
    message: "The URI provided to the server was too long.",
  },
  UnsupportedMediaType: {
    code: 415,
    shortName: "UnsupportedMediaType",
    message: "The server does not support the media type of the request.",
  },
  RangeNotSatisfiable: {
    code: 416,
    shortName: "RangeNotSatisfiable",
    message:
      "The client has specified a range for the content, but the server cannot satisfy that range.",
  },
  ExpectationFailed: {
    code: 417,
    shortName: "ExpectationFailed",
    message:
      "Missing essential parameters or invalid parameter values in the request.",
  },
  IamTeapot: {
    code: 418,
    shortName: "IamTeapot",
    message:
      "(This code was intended as a joke. Some servers might return it if the client sends them an inappropriate request header.)",
  },
  MisdirectedRequest: {
    code: 421,
    shortName: "MisdirectedRequest",
    message: "The request was directed at an incorrect server.",
  },
  Unprocessable: {
    code: 422,
    shortName: "Unprocessable",
    message: "",
  },
  UnprocessableEntity: {
    code: 422,
    shortName: "UnprocessableEntity",
    message:
      "The request was well-formed but was unable to be processed due to semantic errors.",
  },
  Locked: {
    code: 423,
    shortName: "Locked",
    message: "The resource that is being accessed is locked.",
  },
  FailedDependency: {
    code: 424,
    shortName: "FailedDependency",
    message: "A request could not be completed due to a dependency failure.",
  },
  TooEarly: {
    code: 425,
    shortName: "TooEarly",
    message:
      "The server refuses to process a request because the expectation in the request header field is set too far in the future.",
  },
  UpgradeRequired: {
    code: 426,
    shortName: "UpgradeRequired",
    message:
      "The server refuses to process a request because the client does not support the communication protocol which is required by the server.",
  },
  PreconditionRequired: {
    code: 428,
    shortName: "PreconditionRequired",
    message:
      "The request requires a precondition which is not met by the server.",
  },
  TooManyRequests: {
    code: 429,
    shortName: "TooManyRequests",
    message: "The user has sent too many requests in a given amount of time.",
  },
  RequestHeaderFieldsTooLarge: {
    code: 431,
    shortName: "RequestHeaderFieldsTooLarge",
    message:
      "The server refused to process the request because the request header fields were too large.",
  },
  UnavailableForLegalReasons: {
    code: 451,
    shortName: "UnavailableForLegalReasons",
    message:
      "The server rejected the request because the resource is unavailable for legal reasons.",
  },
  InternalServerError: {
    code: 500,
    shortName: "InternalServerError",
    message:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  NotImplemented: {
    code: 501,
    shortName: "NotImplemented",
    message:
      "The server does not support the functionality required to fulfill the request.",
  },
  BadGateway: {
    code: 502,
    shortName: "BadGateway",
    message:
      "The server, while acting as a gateway or proxy, received an invalid response from an upstream server.",
  },
  ServiceUnavailable: {
    code: 503,
    shortName: "ServiceUnavailable",
    message:
      "The server is unavailable to handle the request due to temporary overloading or maintenance of the server.",
  },
  GatewayTimeout: {
    code: 504,
    shortName: "GatewayTimeout",
    message:
      "The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.",
  },
  HTTPVersionNotSupported: {
    code: 505,
    shortName: "HTTPVersionNotSupported",
    message:
      "The server does not support the HTTP version used in the request.",
  },
  VariantAlsoNegotiates: {
    code: 506,
    shortName: "VariantAlsoNegotiates",
    message:
      "The server has an internal configuration error which prevents the server from selecting a variant.",
  },
  InsufficientStorage: {
    code: 507,
    shortName: "InsufficientStorage",
    message:
      "The server does not have sufficient storage space to fulfill the request.",
  },
  LoopDetected: {
    code: 508,
    shortName: "LoopDetected",
    message:
      "The server detected an infinite loop while processing the request.",
  },
  NotExtended: {
    code: 510,
    shortName: "NotExtended",
    message:
      "The server does not support the extension framework requested in the request.",
  },
  NetworkAuthenticationRequired: {
    code: 511,
    shortName: "NetworkAuthenticationRequired",
    message: "The client needs to be authenticated to gain network access.",
  },
};
  