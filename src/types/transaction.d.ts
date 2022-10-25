import BigNumber from "bignumber.js";

export interface GasFeeInfo {
  nativeValue: BigNumber;
  fiatValue: BigNumber;
  nativeSymbol: string;
  fiatSymbol: string;
}
