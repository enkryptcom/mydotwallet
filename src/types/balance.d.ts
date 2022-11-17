import BigNumber from "bignumber.js";
import { UnbondEntry } from "./staking";

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
  unbonding: BigNumber;
  unbondingList: UnbondEntry[];
  bonded: BigNumber;
}
