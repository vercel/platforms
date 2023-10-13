import { InfuraProvider, Networkish } from "ethers";
// Connect to the network

export const getInfuraUrlFor = (network: Networkish) =>
  process.env.INFURA_KEY
    ? `https://${network}.infura.io/v3/${process.env.INFURA_KEY}`
    : undefined;

export async function getEnsName(address: string, network?: Networkish) {
  const n = network || "mainnet";
  let provider = new InfuraProvider(network, process.env.INFURA_KEY);
  return await provider.lookupAddress(address);
}
