<template>
  <stake-intro v-if="showStakeIntro" />
  <white-wrapper
    v-else
    class="stake__wrap"
    :style="{
      marginTop: '32px',
    }"
  >
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--staked">
      <stake-staked-overview :totat="1000" :overall="1.473" :yield="14.46" />
      <base-button title="Stake more" :action="stakeMoreAction" />
    </div>

    <div class="stake__staked-list">
      <stake-staked-account
        v-for="(item, index) in stakingAccounts"
        :key="index"
        :account="item"
      />
    </div>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import StakeStakedOverview from "./components/stake-staked-overview.vue";
import StakeStakedAccount from "./components/stake-staked-account.vue";
import StakeIntro from "./components/stake-intro.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import {
  accounts,
  apiPromise,
  nativeToken,
  subsquidExplorerUrl,
} from "@/stores";
import type { Option } from "@polkadot/types";
import { AccountId, StakingLedger } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";
import { DeriveStakingAccount } from "@polkadot/api-derive/types";
import {
  Queried,
  StakedTotalState,
  StakerState,
  StakingAccountWithValidators,
  Validator,
  ValidatorInfo,
} from "@/types/staking";
import { u8aConcat, u8aToHex } from "@polkadot/util";
import { fromBase } from "@/utils/units";
import { loadValidatorData } from "@/utils/staking";
import { gql, request } from "graphql-request";

const router = useRouter();

const showStakeIntro = ref<boolean>(false);
const stakingAccounts = ref<Array<StakingAccountWithValidators>>([]);

onMounted(async () => {
  stakingAccounts.value = await loadStakingAccounts();
});

const loadStakingAccounts = async () => {
  if (!accounts.value.length) {
    return [];
  }

  const api = await apiPromise.value;
  const addresses = accounts.value.map((item) => item.address);
  const resultBonded: Option<AccountId>[] =
    await api.query.staking?.bonded.multi(addresses);
  const resultLedger: Option<StakingLedger>[] =
    await api.query.staking?.ledger.multi(addresses);
  const ownStashes: [string, boolean][] = [];

  resultBonded.forEach((value, index): void => {
    value.isSome && ownStashes.push([addresses[index], true]);
  });

  resultLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !ownStashes.some(([accountId]) => accountId === stashId) &&
        ownStashes.push([stashId, false]);
    }
  });

  if (!ownStashes.length) {
    return [];
  }

  const stashIds = ownStashes.map(([stashId]) => stashId);
  const resAccounts: DeriveStakingAccount[] = await api.derive.staking.accounts(
    stashIds
  );
  const resValidators: ValidatorInfo[] =
    await api.query.staking.validators.multi(stashIds);

  const queried = ownStashes.reduce(
    (queried: Queried, [stashId, isOwnStash], index): Queried => ({
      ...queried,
      [stashId]: [isOwnStash, resAccounts[index], resValidators[index]],
    }),
    {}
  );

  if (!ownStashes.length) {
    return [];
  }

  const stakerStates = ownStashes
    .filter(([stashId]) => queried[stashId])
    .map(([stashId]) => getStakerState(stashId, addresses, queried[stashId]));

  // Staker totals
  let bondedNoms = new BigNumber(0);
  let bondedNone = new BigNumber(0);
  let bondedVals = new BigNumber(0);
  let bondedTotal = new BigNumber(0);

  stakerStates.forEach(
    ({ isStashNominating, isStashValidating, stakingLedger }): void => {
      const value =
        stakingLedger && stakingLedger.total
          ? fromBase(
              stakingLedger.total.unwrap().toString(),
              nativeToken.value.decimals
            )
          : new BigNumber(0);

      bondedTotal = bondedTotal.plus(value);

      if (isStashNominating) {
        bondedNoms = bondedNoms.plus(value);
      } else if (isStashValidating) {
        bondedVals = bondedVals.plus(value);
      } else {
        bondedNone = bondedNone.plus(value);
      }
    }
  );

  const assignValue = ({
    isStashNominating,
    isStashValidating,
  }: StakerState): number => {
    return isStashValidating ? 1 : isStashNominating ? 5 : 99;
  };

  const sortStashes = (a: StakerState, b: StakerState): number => {
    return assignValue(a) - assignValue(b);
  };

  const totals: StakedTotalState = {
    bondedNoms,
    bondedNone,
    bondedTotal,
    bondedVals,
    foundStashes: stakerStates.sort(sortStashes),
  };

  const validators = await loadValidatorData(api);

  let validatorsAddress: string[] = stakerStates.reduce(
    (prev, current): string[] => {
      return prev.concat(current.nominating || []);
    },
    [] as string[]
  );
  validatorsAddress = [...new Set(validatorsAddress)];

  const validatorInfoMap: Record<string, Validator> = {};
  for (const auxAddress of validatorsAddress) {
    for (const auxValidator of validators) {
      if (auxValidator.address.toLowerCase() === auxAddress.toLowerCase()) {
        validatorInfoMap[auxAddress] = auxValidator;
        break;
      }
    }
  }

  const accountRewardsMap = await getAccountsRewardsMap(
    accounts.value.map((item) => item.address)
  );

  const finalResult: StakingAccountWithValidators[] = [];
  for (const auxStaker of totals.foundStashes || []) {
    finalResult.push({
      ...accounts.value.find((item) => item.address === auxStaker.stashId),
      totalStaked:
        auxStaker.stakingLedger && auxStaker.stakingLedger.total
          ? new BigNumber(
              fromBase(
                auxStaker.stakingLedger.total.unwrap().toString(),
                nativeToken.value.decimals
              )
            )
          : new BigNumber(0),
      earnings: accountRewardsMap[auxStaker.stashId] || new BigNumber(0),
      withdrawable: new BigNumber(0),
      unbonding: new BigNumber(0),
      validators:
        auxStaker.nominating?.map((item) => validatorInfoMap[item]) || [],
    } as StakingAccountWithValidators);
  }
  console.log("result", finalResult);
  return finalResult;
};

