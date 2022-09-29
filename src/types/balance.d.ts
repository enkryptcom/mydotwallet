import BigNumber from "bignumber.js";

export interface Balance {
  free: BigNumber;
  available: BigNumber;
  locked: BigNumber;
  reserved: BigNumber;
  vested: BigNumber;
  vestingEndBlock: number;
  vestingEndMillisecondsLeft: number;
  total: BigNumber;
  staked: BigNumber;
  redeemable: BigNumber;
  unbounding: BigNumber;
  bonded: BigNumber;
}
