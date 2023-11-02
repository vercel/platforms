// @ts-nocheck
"use client";
import React, { useEffect, useMemo, useRef } from "react";
// import { Canvas, useFrame, ThreeElements } from "@react-three/fiber"
import ReactGlobe from "react-globe.gl";
import countries from "./countries.geo.json";
import cities, { CityData } from "./cities";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Scene } from "three";

function area(poly) {
  var s = 0.0;
  var ring = poly.coordinates[0];
  for (let i = 0; i < ring.length - 1; i++) {
    s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return 0.5 * s;
}

function centroid(poly) {
  var c = [0, 0];
  var ring = poly.coordinates[0];
  for (let i = 0; i < ring.length - 1; i++) {
    c[0] +=
      (ring[i][0] + ring[i + 1][0]) *
      (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
    c[1] +=
      (ring[i][1] + ring[i + 1][1]) *
      (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
  }
  var a = area(poly);
  c[0] /= a * 6;
  c[1] /= a * 6;
  return c;
}

const warmGray = {
  50: "#fbfaf8",
  100: "#F8F6F2",
  200: "#F2EDE5",
  300: "#ECE5D8",
  400: "#9C9485",
  600: "#706A5F",
  700: "#59544C",
  800: "#433F39",
  900: "#2c2a26",
  950: "#1A1916",
};

const World = ({
  size,
  backgroundColor = warmGray[800] + "00",
}: {
  size?: number;
  backgroundColor?: string;
}) => {
  const globeRef = useRef();

  useEffect(() => {
    // @ts-ignore
    let globeControls = globeRef?.current.controls() as OrbitControls;
    globeControls.autoRotate = true;
    globeControls.autoRotateSpeed = 0.3;
    globeControls.enableZoom = false;

    // @ts-ignore
    let scene = globeRef?.current.scene() as Scene;
    // @ts-ignore
    globeRef?.current?.pointOfView({ lat: 30, lng: 10, altitude: 2 });
  }, []);

  const arcsData = useMemo(() => {
    // Gen random data
    const N = 20;
    const arcsData = Array(N)
      .fill(null)
      .map(() => {
        // Select a random city
        const city = cities[Math.floor(Math.random() * cities.length)];

        // Select a random country
        const country =
          countries.features[
            Math.floor(Math.random() * countries.features.length)
          ];

        // Extract the centroid of the country as the start point
        const [startLng, startLat] = centroid(country.geometry);

        return {
          startLat,
          startLng,
          endLat: city.lat,
          endLng: city.lon,
          color: [
            ["#00FFEA", "#00FFEA", "#00FFEA", "#00FFEA"][
              Math.round(Math.random() * 3)
            ],
            ["#00FFEA", "#00FFEA", "#00FFEA", "#00FFEA"][
              Math.round(Math.random() * 3)
            ],
          ],
        };
      });
    return arcsData;
  }, []);

  const getAlt = (d: CityData) => d.elevation * 5e-5;

  const getTooltip = (d: CityData) => `
      <div class="bg-gray-200">
        <div><b>${d.name}</b>, ${d.country}</div>
        <div>(${d.type})</div>
        <div>Elevation: <em>${d.elevation}</em>m</div>
      </div>
    `;

  const width = size
    ? size
    : window.innerWidth < 768
    ? 900
    : window.innerWidth < 1024
    ? 1200
    : window.innerWidth * 0.6;

  const getPointColor = (d: CityData) =>
    d.upcoming ? "#00FFEA" : warmGray[200];

  const onPointClick = (city: CityData) =>
    window.open(`https://en.wikipedia.org/wiki/${city.name}`, "_blank");

  return (
    <div
      style={{
        position: 'relative',
        height: width,
        width: width,
      }}
    >
      <ReactGlobe
        height={width}
        width={width}
        ref={globeRef}
        globeImageUrl="/earth-brand-dark.png"
        bumpImageUrl="/earth-topology.png"
        waitForGlobeReady={true}
        backgroundColor={backgroundColor}
        pointsData={cities}
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.5}
        hexPolygonColor={() => warmGray[200]}
        pointLat="lat"
        pointLng="lon"
        atmosphereColor="#00FFEA"
        atmosphereAltitude={0.2}
        pointAltitude={(d) => getAlt(d as CityData)}
        pointRadius={0.4}
        pointColor={(d) => getPointColor(d as CityData)}
        pointLabel={(o) => getTooltip(o as CityData)}
        onPointClick={(point) => onPointClick(point as CityData)}
        pathsData={[]}
        labelsData={cities}
        labelLat="lat"
        labelLng="lon"
        labelAltitude={(d) => getAlt(d as CityData) + 1e-6}
        labelDotRadius={0.3}
        labelDotOrientation={() => "bottom"}
        labelColor={(d) => "#00FFEA"}
        labelText="name"
        labelSize={1.5}
        labelResolution={0}
        labelLabel={(d) => getTooltip(d as CityData)}
        onLabelClick={(label) => onPointClick(label as CityData)}
        objectRotation={{ x: 10, y: 0, z: 0 }}
        arcsData={arcsData}
        arcColor={"color"}
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 2000}
      />
      <div
        style={{
          height: (width * 3) / 5,
          width: width,
          position: "absolute",
          bottom: 0,
          background:
          "linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(44, 42, 38) 50%)",
        }}
      />
    </div>
  );
};

export default World;
