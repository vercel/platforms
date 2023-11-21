import * as React from "react";
import area from "@turf/area";
import { Feature, GeoJsonProperties, Geometry, Polygon } from "geojson";
import centroid from "@turf/centroid";

type ControlPanelProps = {
  features: { [key: string]: Feature };
  selectedFeature?: Feature<Geometry, GeoJsonProperties>;
  onSelectPlace: (
    id: string,
    position: { latitude: number; longitude: number },
  ) => void;
};

function ControlPanel(props: ControlPanelProps) {
  const features = Object.values(props.features);
  let polygonArea = 0;
  for (const polygon of features) {
    polygonArea += area(polygon);
  }

  return (
    <div className="absolute left-3 top-40 rounded bg-gray-300/40 backdrop-blur">
      <h3>Draw Polygon</h3>

      {features.map((polygon, index) => (
        <div
          key={index}
          onClick={() => {
            const [lng, lat] = centroid(polygon.geometry as Polygon).geometry
              .coordinates;

            props.onSelectPlace(polygon.id as string, {
              longitude: lng,
              latitude: lat,
            });
          }}
        >
          <div>{area(polygon)}</div>

          {/* Render your polygon data here */}
        </div>
      ))}
    </div>
  );
}

export default React.memo(ControlPanel);
