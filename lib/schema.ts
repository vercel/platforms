import * as z from "zod";
export const CreateTicketTierFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  eventId: z.string().min(1, { message: "Event ID is required." }),
  roleId: z.string().min(1, { message: "Role ID is required." }),
  formId: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative(),
  price: z.coerce.number().nonnegative(),
  currency: z.string().min(1, { message: "Currency is required." }),
});

const MapboxAddressSchema = z.object({
  poi: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  locality: z.string().optional(),
  postcode: z.string().optional(),
  place: z.string().optional(),
  district: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
});

const GoogleAddressSchema = z.object({
  streetNumber: z.string().optional(),
  route: z.string().optional(),
  locality: z.string().optional(),
  administrativeAreaLevel1: z.string().optional(),
  administrativeAreaLevel2: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  formattedAddress: z.string().optional(),
  placeId: z.string().optional(),
  types: z.array(z.string()).optional(),
});

export const IssueTicketFormSchema = z.object({
  email: z.string().min(1, { message: "User ID is required." }),
  tierId: z.string().min(1, { message: "Tier ID is required." }),
  eventId: z.string().min(1, { message: "Event ID is required." }),
  // validFrom: z.date().optional(),
  // validTo: z.date().optional(),
  // amountPaid: z.coerce.number().nonnegative(),
});

// GEOJSON

const PositionSchema = z.tuple([z.number(), z.number()]);

const PointSchema = z.object({
  type: z.literal("Point"),
  coordinates: PositionSchema,
});

const MultiPointSchema = z.object({
  type: z.literal("MultiPoint"),
  coordinates: z.array(PositionSchema),
});

const LineStringSchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(PositionSchema),
});

const MultiLineStringSchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(PositionSchema)),
});

const PolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(PositionSchema)),
});

const MultiPolygonSchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(PositionSchema))),
});

const GeometryCollectionSchema = z.object({
  type: z.literal("GeometryCollection"),
  geometries: z.array(
    z.union([
      PointSchema,
      MultiPointSchema,
      LineStringSchema,
      MultiLineStringSchema,
      PolygonSchema,
      MultiPolygonSchema,
    ]),
  ),
});

const GeometrySchema = z.union([
  PointSchema,
  MultiPointSchema,
  LineStringSchema,
  MultiLineStringSchema,
  PolygonSchema,
  MultiPolygonSchema,
  GeometryCollectionSchema,
]);

const FeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: GeometrySchema,
  properties: z.record(z.unknown()).optional(),
});

const FeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(FeatureSchema),
});

// GEOJSON END

export const CreatePlaceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required." }).optional(),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Type is required." }).optional(),
  address: MapboxAddressSchema.array()
    .or(GoogleAddressSchema.array())
    .optional(),
  googleAddress: GoogleAddressSchema.array().optional(),
  mapboxAddress: MapboxAddressSchema.array().optional(), // adjust this based on your actual address structure
  latitude: z.number().min(1, { message: "Latitude is required." }).optional(),
  longitude: z
    .number()
    .min(1, { message: "Longitude is required." })
    .optional(),
  geoJSON: GeometrySchema.optional(),
  googlePlaceId: z.string().optional(),
  mapboxPlaceId: z.string().optional(),
});

export const UpdatePlaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required." }).optional(),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Type is required." }).optional(),
  address: MapboxAddressSchema.array()
    .or(GoogleAddressSchema.array())
    .optional(),
  googleAddress: GoogleAddressSchema.array().optional(),
  mapboxAddress: MapboxAddressSchema.array().optional(), // adjust this based on your actual address structure
  latitude: z.number().min(1, { message: "Latitude is required." }).optional(),
  longitude: z
    .number()
    .min(1, { message: "Longitude is required." })
    .optional(),
  geoJSON: GeometrySchema.optional(),
  googlePlaceId: z.string().optional(),
  mapboxPlaceId: z.string().optional(),
});

export const BedType = z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING"]);

export const CreateBedSchema = z.object({
  type: BedType,
});

export const CreateRoomSchema = z.object({
  capacity: z.number().int().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  beds: z.array(CreateBedSchema),
});

export const CreateAvailabilitySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export const CreateAccommodationUnitSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Type is required." }),
  capacity: z.coerce.number().int().nonnegative(),
  rooms: z.array(CreateRoomSchema),
  placeId: z.string().min(1, { message: "Place ID is required." }),
  parentId: z.string().optional(),
  availability: CreateAvailabilitySchema,
});

export const JoinACitySchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email().min(1, { message: "Email is required." }),
  description: z.string().min(60, { message: "Name is required." }),
});

export const FoundACitySchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email().min(1, { message: "Email is required." }),
  description: z.string().min(60, { message: "Name is required." }),
});

const EthAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const CreateCampaignSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  threshold: z.string().min(0, { message: "Threshold can't be negative" }),
  creatorEthAddress: EthAddressSchema,
  deployedAddress: EthAddressSchema,
});