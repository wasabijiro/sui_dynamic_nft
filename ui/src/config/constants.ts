// import { Connection } from "@mysten/sui.js";

export const SUI_PACKAGE = process.env.NEXT_PUBLIC_DAPP_PACKAGE!;
export const SUI_MODULE = process.env.NEXT_PUBLIC_DAPP_MODULE!;
export const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK!;
export const MODULE_URL = `https://explorer.sui.io/object/${SUI_PACKAGE}?network=${NETWORK}`;

// export const MAINNET_RPC_API_URL = 'https://fullnode.mainnet.sui.io:443';
export const TESTNET_RPC_API_URL = "https://fullnode.testnet.sui.io:443";
// export const DEVNET_RPC_API_URL = 'https://fullnode.devnet.sui.io:443';

export const NFT_PACKAGE_ID =
  "0xf4df8657a4a7c9af7e5e66f4fbc25254dcddc5ef2a1ee7e63b1211f756cba778";

// export const CONNECTION = new Connection({
//   fullnode: "https://fullnode.testnet.sui.io",
//   faucet: "https://faucet.testnet.sui.io/gas",
// });
