import { WalletItem } from "./wallet-list";

export enum WalletId {
  DISCONNECT = 1,
  GET_ENKRYPT,
  ENKRYPT,
  POLKADOT_JS,
  TALISMAN,
  SUBWALLET,
}

export const walletConnect: WalletItem = {
  id: WalletId.DISCONNECT,
  name: "Connect",
  image: require("@/assets/pic/turn-on.svg"),
};

export const walletDisconnect: WalletItem = {
  id: WalletId.DISCONNECT,
  name: "Disconnect",
  image: require("@/assets/pic/turn-on.svg"),
};

export const walletGetEnkrypt: WalletItem = {
  id: WalletId.GET_ENKRYPT,
  name: "Enkrypt",
  image: require("@/assets/pic/enkrypt-logo.png"),
};

export const walletConnectItems: WalletItem[] = [
  {
    id: WalletId.ENKRYPT,
    name: "Enkrypt",
    image: require("@/assets/pic/enkrypt-logo.png"),
    extensionName: "enkrypt",
  },
  {
    id: WalletId.POLKADOT_JS,
    name: "Polkadot.js",
    image: require("@/assets/pic/polkadotjs-logo.svg"),
    extensionName: "polkadot-js",
  },
  {
    id: WalletId.TALISMAN,
    name: "Talisman",
    image: require("@/assets/pic/talisman-logo.svg"),
    extensionName: "talisman",
  },
  {
    id: WalletId.SUBWALLET,
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
