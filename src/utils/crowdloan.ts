import { nativeToken } from "@/stores";
import { AuctionInfo, Campaign, Campaigns } from "@/types/crowdloan";
import { ApiPromise } from "@polkadot/api";
import { encodeAddress } from "@polkadot/keyring";
import { Option, StorageKey, Vec } from "@polkadot/types";
import {
  AccountId,
  AuctionIndex,
  BalanceOf,
  BlockNumber,
  EventRecord,
  LeasePeriodOf,
  ParaId,
} from "@polkadot/types/interfaces";
import type { PolkadotRuntimeCommonCrowdloanFundInfo } from "@polkadot/types/lookup";
import { ITuple } from "@polkadot/types/types";
import { BN, stringToU8a, u8aConcat, u8aEq } from "@polkadot/util";
import { fromBase } from "./units";

export const CROWD_PREFIX = stringToU8a("modlpy/cfund");

export const getAuctionInfo = async (api: ApiPromise): Promise<AuctionInfo> => {
  const [numAuctions, optInfo]: [
    AuctionIndex,
    Option<ITuple<[LeasePeriodOf, BlockNumber]>>
  ] = await api.queryMulti([
    api.query.auctions.auctionCounter,
    api.query.auctions.auctionInfo,
  ]);

  const [leasePeriod, endBlock] = optInfo.unwrapOr([undefined, undefined]);

  return {
    endBlock: endBlock?.toNumber(),
    leasePeriod: leasePeriod?.toNumber(),
    numAuctions: numAuctions.toNumber(),
  };
};

export const getCampaignsInfo = async (api: ApiPromise): Promise<Campaigns> => {
  const bestNumber = await api.derive.chain.bestNumber();
  const eventRecords = await api.query.system.events<Vec<EventRecord>>();
  const blockHash = eventRecords.createdAtHash?.toHex() || "";
  const funds: StorageKey<[ParaId]>[] = await (blockHash
    ? api.query.crowdloan.funds.keysAt(blockHash)
    : api.query.crowdloan.funds.keys());
  const paraIds = funds.map(({ args: [paraId] }) => paraId);
  const optFunds: Option<PolkadotRuntimeCommonCrowdloanFundInfo>[] =
    await api.query.crowdloan?.funds.multi(paraIds);
  const campaigns: Campaign[] = paraIds
    .map(
      (paraId, i): [ParaId, PolkadotRuntimeCommonCrowdloanFundInfo | null] => [
        paraId,
        optFunds[i].unwrapOr(null),
      ]
    )
    .filter(
      (v): v is [ParaId, PolkadotRuntimeCommonCrowdloanFundInfo] => !!v[1]
    )
    .map(
      ([paraId, info]): Campaign => ({
        accountId: encodeAddress(
          u8aConcat(CROWD_PREFIX, paraId.toU8a(), new Uint8Array(32)).subarray(
            0,
            32
          )
        ),
        firstSlot: info.firstPeriod,
        info,
        isCrowdloan: true,
        key: paraId.toString(),
        lastSlot: info.lastPeriod,
        paraId,
        value: info.raised,
      })
    )
    .sort(
      (a, b) =>
        a.info.end.cmp(b.info.end) ||
        a.info.firstPeriod.cmp(b.info.firstPeriod) ||
        a.info.lastPeriod.cmp(b.info.lastPeriod) ||
        a.paraId.cmp(b.paraId)
    );

  const optLeases: Vec<Option<ITuple<[AccountId, BalanceOf]>>>[] =
    await api.query.slots.leases.multi(paraIds);
  const leases: ParaId[] = paraIds.filter(
    (_, i) =>
      optLeases[i]
        .map((o) => o.unwrapOr(null))
        .filter((v): v is ITuple<[AccountId, BalanceOf]> => !!v)
        .filter(([accountId]) =>
          u8aEq(accountId.slice(0, CROWD_PREFIX.length), CROWD_PREFIX)
        ).length !== 0
  );

  console.log(
    JSON.stringify(
      createCampaigns(
        bestNumber,
        api.consts.crowdloan.minContribution as BlockNumber,
        campaigns,
        leases
      )
    )
  );

  return createCampaigns(
    bestNumber,
    api.consts.crowdloan.minContribution as BlockNumber,
    campaigns,
    leases
  );
};

const createCampaigns = (
  bestNumber: BlockNumber,
  minContribution: BN,
  funds: Campaign[],
  leased: ParaId[]
): Campaigns => {
  const [activeRaised, activeCap, totalRaised, totalCap] = funds.reduce(
    ([ar, ac, tr, tc], { info: { cap, end, raised }, isWinner }) => [
      bestNumber.gt(end) || isWinner ? ar : ar.iadd(raised),
      bestNumber.gt(end) || isWinner ? ac : ac.iadd(cap),
      tr.iadd(raised),
      tc.iadd(cap),
    ],
    [new BN(0), new BN(0), new BN(0), new BN(0)]
  );

  return {
    activeCap: Number(
      fromBase(activeCap.toString(), nativeToken.value.decimals)
    ),
    activeRaised: Number(
      fromBase(activeRaised.toString(), nativeToken.value.decimals)
    ),
    funds: funds
      .map((c) => updateFund(bestNumber, minContribution, c, leased))
      .sort(sortCampaigns),
    totalCap: Number(fromBase(totalCap.toString(), nativeToken.value.decimals)),
    totalRaised: Number(
      fromBase(totalRaised.toString(), nativeToken.value.decimals)
    ),
  };
};

const updateFund = (
  bestNumber: BN,
  minContribution: BN,
  data: Campaign,
  leased: ParaId[]
): Campaign => {
  data.isCapped = data.info.cap.sub(data.info.raised).lt(minContribution);
  data.isEnded = bestNumber.gt(data.info.end);
  data.isWinner = leased.some((l) => l.eq(data.paraId));

  return data;
};

const sortCampaigns = (a: Campaign, b: Campaign): number => {
  return a.isWinner !== b.isWinner
    ? a.isWinner
      ? -1
      : 1
    : a.isCapped !== b.isCapped
    ? a.isCapped
      ? -1
      : 1
    : a.isEnded !== b.isEnded
    ? a.isEnded
      ? 1
      : -1
    : 0;
};
