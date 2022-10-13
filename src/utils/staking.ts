import { nativeToken } from "@/stores";
import { Validator } from "@/types/validator";
import { ApiPromise } from "@polkadot/api";
import {
  DeriveStakingElected,
  DeriveStakingWaiting,
} from "@polkadot/api-derive/types";
import { IndividualExposure } from "@polkadot/types/interfaces";
import { BN, BN_ZERO } from "@polkadot/util";
import { fromBase } from "./units";

const isWaitingDerive = (
  derive: DeriveStakingElected | DeriveStakingWaiting
): derive is DeriveStakingWaiting => {
  return !(derive as DeriveStakingElected).nextElected;
};

export const extractValidatorData = (
  api: ApiPromise,
  allAccounts: string[],
  derive: DeriveStakingElected | DeriveStakingWaiting
): [Validator[], Record<string, BN>] => {
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

    list[i] = {
      address: key,
      name: key,
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
      nominators: (exposure.others || []).length,
      token: nativeToken.value,
      isHighRisk: false,
      isOversubscribed: (exposure.others || []).length > maxNominators,
    };
  }

  return [list, nominators];
};
