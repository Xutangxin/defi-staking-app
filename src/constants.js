import { getAddress } from "viem";

export const projectId = "1306cedcc99db7786b11146cf8efbc32"; // WalletConnect项目ID

export const apiKey = "foZ6Vf_hw3Xp05U7-RRBJ";

export const USDC_ADDRESS = "0x1ad78988999926BfDB9ed5c845f7A9aDCE45AaC1"; // Sepolia USDC
export const POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Aave v3 Pool

export const usdcContract = getAddress(USDC_ADDRESS);
export const poolContract = getAddress(POOL_ADDRESS);
