import * as React from "react";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import centroid from "@turf/centroid";
import { Place } from "@prisma/client";

import { cn } from "@/lib/utils";
import EditPlaceForm from "@/components/form/edit-place-form";

type SelectedPanelProps = {
  selectedFeature?: Feature<Polygon, GeoJsonProperties>;
  selectedPlace?: Place;
  geocodeResult?: any;
};

function SelectedPanel(props: SelectedPanelProps) {
  console.log("selectedPlace", props.selectedPlace);
  const panelClass = props.selectedPlace ? "translate-x-0" : "translate-x-full";

  if (!props.selectedPlace) {
    return (
      <div
        className={cn(
          "absolute bottom-0 right-0 top-0 w-[15rem] border-l bg-gray-200/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80",
          panelClass,
        )}
      />
    );
  }

  const [lng, lat] = centroid(
    props.selectedPlace.geoJSON as unknown as Feature<Polygon>,
  ).geometry.coordinates;

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 top-0 w-[15rem] border-l bg-gray-200/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80",
        panelClass,
      )}
    >
      <EditPlaceForm place={props.selectedPlace} />
    </div>
  );
}

export default React.memo(SelectedPanel);
