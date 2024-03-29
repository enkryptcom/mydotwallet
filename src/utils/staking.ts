import createIcon from "@/libs/identicon/polkadot";
import { nativeToken } from "@/stores";
import {
  NominatedByMap,
  StakerState,
  UnbondEntry,
  Validator,
  ValidatorInfo,
} from "@/types/staking";
import { ApiPromise } from "@polkadot/api";
import {
  DeriveSessionProgress,
  DeriveStakingAccount,
  DeriveStakingElected,
  DeriveStakingQuery,
  DeriveStakingValidators,
  DeriveStakingWaiting,
  DeriveUnlocking,
} from "@polkadot/api-derive/types";
import { Option } from "@polkadot/types";
import {
  AccountId,
  IndividualExposure,
  StakingLedger,
} from "@polkadot/types/interfaces";
import { BN, BN_ONE, BN_ZERO, u8aConcat, u8aToHex } from "@polkadot/util";
import BigNumber from "bignumber.js";
import { fromBase } from "./units";

export const getLastEraReward = async (api: ApiPromise): Promise<number> => {
  const currentEra = await api.query.staking.currentEra();
  const lastEra = Number(currentEra.toString()) - 1;

  const [lastRewardQuery, lastStakeTotalQuery] = await api.queryMulti([
    [api.query.staking.erasValidatorReward, lastEra],
    [api.query.staking.erasTotalStake, lastEra],
  ]);
  const lastReward = Number(
    fromBase(lastRewardQuery.toString(), nativeToken.value.decimals)
  );
  const lastStakeTotal = Number(
    fromBase(lastStakeTotalQuery.toString(), nativeToken.value.decimals)
  );
  return lastReward / lastStakeTotal;
};

const isWaitingDerive = (
  derive: DeriveStakingElected | DeriveStakingWaiting
): derive is DeriveStakingWaiting => {
  return !(derive as DeriveStakingElected).nextElected;
};

export const extractNominators = (): Promise<NominatedByMap> => {
  const worker = new Worker(
    new URL("./extractNominators.worker.ts", import.meta.url)
  );
  return new Promise((resolve) => {
    worker.addEventListener("message", (message) => {
      resolve(message.data);
    });

    worker.postMessage("");
  });
};

export const extractValidatorData = async (
  api: ApiPromise,
  allAccounts: string[],
  derive: DeriveStakingElected | DeriveStakingWaiting,
  nominatorList: NominatedByMap
): Promise<[Validator[], Record<string, BN>]> => {
  const nominators: Record<string, BN> = {};
  const emptyExposure = api.createType("Exposure");
  const list = new Array<Validator>(derive.info.length);

  for (let i = 0; i < derive.info.length; i++) {
    const {
      accountId,
      exposure = emptyExposure,
      stakingLedger,
      validatorPrefs,
    } = derive.info[i];

    let [bondOwn, bondTotal] = exposure.total
      ? [exposure.own.unwrap(), exposure.total.unwrap()]
      : [BN_ZERO, BN_ZERO];

    const skipRewards = bondTotal.isZero();

    if (skipRewards) {
      bondTotal = bondOwn = stakingLedger.total?.unwrap() || BN_ZERO;
    }

    // Format total bonded to number
    const total = Number(
      fromBase(bondTotal.toString() || "0", nativeToken.value.decimals)
    );

    const key = accountId.toString();

    const maxNominators = Number(
      api.consts.staking?.maxNominatorRewardedPerValidator?.toString() || 0
    );

    const numNominators =
      (exposure.others || []).length || (nominatorList[key] || []).length;

    list[i] = {
      address: key,
      image: createIcon(key),
      bonded: bondOwn,
      total,
      commission: validatorPrefs.commission.unwrap().toNumber() / 10_000_000,
      isActive: !skipRewards,
      isBlocking: !!(validatorPrefs.blocked && validatorPrefs.blocked.isTrue),
      isElected:
        !isWaitingDerive(derive) &&
        derive.nextElected.some((e) => e.eq(accountId)),
      isNominating: (exposure.others || []).reduce(
        (isNominating: boolean, indv: IndividualExposure): boolean => {
          const nominator = indv.who.toString();

          nominators[nominator] = (nominators[nominator] || BN_ZERO).add(
            indv.value?.toBn() || BN_ZERO
          );

          return isNominating || allAccounts.includes(nominator);
        },
        allAccounts.includes(key)
      ),
      nominators: numNominators,
      token: nativeToken.value,
      isHighRisk: false,
      isOversubscribed: numNominators > maxNominators,
    };
  }

  // Get names
  const identities = await Promise.all(
    list.map((item) => api.derive.accounts.info(item.address))
  );

  identities.forEach((item, index) => {
    list[index].name = item.identity.displayParent
      ? `${item.identity.displayParent}${
          item.identity.display ? `/${item.identity.display}` : ""
        }`
      : item.identity.display;
    list[index].isHighRisk =
      item.identity.judgements.some(
        ([, judgement]) => judgement.isErroneous || judgement.isLowQuality
      ) || !list[index].name;
  });

  return [list, nominators];
};

