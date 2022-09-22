import { SelectItem } from "@/types/select-list";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { Validator } from "@/types/validator";

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
    image: require("@/assets/pic/app-pic.png"),
  },
];

export const selectNetwork: SelectItem = {
  id: 1,
  name: "Polkadot",
  image: require("@/assets/pic/polkadot.network.png"),
};

export const selectNetworkItems: SelectItem[] = [
  {
    id: 1,
    name: "Polkadot",
    image: require("@/assets/pic/polkadot.network.png"),
  },
  {
    id: 2,
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
    balance: 0,
    isLedger: false,
  },
  {
    id: 2,
    name: "Main account",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    balance: 1565.478,
    isLedger: true,
  },
  {
    id: 3,
    name: "My account nickname",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    balance: 10,
    isLedger: true,
  },
];

export const recent: Account[] = [
  {
    id: 1,
    name: "Alex",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    balance: 0,
    isLedger: false,
  },
  {
    id: 2,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    balance: 0,
    isLedger: true,
  },
  {
    id: 3,
    name: "Ledger",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    balance: 10,
    isLedger: true,
  },
  {
    id: 4,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    balance: 0,
    isLedger: true,
  },
  {
    id: 5,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    balance: 10,
    isLedger: true,
  },
];

export const dot: Token = {
  id: 1,
  name: "Polkadot",
  image: require("@/assets/pic/polkadot.token.svg"),
  symbol: "dot",
  price: 10.2,
};

export const validators: Validator[] = [
  {
    id: 1,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 0,
    total: 2099089,
    returns: 999999999.08,
    token: dot,
    isHightRisk: true,
    isOversubscribed: false,
  },
  {
    id: 2,
    name: "P2P.ORG/10",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 3,
    total: 2099089,
    returns: 139.08,
    token: dot,
    isHightRisk: false,
    isOversubscribed: false,
  },
  {
    id: 3,
    name: "Blockdaemon/5",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 289,
    comission: 5,
    total: 2099089,
    returns: 127.33,
    token: dot,
    isHightRisk: false,
    isOversubscribed: true,
  },
  {
    id: 4,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 0,
    total: 2099089,
    returns: 999999999.08,
    token: dot,
    isHightRisk: true,
    isOversubscribed: false,
  },
  {
    id: 5,
    name: "P2P.ORG/10",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 3,
    total: 2099089,
    returns: 139.08,
    token: dot,
    isHightRisk: false,
    isOversubscribed: false,
  },
  {
    id: 6,
    name: "Blockdaemon/5",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 289,
    comission: 5,
    total: 2099089,
    returns: 127.33,
    token: dot,
    isHightRisk: false,
    isOversubscribed: true,
  },
  {
    id: 7,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 0,
    total: 2099089,
    returns: 999999999.08,
    token: dot,
    isHightRisk: true,
    isOversubscribed: false,
  },
  {
    id: 8,
    name: "P2P.ORG/10",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 3,
    total: 2099089,
    returns: 139.08,
    token: dot,
    isHightRisk: false,
    isOversubscribed: false,
  },
  {
    id: 9,
    name: "Blockdaemon/5",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 289,
    comission: 5,
    total: 2099089,
    returns: 127.33,
    token: dot,
    isHightRisk: false,
    isOversubscribed: true,
  },
  {
    id: 10,
    name: "P2P.ORG/10",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    nominators: 36,
    comission: 3,
    total: 2099089,
    returns: 139.08,
    token: dot,
    isHightRisk: false,
    isOversubscribed: false,
  },
];
