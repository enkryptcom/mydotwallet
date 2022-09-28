import { Token } from "./token";

export const dot: Token = {
  id: 1,
  name: "Polkadot",
  image: require("@/assets/pic/polkadot.token.svg"),
  symbol: "dot",
  price: 10.2,
  decimals: 10,
  existentialDeposit: 1,
  coingeckoID: "polkadot",
};

export const ksm: Token = {
  id: 2,
  name: "Kusama",
  image: require("@/assets/pic/kusama.token.png"),
  symbol: "ksm",
  price: 39.1,
  decimals: 12,
  existentialDeposit: 0.0000333333,
  coingeckoID: "kusama",
};

export const getToken = (nameOrSymbol: string) => {
  const allTokens = [dot, ksm];
  const lowercaseValue = nameOrSymbol.toLowerCase();

  for (const auxToken of allTokens) {
    if (
      auxToken.name.toLowerCase() === lowercaseValue ||
      auxToken.symbol.toLowerCase() === lowercaseValue
    ) {
      return auxToken;
    }
  }
};
