"use client";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";

import type { ControlPosition } from "react-map-gl";
import { MapContextValue } from "react-map-gl/dist/esm/components/map";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Place } from "@prisma/client";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  initialPlaces: Place[];
  position?: ControlPosition;

  onCreate: (evt: { features: Feature<Geometry, GeoJsonProperties>[] }) => void;
  onUpdate: (evt: {
    features: Feature<Geometry, GeoJsonProperties>[];
    action: string;
  }) => void;
  onDelete: (evt: { features: Feature<Geometry, GeoJsonProperties>[] }) => void;
  onSelectionChange: (
    evt?:
      | {
          features: Feature<Geometry, GeoJsonProperties>[];
        }
      | undefined,
  ) => void;
  setIdMapping: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
};

export default function DrawControl({
  drawRef,
  initialPlaces,
  setIdMapping,
  ...props
}: DrawControlProps & {
  drawRef: React.MutableRefObject<MapboxDraw | null>;
}) {
  useControl<MapboxDraw>(
    () => {
      const draw = new MapboxDraw(props);
      drawRef.current = draw;
      return draw;
    },
    (ctx: MapContextValue) => {
      ctx.map.on("draw.create", props.onCreate);
      ctx.map.on("draw.update", props.onUpdate);
      ctx.map.on("draw.delete", props.onDelete);
      ctx.map.on("draw.selectionchange", props.onSelectionChange);

      let idMapping: { [key: string]: any } = {};
      initialPlaces.forEach((place) => {
        const ids = drawRef?.current?.add(place.geoJSON as unknown as Geometry);
        const featureId = ids?.[0] ?? ids
        idMapping[featureId as string] = place.id;
      });
      setIdMapping((prev) => {
        return { ...prev, ...idMapping };
      });
    },
    (ctx: MapContextValue) => {
      ctx.map.off("draw.create", props.onCreate);
      ctx.map.off("draw.update", props.onUpdate);
      ctx.map.off("draw.delete", props.onDelete);
      ctx.map.off("draw.selectionchange", props.onSelectionChange);
    },
    {
      position: props.position,
    },
  );

  return null;
}
