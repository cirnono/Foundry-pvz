import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  anvil,
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Foundry-pvz",
  projectId: "6353277aa37f7ba7a2103cdbaca88b44",
  chains: [mainnet, polygon, optimism, arbitrum, base, anvil, sepolia],
  ssr: true,
  transports: {},
});
