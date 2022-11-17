import { nativeToken, selectedNetwork } from "@/stores";
import {
  AuctionInfo,
  Campaign,
  Campaigns,
  ContributionInfo,
  CrowdloanInfo,
  LeasePeriod,
  ParachainInfo,
} from "@/types/crowdloan";
import { ApiPromise } from "@polkadot/api";
import {
  copyProdParasKusama,
  copyProdParasKusamaCommon,
} from "@/libs/parachains/productionRelayKusama";

import {
  copyProdParasPolkadot,
  copyProdParasPolkadotCommon,
} from "@/libs/parachains/productionRelayPolkadot";
import {
  copyTestParasWestend,
  copyTestParasWestendCommon,
} from "@/libs/parachains/testingRelayWestend";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
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
import { BN, BN_ZERO, stringToU8a, u8aConcat, u8aEq } from "@polkadot/util";
import { fromBase } from "./units";
import { Network } from "@/types/network";
import { EndpointOption } from "@polkadot/apps-config/endpoints/types";
import { chainLogosMap } from "@/libs/parachains/chainLogos";
import {
  prodParasKusama,
  prodParasKusamaCommon,
  prodParasPolkadot,
  prodParasPolkadotCommon,
  testParasWestend,
  testParasWestendCommon,
} from "@polkadot/apps-config";
import { Buffer } from "buffer";

export const CROWD_PREFIX = stringToU8a("modlpy/cfund");

export const getCrowdloanItems = async (
  api: ApiPromise
): Promise<[CrowdloanInfo[], CrowdloanInfo[]]> => {
  const bestNumber = await api.derive.chain.bestNumber();
  const { funds: campaignFunds } = await getCampaignsInfo(api, bestNumber);
  const leasePeriod = await getLeasePeriod(api, bestNumber);
  const expectedBlockTime = Number(
    api.consts?.babe?.expectedBlockTime?.toString() || 6000
  );

  return separateCampaigns(
    campaignFunds,
    bestNumber,
    expectedBlockTime,
    leasePeriod
  );
};

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

export const getCampaignsInfo = async (
  api: ApiPromise,
  bestNumber: BlockNumber
): Promise<Campaigns> => {
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
        firstSlot: info.firstPeriod.toNumber(),
        info,
        isCrowdloan: true,
        key: paraId.toString(),
        lastSlot: info.lastPeriod.toNumber(),
        paraId,
        value: Number(
          fromBase(info.raised.toString(), nativeToken.value.decimals)
        ),
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

  return createCampaigns(
    bestNumber,
    api.consts.crowdloan.minContribution as BlockNumber,
    campaigns,
    leases
  );
};

