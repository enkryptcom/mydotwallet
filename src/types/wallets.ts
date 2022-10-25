import { WalletItem } from "./wallet-list";

export const walletConnect: WalletItem = {
  id: 1,
  name: "Connect",
  image: require("@/assets/pic/turn-on.svg"),
};

export const walletDisconnect: WalletItem = {
  id: 1,
  name: "Disconnect",
  image: require("@/assets/pic/turn-on.svg"),
};

export const walletGetEnkrypt: WalletItem = {
  id: 2,
  name: "Enkrypt",
  image: require("@/assets/pic/enkrypt-logo.png"),
};

export const walletConnectItems: WalletItem[] = [
  {
    id: 3,
    name: "Enkrypt",
    image: require("@/assets/pic/enkrypt-logo.png"),
    extensionName: "enkrypt",
  },
  {
    id: 4,
    name: "Polkadot.js",
    image: require("@/assets/pic/polkadotjs-logo.svg"),
    extensionName: "polkadot-js",
  },
  {
    id: 5,
    name: "Talisman",
    image: require("@/assets/pic/talisman-logo.svg"),
    extensionName: "talisman",
  },
  {
    id: 6,
    name: "SubWallet",
    image: require("@/assets/pic/subwallet-logo.svg"),
    extensionName: "subwallet-js",
  },
  // Add new wallets here
  // {
  // },
  //
  walletDisconnect,
];
