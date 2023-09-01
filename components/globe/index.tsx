"use client"
import React, { useEffect, useRef } from "react"
// import { Canvas, useFrame, ThreeElements } from "@react-three/fiber"
import ReactGlobe from "react-globe.gl"
import countries from "./countries.geo.json"
import cities, { CityData } from "./cities";

const World = () => {
    const globeRef = useRef()

    useEffect(() => {
        // @ts-ignore
        let globeControls = globeRef?.current.controls()
        globeControls.autoRotate = true
        globeControls.autoRotateSpeed = 0.3
        // @ts-ignore
        globeRef?.current?.pointOfView({ lat: 30, lng: 10, altitude: 2 })
    }, [])

    const getAlt = (d: CityData) => d.elevation * 5e-5

    const getTooltip = (d: CityData) => `
      <div class="bg-brand-gray200">
        <div><b>${d.name}</b>, ${d.country}</div>
        <div>(${d.type})</div>
        <div>Elevation: <em>${d.elevation}</em>m</div>
      </div>
    `

    // primary: "#00FFEA",
    //                 secondary: "#FF8000",
    //                 magenta: "#FF0062",
    //                 lightBase: "#fbfaf8",
    //                 darkBase: "#2C2A26",
    //                 gray50: "#fbfaf8",
    //                 gray100: "#F8F6F2",
    //                 gray200: "#F2EDE5",
    //                 gray300: "#ECE5D8",
    //                 gray400: "#9C9485",
    //                 gray600: "#706A5F",
    //                 gray700: "#59544C",
    //                 gray800: "#433F39",
    //                 gray900: "#2C2A26",
    //                 gray950: "#1A1916",

    const width =
        window.innerWidth < 768
            ? window.innerWidth
            : window.innerWidth < 1024
            ? window.innerWidth / 2
            : window.innerWidth / 2

    const getPointColor = (d: CityData) => (d.upcoming ? "#00FFEA" : "#F8F6F2")

    const onPointClick = (city: CityData) => window.open(`https://en.wikipedia.org/wiki/${city.name}`, "_blank")

    return (
        <ReactGlobe
            height={width}
            width={width}
            ref={globeRef}
            globeImageUrl="/earth-dark.jpg"
            bumpImageUrl="/earth-topology.png"
            waitForGlobeReady={true}
            backgroundColor="#1A1916"
            pointsData={cities}
            hexPolygonsData={countries.features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.7}
            hexPolygonColor={() => "#ECE5D8"}
            pointLat="lat"
            pointLng="lon"
            atmosphereColor="#00FFEA"
            atmosphereAltitude={0.1}
            pointAltitude={(d) => getAlt(d as CityData)}
            pointRadius={0.15}
            pointColor={(d) => getPointColor(d as CityData)}
            pointLabel={(o) => getTooltip(o as CityData)}
            onPointClick={(point) => onPointClick(point as CityData)}
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
        />
    )
}

export default World
