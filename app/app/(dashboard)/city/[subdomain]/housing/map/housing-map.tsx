"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Map, { MapRef } from "react-map-gl";

import DrawControl from "./draw-control";
import ControlPanel from "./control-panel";
import SelectedPanel from "./selected-panel";
import {
  BBox,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Polygon,
} from "geojson";
import GeocoderControl from "./geocoder-control";
import { createPlace, deletePlace, upsertPlace } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Place } from "@prisma/client";
import bbox from "@turf/bbox";

const calculateInitialBounds = (
  places: Place[],
  padding?: number,
): [[number, number], [number, number]] => {
  const geoJSONFeatures = places
    .filter((place) => place.geoJSON)
    .map((place) => ({
      type: "Feature" as const,
      geometry: place.geoJSON as unknown as Polygon,
      properties: {},
    }));

  if (geoJSONFeatures.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ]; // Return default bounds if no places
  }

  // Convert the array of features into a FeatureCollection
  const featureCollection: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: geoJSONFeatures,
  };

  // Calculate the bounding box for the FeatureCollection
  let bounds = bbox(featureCollection);

  // Add padding to the bounding box
  const boundsPadding = padding || 0; // Adjust this value to change the amount of padding
  bounds = [
    bounds[0] - boundsPadding, // min longitude
    bounds[1] - boundsPadding, // min latitude
    bounds[2] + boundsPadding, // max longitude
    bounds[3] + boundsPadding, // max latitude
  ];

  // Convert the bounding box to the format expected by react-map-gl
  return [
    [bounds[0], bounds[1]], // southwest corner
    [bounds[2], bounds[3]], // northeast corner
  ];
};

const placesArrayToPlacesMap = (places: Place[]) => {
  return places.reduce((acc, place) => {
    if (place.geoJSON) {
      acc[place.id] = {
        type: "Feature",
        id: place.id,
        geometry: place.geoJSON as unknown as Geometry,
        properties: {},
      };
    }
    return acc;
  }, {} as { [key: string]: Feature });
};

export default function HousingMap({ places }: { places: Place[] }) {
  const { subdomain } = useParams() as { subdomain: string };
  const [features, setFeatures] = useState<{ [key: string]: Feature }>(
    placesArrayToPlacesMap(places),
  );
  const [idMapping, setIdMapping] = useState<{ [key: string]: string }>({});

  console.log("idMapping: ", idMapping);
  const [selectedFeatureId, setSelectedFeatureId] = useState<
    string | undefined
  >();

  const [geocodeResult, setGeocodeResults] = useState<any | undefined>();

  const mapRef = useRef<MapRef>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const router = useRouter();

  const onSelectPlace = useCallback(
    (
      id: string,
      { longitude, latitude }: { longitude: number; latitude: number },
    ) => {
      console.log("ID: ", id);
      setSelectedFeatureId(id);
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        duration: 2000,
        zoom: 16,
      });
    },
    [],
  );

  const onCreate = useCallback(
    (e: { features: Feature[] }) => {
      setFeatures((currFeatures) => {
        const newFeatures = { ...currFeatures };
        for (const f of e.features) {
          if (f.id !== undefined) {
            newFeatures[f.id] = f;
            const place = { geoJSON: f.geometry };
            createPlace(place, { params: { subdomain } }, null)
              .then((place) => {
                setIdMapping((prev) => ({
                  ...prev,
                  ...{ [f.id as string]: place.id },
                })); // Set the new idMapping
                router.refresh();
                setSelectedFeatureId(f.id as string);
                toast("Created place: " + place);
              })
              .catch(console.error);
          }
        }
        return newFeatures;
      });
    },
    [subdomain],
  );

  const onUpdate = useCallback((e: { features: Feature[] }) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        if (f.id !== undefined) {
          newFeatures[f.id] = f;
          const place = { geoJSON: f.geometry };

          upsertPlace(place, { params: { subdomain } }, null)
            .then(() => {
              toast("Updated place: " + place);
            })
            .catch(console.error);
        }
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback(
    (e: { features: Feature[] }) => {
      setFeatures((currFeatures) => {
        const newFeatures = { ...currFeatures };
        for (const f of e.features) {
          if (f.id !== undefined) {
            console.log("featureId: ", f.id);

            const placeId = idMapping[f.id];
            console.log("placeId: ", placeId);

            deletePlace(placeId, { params: { subdomain } }, null)
              .then(() => {
                toast("Deleted place: " + placeId);
              })
              .catch(console.error);
            setIdMapping((mapping) => {
              delete mapping[f.id as string];
              return mapping;
            });
            delete newFeatures[f.id];
          }
        }
        return newFeatures;
      });
    },
    [subdomain],
  );

  const onSelectionChange = useCallback(
    (evt: { features: Feature<Geometry, GeoJsonProperties>[] } | undefined) => {
      console.log("selection change event: ", evt);
      if (evt?.features) {
        setSelectedFeatureId(evt?.features?.[0]?.id?.toString());
      } else {
        setSelectedFeatureId(undefined);
      }
    },
    [],
  );

  const selectedFeature = useMemo(() => {
    if (selectedFeatureId) {
      return features[selectedFeatureId];
    }
    return undefined;
  }, [selectedFeatureId, features]) as
    | Feature<Polygon, GeoJsonProperties>
    | undefined;

  const selectedPlace = useMemo(() => {
    if (selectedFeatureId) {
      const placeId = idMapping[selectedFeatureId];
      return places.find((p) => p.id === placeId);
    }
    return undefined;
  }, [selectedFeatureId, places, idMapping]) as Place | undefined;

  console.log(
    "features",
    features,
    "places",
    places,
    "idMapping",
    idMapping,
    "selectedFeatureId",
    selectedFeatureId,
    "selectedFeature",
    selectedFeature,
    "selectedPlace",
    selectedPlace,
  );

  const onGeocodeResult = useCallback((e: any) => {
    setGeocodeResults(e);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex pl-[15rem]">
      <Map
        initialViewState={{ bounds: calculateInitialBounds(places, 0.001) }}
        ref={mapRef}
        style={{ flex: 1, width: "calc(100vw - 15rem)", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_DEFAULT}
      >
        <GeocoderControl
          mapboxAccessToken={
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_DEFAULT as string
          }
          position="top-left"
          onResult={onGeocodeResult}
        />

        <DrawControl
          drawRef={drawRef}
          setIdMapping={setIdMapping}
          initialPlaces={places.filter((place) =>
            place?.geoJSON ? true : false,
          )}
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onSelectionChange={onSelectionChange}
        />
        <ControlPanel
          features={features}
          selectedFeature={selectedFeature}
          onSelectPlace={onSelectPlace}
        />
      </Map>
      <SelectedPanel
        selectedFeature={selectedFeature}
        selectedPlace={selectedPlace}
        geocodeResult={geocodeResult}
      />
    </div>
  );
}
