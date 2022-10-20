import { nativeToken } from "@/stores";
import { NominatedByMap, Validator } from "@/types/staking";
import { ApiPromise } from "@polkadot/api";
import {
  DeriveStakingElected,
  DeriveStakingWaiting,
} from "@polkadot/api-derive/types";
import { Option, StorageKey } from "@polkadot/types";
import { IndividualExposure, Nominations } from "@polkadot/types/interfaces";
import { BN, BN_ZERO } from "@polkadot/util";
import { fromBase } from "./units";

export const getLastEraReward = async (api: ApiPromise): Promise<number> => {
  const currentEra = await api.query.staking.currentEra();
  const lastEra = Number(currentEra.toString()) - 1;

  const lastRewardQuery = await api.query.staking.erasValidatorReward(lastEra);
  const lastStakeTotalQuery = await api.query.staking.erasTotalStake(lastEra);
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

export const extractNominatorList = async (api: ApiPromise) => {
  const result: [StorageKey, Option<Nominations>][] =
    await api.query.staking.nominators.entries();

  const mapped: NominatedByMap = {};

  for (let i = 0; i < result.length; i++) {
    const [key, optNoms] = result[i];

    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      for (let j = 0; j < targets.length; j++) {
        const validatorId = targets[j].toString();

        if (!mapped[validatorId]) {
          mapped[validatorId] = [];
        }

        mapped[validatorId].push({
          index: j + 1,
          nominatorId,
          submittedIn: submittedIn.toNumber(),
        });
      }
    }
  }

  return mapped;
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
  const electedInfo: DeriveStakingElected =
    await api.derive.staking.electedInfo({
      withController: true,
      withExposure: true,
      withPrefs: true,
    });
  const waitingInfo: DeriveStakingWaiting =
    await api.derive.staking.waitingInfo({
      withController: true,
      withPrefs: true,
    });

  const nominatorList = await extractNominatorList(api);
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
