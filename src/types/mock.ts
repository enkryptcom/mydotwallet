import { SelectItem, NetworkSelectItem } from "@/types/select-list";
import { Account } from "@/types/account";
import { Network } from "@/types/network";

export const selectConnect: SelectItem = {
  id: 1,
  name: "Connected",
  image: require("@/assets/pic/app-pic.png"),
};

export const selectConnectItems: SelectItem[] = [
  {
    id: 1,
    name: "Connected",
    image: require("@/assets/pic/app-pic.png"),
  },
  {
    id: 2,
    name: "Disconnect",
  },
];

export const selectNetwork: NetworkSelectItem = {
  id: Network.Polkadot,
  name: "Polkadot",
  image: require("@/assets/pic/polkadot.network.png"),
};

export const selectNetworkItems: NetworkSelectItem[] = [
  {
    id: Network.Polkadot,
    name: "Polkadot",
    image: require("@/assets/pic/polkadot.network.png"),
  },
  {
    id: Network.Kusama,
    name: "Kusama",
    image: require("@/assets/pic/kusama.network.png"),
  },
];

export const accounts: Account[] = [
  {
    id: 1,
    name: "Account #1",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: false,
  },
  {
    id: 2,
    name: "Main account",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    isLedger: true,
  },
  {
    id: 3,
    name: "My account nickname",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    isLedger: true,
  },
];

export const recent: Account[] = [
  {
    id: 1,
    name: "Alex",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: false,
  },
  {
    id: 2,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: true,
  },
  {
    id: 3,
    name: "Ledger",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    isLedger: true,
  },
  {
    id: 4,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: true,
  },
  {
    id: 5,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    isLedger: true,
  },
];
