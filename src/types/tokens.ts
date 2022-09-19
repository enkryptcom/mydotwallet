import { Token } from "./token";

export const dot: Token = {
  id: 1,
  name: "Polkadot",
  image: require("@/assets/pic/polkadot.token.svg"),
  symbol: "dot",
  price: 10.2,
};

export const ksm: Token = {
  id: 2,
  name: "Kusama",
  image: require("@/assets/pic/kusama.token.png"),
  symbol: "ksm",
  price: 39.1,
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
