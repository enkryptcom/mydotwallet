import { WalletItem } from "./wallet-list";

export const walletConnect: WalletItem = {
  id: 1,
  name: "Connect",
};

export const walletConnectItems: WalletItem[] = [
  {
    id: 2,
    name: "Enkrypt",
    image: require("@/assets/pic/enkrypt-logo.png"),
    extensionName: "enkrypt",
  },
  {
    id: 3,
    name: "Polkadot.js",
    image: require("@/assets/pic/polkadotjs-logo.svg"),
    extensionName: "polkadot-js",
  },
  {
    id: 4,
    name: "Talisman",
    image: require("@/assets/pic/talisman-logo.svg"),
    extensionName: "talisman",
  },
  {
    id: 5,
    name: "SubWallet",
    image: require("@/assets/pic/subwallet-logo.svg"),
    extensionName: "subwallet-js",
  },
  // Add new wallets here
  // {
  // },
  //
  {
    id: 1,
    name: "Disconnect",
  },
];
