export interface CityData {
  name: string;
  country: string;
  type: string;
  lat: number;
  lon: number;
  elevation: number;
  upcoming: boolean;
  link: string;
}

const cityData: CityData[] = [
  {
    name: "Vitalia",
    country: "Honduras",
    type: "Pop-Up City",
    lat: 16.37,
    lon: -86.46,
    elevation: 3000,
    upcoming: true,
    link: "https://vitalia.fora.co/",
  },
  {
    name: "Zuzalu",
    country: "Turkey",
    type: "Pop-Up City",
    lat: 41.015137,
    lon: 28.97953,
    elevation: 3000,
    upcoming: true,
    link: "https://zuzalu.city/",
  },
  {
    name: "Zuzalu",
    country: "Montenegro",
    type: "Pop-Up City",
    lat: 42.442574,
    lon: 19.268646,
    elevation: 3000,
    upcoming: false,
    link: "https://zuzalu.city/",
  },
];

export default cityData;
