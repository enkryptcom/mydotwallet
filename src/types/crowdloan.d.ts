import number from "number.js";
import type { PolkadotRuntimeCommonCrowdloanFundInfo } from "@polkadot/types/lookup";

export interface CrowdloanInfo extends ParachainInfo {
  percent: number;
  amount: number;
  cap: number;
  contributions: number;
  tokens: string;
  isContribute: boolean;
}

export interface ParachainInfo {
  key: string;
  paraId: number;
  name: string;
  link?: string;
  image?: string;
}

export interface EndpointOption {
  dnslink?: string;
  genesisHash?: string;
  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  linked?: EndpointOption[];
  info?: string;
  paraId?: number;
  providers: Record<string, string>;
  summary?: string;
  teleport?: number[];
  text: string;
}

export interface AuctionInfo {
  endBlock?: number;
  leasePeriod?: number;
  numAuctions: number;
}

export interface Campaigns {
  activeCap: number;
  activeRaised: number;
  funds: Campaign[] | null;
  totalCap: number;
  totalRaised: number;
}

export interface Campaign extends WinnerData {
  info: PolkadotRuntimeCommonCrowdloanFundInfo;
  isCapped?: boolean;
  isEnded?: boolean;
  isWinner?: boolean;
}

export interface WinnerData {
  accountId: string;
  firstSlot: number;
  isCrowdloan: boolean;
  key: string;
  lastSlot: number;
  paraId: ParaId;
  value: number;
}

export interface Winning {
  blockNumber: number;
  blockOffset: number;
  total: number;
  winners: WinnerData[];
}

export interface LeasePeriod {
  currentPeriod: number;
  length: number;
  progress: number;
  remainder: number;
}
