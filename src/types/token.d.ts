export interface Token {
  id: number;
  name: string;
  image: string;
  symbol: string;
  price: BigNumber;
  decimals: number;
  existentialDeposit: BigNumber;
  coingeckoID: string;
}
