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
      <stake-staked-overview
        :total="totals.totalStaked.toNumber()"
        :earnings="totals.earnings.toNumber()"
        :yield="totals.yield.toNumber()"
      />
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
import { computed, onMounted, ref, watch } from "vue";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedNetwork,
  subsquidExplorerUrl,
} from "@/stores";
import type { Option } from "@polkadot/types";
import { AccountId, StakingLedger } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";
import {
  Queried,
  StakedTotalState,
  StakerState,
  StakingAccountWithValidators,
  Validator,
  ValidatorInfo,
} from "@/types/staking";
import { fromBase } from "@/utils/units";
import {
  extractUnbondingData,
  getStakerState,
  loadValidatorDataFromList,
} from "@/utils/staking";
import { useGetNativePrice } from "@/libs/prices";
import { useGetNativeBalances } from "@/libs/balances";
import { toBN } from "web3-utils";

const router = useRouter();

const showStakeIntro = ref<boolean>(false);
const stakingAccounts = ref<StakingAccountWithValidators[]>([]);

const isDataLoading = ref<boolean>(false);

onMounted(async () => {
  isDataLoading.value = true;
  await useGetNativeBalances();
  setBalancesOnly();
  useGetNativePrice();
  loadStakingAccounts().then((value) => (stakingAccounts.value = value));
  isDataLoading.value = false;
});

watch(
  [accounts, selectedNetwork],
  async () => {
    if (!isDataLoading.value) {
      isDataLoading.value = true;
      useGetNativePrice();
      await useGetNativeBalances();
      setBalancesOnly();
      loadStakingAccounts().then((value) => (stakingAccounts.value = value));
      isDataLoading.value = false;
    }
  },
  { deep: true }
);

const setBalancesOnly = () => {
  const result = [];
  for (const auxAccount of accounts.value) {
    if (
      nativeBalances[auxAccount.address]?.staked?.gt(0) ||
      nativeBalances[auxAccount.address]?.redeemable?.gt(0)
    ) {
      result.push({
        ...auxAccount,
        totalStaked: (
          nativeBalances[auxAccount.address]?.staked || new BigNumber(0)
        ).plus(nativeBalances[auxAccount.address]?.redeemable || 0),
        activeStaked: nativeBalances[auxAccount.address]?.staked,
        earnings: new BigNumber(0),
        withdrawable: nativeBalances[auxAccount.address]?.redeemable,
        unbonding: nativeBalances[auxAccount.address]?.unbonding,
        unbondingList: nativeBalances[auxAccount.address]?.unbondingList,
        isLoading: true,
        validators: [],
      });
    }
  }
  stakingAccounts.value = result;
};

const loadStakingAccounts = async () => {
  if (!accounts.value.length) {
    return [];
  }
  const api = await apiPromise.value;
  const addresses = accounts.value.map((item) => item.address);
  const [resultBonded, resultLedger] = await Promise.all([
    api.query.staking?.bonded.multi<Option<AccountId>>(addresses),
    api.query.staking?.ledger.multi<Option<StakingLedger>>(addresses),
  ]);
  const ownStashes: [string, boolean][] = [];

  resultBonded.forEach((value, index): void => {
    value.isSome && ownStashes.push([addresses[index], true]);
  });

  resultLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !ownStashes.some(([accountId]) => accountId === stashId) &&
        // This filters only stashes where a connected account is a controller
        addresses.includes(stashId) &&
        ownStashes.push([stashId, false]);
    }
  });

  if (!ownStashes.length) {
    showStakeIntro.value = true;
  }
  const stashIds = ownStashes.map(([stashId]) => stashId);
  const [resAccounts, resValidators] = await Promise.all([
    api.derive.staking.accounts(stashIds),
    api.query.staking.validators.multi<ValidatorInfo>(stashIds),
  ]);

  const queried = ownStashes.reduce(
    (queried: Queried, [stashId, isOwnStash], index): Queried => ({
      ...queried,
      [stashId]: [isOwnStash, resAccounts[index], resValidators[index]],
    }),
    {}
  );

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

  let validatorsAddress: string[] = stakerStates.reduce(
    (prev, current): string[] => {
      return prev.concat(current.nominating || []);
    },
    [] as string[]
  );
  validatorsAddress = [...new Set(validatorsAddress)];
  const validators = await loadValidatorDataFromList(api, validatorsAddress);

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

  const unbondProgress = await api.derive.session.progress();

  const expectedBlockTime = Number(
    api.consts?.babe?.expectedBlockTime?.toString() || 6000
  );

  const finalResult: StakingAccountWithValidators[] = [];
  for (const auxStaker of totals.foundStashes || []) {
    const [unbondList, unbondTotal] = extractUnbondingData(
      auxStaker.unlocking,
      unbondProgress,
      expectedBlockTime
    );

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
      activeStaked:
        auxStaker.stakingLedger && auxStaker.stakingLedger.active
          ? new BigNumber(
              fromBase(
                auxStaker.stakingLedger.active.unwrap().toString(),
                nativeToken.value.decimals
              )
            )
          : new BigNumber(0),
      earnings: accountRewardsMap[auxStaker.stashId] || new BigNumber(0),
      withdrawable: new BigNumber(
        fromBase(auxStaker.redeemable, nativeToken.value.decimals)
      ),
      unbonding: unbondTotal,
      unbondingList: unbondList,
      validators:
        auxStaker.nominating?.map((item) => validatorInfoMap[item]) || [],
      isLoading: false,
    } as StakingAccountWithValidators);
  }

  return finalResult;
};

const getAccountsRewardsMap = async (
  accounts: string[]
): Promise<Record<string, BigNumber>> => {
  try {
    const totalRewards: string[] = [];
    for (let i = 0; i < accounts.length; i++) {
      await fetch(subsquidExplorerUrl.value, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          row: 100,
          page: 0,
          address: accounts[i],
        }),
      })
        .then((res: any) => res.json())
        .then((jsonres: any) => {
          if (jsonres && jsonres.data && jsonres.data.list) {
            let total = toBN(0);
            jsonres.data.list.forEach((item: any) => {
              total = total.add(toBN(item.amount));
            });
            totalRewards.push(total.toString());
          }
          totalRewards.push("0");
        })
        .catch(() => totalRewards.push("0"));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const resultMap: Record<string, BigNumber> = {};
    accounts.forEach((acc, idx) => {
      resultMap[acc] = new BigNumber(
        fromBase(totalRewards[idx], nativeToken.value.decimals)
      );
    });
    return resultMap;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const totals = computed(() => {
  const finalResult = {
    totalStaked: new BigNumber(0),
    earnings: new BigNumber(0),
    withdrawable: new BigNumber(0),
    unbonding: new BigNumber(0),
    yield: new BigNumber(0),
  };

  for (const item of stakingAccounts.value) {
    finalResult.totalStaked = finalResult.totalStaked.plus(item.totalStaked);
    finalResult.earnings = finalResult.earnings.plus(item.earnings);
    finalResult.withdrawable = finalResult.withdrawable.plus(item.withdrawable);
    finalResult.unbonding = finalResult.unbonding.plus(item.unbonding);
  }

  finalResult.yield = finalResult.earnings
    .div(finalResult.totalStaked)
    .times(100);

  finalResult.yield = finalResult.yield.isNaN()
    ? new BigNumber(0)
    : finalResult.yield;

  return finalResult;
});

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