export const getSingleCampaignsInfo = async (
  api: ApiPromise,
  bestNumber: BlockNumber,
  paraId: number
): Promise<Campaigns | undefined> => {
  const optFund = await api.query.crowdloan?.funds<
    Option<PolkadotRuntimeCommonCrowdloanFundInfo>
  >(paraId);
  const unwrappedOptFunds: PolkadotRuntimeCommonCrowdloanFundInfo =
    optFund.unwrapOr(null);

  if (!unwrappedOptFunds) {
    return undefined;
  }

  const paraIdFormatted = api.createType<ParaId>("ParaId", paraId);
  const campaign: Campaign = {
    accountId: encodeAddress(
      u8aConcat(
        CROWD_PREFIX,
        paraIdFormatted.toU8a(),
        new Uint8Array(32)
      ).subarray(0, 32)
    ),
    firstSlot: unwrappedOptFunds.firstPeriod.toNumber(),
    info: unwrappedOptFunds,
    isCrowdloan: true,
    key: paraId.toString(),
    lastSlot: unwrappedOptFunds.lastPeriod.toNumber(),
    paraId: paraIdFormatted,
    value: Number(
      fromBase(unwrappedOptFunds.raised.toString(), nativeToken.value.decimals)
    ),
  };

  const optLeases = await api.query.slots.leases<
    Vec<Option<ITuple<[AccountId, BalanceOf]>>>
  >(paraId);
  const isLeaseValid =
    optLeases
      .map((o) => o.unwrapOr(null))
      .filter((v): v is ITuple<[AccountId, BalanceOf]> => !!v)
      .filter(([accountId]) =>
        u8aEq(accountId.slice(0, CROWD_PREFIX.length), CROWD_PREFIX)
      ).length !== 0;

  return createCampaigns(
    bestNumber,
    api.consts.crowdloan.minContribution as BlockNumber,
    [campaign],
    isLeaseValid ? [paraIdFormatted] : []
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

export const getLeasePeriod = async (
  api: ApiPromise,
  bestNumber: BlockNumber
) => {
  const length = api.consts.slots.leasePeriod as BlockNumber;
  const startNumber = bestNumber.sub(
    (api.consts.slots.leaseOffset as BlockNumber) || BN_ZERO
  );
  const progress = startNumber.mod(length);

  return {
    currentPeriod: startNumber.div(length).toNumber(),
    length: length.toNumber(),
    progress: progress.toNumber(),
    remainder: length.sub(progress).toNumber(),
  };
};

const separateCampaigns = (
  value: Campaign[] | null,
  bestNumber: BlockNumber,
  expectedBlockTime: number,
  leasePeriod?: LeasePeriod
): [CrowdloanInfo[], CrowdloanInfo[]] => {
  const currentPeriod = leasePeriod?.currentPeriod;
  let active: Campaign[] = [];
  let ended: Campaign[] = [];

  if (value && currentPeriod) {
    active = value.filter(
      ({ firstSlot, isCapped, isEnded, isWinner }) =>
        !(isCapped || isEnded || isWinner) && currentPeriod <= firstSlot
    );
    ended = value.filter(
      ({ firstSlot, isCapped, isEnded, isWinner }) =>
        isCapped || isEnded || isWinner || currentPeriod > firstSlot
    );
  }

  const networksMap = getNetworksMap();

  return [
    convertCampaignsToCrowdloanInfo(
      active,
      networksMap,
      bestNumber,
      expectedBlockTime,
      true
    ),
    convertCampaignsToCrowdloanInfo(
      ended,
      networksMap,
      bestNumber,
      expectedBlockTime,
      false
    ),
  ];
};

const getNetworksMap = (): Record<number, ParachainInfo> => {
  let parachains: EndpointOption[] = [];

  switch (selectedNetwork.value) {
    case Network.Polkadot:
      parachains = prodParasPolkadot.concat(
        prodParasPolkadotCommon.concat(
          copyProdParasPolkadotCommon.concat(copyProdParasPolkadot)
        )
      );
      break;
    case Network.Kusama:
      parachains = prodParasKusama.concat(
        prodParasKusamaCommon.concat(
          copyProdParasKusamaCommon.concat(copyProdParasKusama)
        )
      );
      break;
    case Network.Westend:
      parachains = testParasWestend.concat(
        testParasWestendCommon.concat(
          copyTestParasWestend.concat(copyTestParasWestendCommon)
        )
      );
      break;
    default:
      break;
  }

  const networksMap: Record<number, ParachainInfo> = {};

  for (const auxParachain of parachains) {
    if (auxParachain.paraId && auxParachain.info) {
      networksMap[auxParachain.paraId] = {
        key: auxParachain.info,
        paraId: auxParachain.paraId,
        name: auxParachain.text,
        link: auxParachain.homepage,
        image: auxParachain.info ? chainLogosMap[auxParachain.info] : undefined,
      };
    }
  }

  return networksMap;
};

const convertCampaignsToCrowdloanInfo = (
  campaigns: Campaign[],
  networksMap: Record<number, ParachainInfo>,
  bestNumber: BlockNumber,
  expectedBlockTime: number,
  isContribute: boolean
): CrowdloanInfo[] => {
  return campaigns.map((item) => {
    const raised = Number(
      fromBase(item.info.raised.toString(), nativeToken.value.decimals)
    );
    const cap = Number(
      fromBase(item.info.cap.toString(), nativeToken.value.decimals)
    );
    const remaining = Number(
      fromBase(
        item.info.cap.sub(item.info.raised).toString(),
        nativeToken.value.decimals
      )
    );

    const endBlock = item.info.end.toNumber();
    const endMillisecondsLeft =
      (endBlock - bestNumber.toNumber()) * expectedBlockTime;
    return {
      ...networksMap[item.paraId.toNumber()],
      percent: cap === 0 ? 100 : (raised * 100) / cap,
      amount: raised,
      cap,
      remaining,
      tokens: nativeToken.value.symbol.toLocaleUpperCase(),
      isContribute,
      endBlock,
      endMillisecondsLeft,
    };
  });
};

export const getSingleCrowdloanItem = async (
  api: ApiPromise,
  paraId: number
): Promise<CrowdloanInfo | undefined> => {
  const bestNumber = await api.derive.chain.bestNumber();
  const campaigns = await getSingleCampaignsInfo(api, bestNumber, paraId);
  const leasePeriod = await getLeasePeriod(api, bestNumber);
  const expectedBlockTime = Number(
    api.consts?.babe?.expectedBlockTime?.toString() || 6000
  );

  if (!campaigns?.funds?.[0]) {
    return undefined;
  }

  const result = convertCampaignsToCrowdloanInfo(
    campaigns.funds,
    getNetworksMap(),
    bestNumber,
    expectedBlockTime,
    campaigns.funds[0].isCapped ||
      campaigns.funds[0].isEnded ||
      campaigns.funds[0].isWinner ||
      leasePeriod?.currentPeriod > campaigns.funds[0].firstSlot
  );

  return result[0];
};

export const getContributions = async (
  api: ApiPromise,
  paraId: number,
  account: string
): Promise<ContributionInfo> => {
  const paraIdFormatted = api.createType<ParaId>("ParaId", paraId);

  const hexAccount = "0x" + Buffer.from(decodeAddress(account)).toString("hex");

  const [derive, myContributions] = await Promise.all([
    api.derive.crowdloan.contributions(paraIdFormatted),
    api.derive.crowdloan.ownContributions(paraIdFormatted, [hexAccount]),
  ]);

  return {
    ...derive,
    hasLoaded: true,
    account: account,
    accountHex: hexAccount,
    amount: Number(
      fromBase(
        myContributions[hexAccount]?.toString() || "0",
        nativeToken.value.decimals
      )
    ),
  };
};