const getAccountsRewardsMap = async (
  accounts: string[]
): Promise<Record<string, BigNumber>> => {
  let addressesStringQuery = accounts.reduce((prevValue, current) => {
    return `, OR: { id_eq: "${current}"${prevValue} }`;
  }, "");

  const queryResult = await request(
    subsquidExplorerUrl.value,
    gql`
      query MyQuery {
        stakers(
          where: {
            id_eq: ""
            ${addressesStringQuery}
          }
        ) {
          totalSlash
          totalReward
          stashId
          role
          payeeType
          payeeId
          id
          controllerId
          commission
          activeBond
        }
      }
    `
  );

  const resultMap: Record<string, BigNumber> = {};

  for (const auxStaker of queryResult.stakers) {
    resultMap[auxStaker.id] = new BigNumber(
      fromBase(auxStaker.totalReward, nativeToken.value.decimals)
    );
  }

  return resultMap;
};

const getStakerState = (
  stashId: string,
  allAccounts: string[],
  [isOwnStash, aaa, validateInfo]: [
    boolean,
    DeriveStakingAccount,
    ValidatorInfo
  ]
): StakerState => {
  const {
    controllerId: _controllerId,
    exposure,
    nextSessionIds: _nextSessionIds,
    nominators,
    rewardDestination,
    sessionIds: _sessionIds,
    stakingLedger,
    validatorPrefs,
  } = aaa;
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
    sessionIds: (nextSessionIds.length ? nextSessionIds : sessionIds).map(
      toIdString
    ) as string[],
    stakingLedger,
    stashId,
    validatorPrefs,
  };
};

const stakeMoreAction = () => {
  router.push({ name: "stake-enter-amount" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake {
  &__wrap {
    padding: 16px 32px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__block {
    padding: 24px 64px;
    margin: 0 0 24px 0;
    background: @gray002;
    border-radius: 16px;

    &--start {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h3 {
        text-align: center;
        .headline6__Bold();
        color: @primaryLabel;
        margin: 16px 0 2px 0;
        padding: 0 8px;
      }
    }

    &--staked {
      padding: 16px 44px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }
  }
  &__staked-list {
    padding: 8px 0 16px 0;
  }
}
</style>
