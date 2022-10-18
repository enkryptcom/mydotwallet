import { Token } from "@/types/token";
import { DeriveStakingAccount } from "@polkadot/api-derive/types";
import { Exposure, RewardDestination, StakingLedger, ValidatorPrefs } from "@polkadot/types/interfaces";
import { Codec, ITuple } from "@polkadot/types/types";
import BigNumber from "bignumber.js";
import { Account } from "./account";
import { BaseSelectItem } from "./base-select";

export interface Validator {
  id?: number;
  name?: string;
  image?: string;
  address: string;
  nominators: number;
  commission: number;
  total: number;
  bonded?: number;
  returns?: number;
  token: Token;
  isActive?: boolean;
  isBlocking?: boolean;
  isElected?: boolean;
  isNominating?: boolean;
  isHighRisk?: boolean;
  isOversubscribed?: boolean;
}

export interface NominatedBy {
  index: number;
  nominatorId: string;
  submittedIn: number;
}

export type NominatedByMap = Record<string, NominatedBy[]>;

export interface StakingOptions {
  isCompounding: boolean;
  amount?: number;
  fromAccount?: Account;
  period: number;
  validators?: Validator[];
}

export const periodOptions: BaseSelectItem[] = [
  {
    id: 0,
    name: "for 12 months",
  },
  {
    id: 1,
    name: "for 6 months",
  },
  {
    id: 2,
    name: "for 3 months",
  },
  {
    id: 3,
    name: "for 1 month",
  },
];

export const periodToNumberOfDays = (id: number) => {
  const mapping: Record<number, number> = {
    0: 365,
    1: 365 / 2,
    2: 365 / 4,
    3: 365 / 12,
  };
  return mapping[id] || 365;
};

export type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;
export type Queried = Record<
  string,
  [boolean, DeriveStakingAccount, ValidatorInfo]
>;

export interface StakerState {
  controllerId: string | null;
  destination?: RewardDestination;
  exposure?: Exposure;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isOwnStash: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominating?: string[];
  sessionIds: string[];
  stakingLedger?: StakingLedger;
  stashId: string;
  validatorPrefs?: ValidatorPrefs;
};

export interface StakedTotalState {
  bondedNoms?: BigNumber;
  bondedNone?: BigNumber;
  bondedTotal?: BigNumber;
  bondedVals?: BigNumber;
  foundStashes?: StakerState[];
}