export const loadValidatorData = async (api: ApiPromise) => {
  const [electedInfo, waitingInfo] = await Promise.all([
    api.derive.staking.electedInfo({
      withController: true,
      withExposure: true,
      withPrefs: true,
    }),
    api.derive.staking.waitingInfo({
      withController: true,
      withPrefs: true,
    }),
  ]);

  const nominatorList = await extractNominators();
  const [elected] = await extractValidatorData(
    api,
    [],
    electedInfo,
    nominatorList
  );
  const [waiting] = await extractValidatorData(
    api,
    [],
    waitingInfo,
    nominatorList
  );

  return elected.concat(waiting);
};

export const loadValidatorDataFromList = async (
  api: ApiPromise,
  addresses: string[]
) => {
  const electedPromise: Promise<DeriveStakingValidators> =
    api.derive.staking.validators();

  const validatorsPromise: Promise<DeriveStakingQuery[]> =
    api.derive.staking.queryMulti(addresses, {
      withController: true,
      withExposure: true,
      withPrefs: true,
    });
  const nominatorListPromise = extractNominators();

  const [elected, validators, nominatorList] = await Promise.all([
    electedPromise,
    validatorsPromise,
    nominatorListPromise,
  ]);

  const [result] = await extractValidatorData(
    api,
    [],
    {
      info: validators,
      nextElected: elected.nextElected,
      validators: elected.validators,
    },
    nominatorList
  );

  return result;
};

export const loadStakerState = async (api: ApiPromise, address: string) => {
  const resultBonded = await api.query.staking?.bonded<Option<AccountId>>(
    address
  );

  if (!resultBonded.isSome) {
    return undefined;
  }

  const [resAccounts, resValidator] = await Promise.all([
    api.derive.staking.account(address),
    api.query.staking.validators<ValidatorInfo>(address),
  ]);

  const stakerState = getStakerState(
    address,
    [address],
    [true, resAccounts, resValidator]
  );

  return stakerState;
};

export const getStakerState = (
  stashId: string,
  allAccounts: string[],
  [
    isOwnStash,
    {
      controllerId: _controllerId,
      exposure,
      nextSessionIds: _nextSessionIds,
      nominators,
      rewardDestination,
      sessionIds: _sessionIds,
      stakingLedger,
      validatorPrefs,
      redeemable,
      unlocking,
    },
    validateInfo,
  ]: [boolean, DeriveStakingAccount, ValidatorInfo]
): StakerState => {
  const isStashNominating = !!nominators?.length;
  const isStashValidating = !(Array.isArray(validateInfo)
    ? validateInfo[1].isEmpty
    : validateInfo.isEmpty);
  const nextSessionIds =
    _nextSessionIds instanceof Map
      ? [..._nextSessionIds.values()]
      : _nextSessionIds;
  const nextConcat = u8aConcat(...nextSessionIds.map((id) => id.toU8a()));
  const sessionIds =
    _sessionIds instanceof Map ? [..._sessionIds.values()] : _sessionIds;
  const currConcat = u8aConcat(...sessionIds.map((id) => id.toU8a()));
  const toIdString = (id?: AccountId | null): string | null => {
    return id ? id.toString() : null;
  };
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: rewardDestination,
    exposure,
    hexSessionIdNext: u8aToHex(nextConcat, 48),
    hexSessionIdQueue: u8aToHex(
      currConcat.length ? currConcat : nextConcat,
      48
    ),
    isLoading: false,
    isOwnController: allAccounts.includes(controllerId || ""),
    isOwnStash,
    isStashNominating,
    isStashValidating,
    // we assume that all ids are non-null
    nominating: nominators?.map(toIdString) as string[],
    redeemable: redeemable?.toString() || "0",
    sessionIds: (nextSessionIds.length ? nextSessionIds : sessionIds).map(
      toIdString
    ) as string[],
    stakingLedger,
    stashId,
    unlocking,
    validatorPrefs,
  };
};

export const queryHasStash = async (api: ApiPromise, address: string) => {
  const result = await api.query.staking.ledger<Option<StakingLedger>>(address);
  return result.isSome;
};

export const queryMinNominatorBond = async (api: ApiPromise) => {
  const result = await api.query.staking.minNominatorBond();
  return Number(fromBase(result.toString(), nativeToken.value.decimals));
};

export const extractUnbondingData = (
  unlockingInfo?: DeriveUnlocking[],
  progress?: DeriveSessionProgress,
  expectedBlockTime = 6000
): [UnbondEntry[], BigNumber] => {
  if (!unlockingInfo || !progress) {
    return [[], new BigNumber(0)];
  }

  const list = unlockingInfo
    .filter(
      ({ remainingEras, value }) =>
        value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO)
    )
    .map((unlock) => {
      const numBlocks = unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(progress.eraProgress)
        .toNumber();

      return {
        value: new BigNumber(
          fromBase(unlock.value.toString(), nativeToken.value.decimals)
        ),
        eras: unlock.remainingEras.toNumber(),
        blocks: numBlocks,
        timeInMs: numBlocks * expectedBlockTime,
      };
    });
  const total = list.reduce(
    (total, { value }) => total.plus(value),
    new BigNumber(0)
  );

  return [list, total];
};
