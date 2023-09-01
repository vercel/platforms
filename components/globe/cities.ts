export interface CityData {
    name: string
    country: string
    type: string
    lat: number
    lon: number
    elevation: number
    upcoming: boolean
}

const cityData: CityData[] = [
    {
        name: "Vitalia",
        country: "Honduras",
        type: "Pop-Up City",
        lat: 16.37,
        lon: -86.46,
        elevation: 3000,
        upcoming: true
    },
    {
        name: "Zuzalu",
        country: "Istanbul",
        type: "Pop-Up City",
        lat: 41.015137,
        lon: 28.97953,
        elevation: 3000,
        upcoming: true
    },
    {
        name: "Zuzalu",
        country: "Montenegro",
        type: "Pop-Up City",
        lat: 42.442574,
        lon: 19.268646,
        elevation: 3000,
        upcoming: false
    }
]

export default cityData
