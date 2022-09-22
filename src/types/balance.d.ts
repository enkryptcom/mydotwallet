export interface Balance {
  free: string;
  available: string;
  locked: string;
  reserved: string;
  vested: string;
  vestingEndBlock: number;
  vestingEndMillisecondsLeft: number;
  total: string;
  staked: string;
  redeemable: string;
  unbounding: string;
  bonded: string;
}
