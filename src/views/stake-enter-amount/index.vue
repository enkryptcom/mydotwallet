<template>
  <white-wrapper class="stake-enter-amount__wrap">
    <div class="stake-enter-amount__header">
      <back-button :action="back" />
      <h1 class="stake-enter-amount__title">Enter staking amount</h1>
    </div>

    <div class="stake-enter-amount__info">
      <p>You keep ownership of bonded assets.</p>
      <p>
        Staking rewards start to show in 2-3 days after confirming a
        transaction.
      </p>
      <p>
        Assets will be available again 28 days after you decided to withdraw
        them.
      </p>
    </div>
    <select-account-input
      :account="fromAccount"
      :accounts="accounts"
      :amount="availableBalance"
      :is-amount="true"
      title="From"
      @update:select="selectAccount"
    />

    <amount-input
      :has-enough-balance="hasEnough"
      :token="nativeToken"
      :value="String(amount)"
      :max-value="nativeBalances[fromAccount?.address]?.available"
      @update:amount="inputAmount"
    />

    <buttons-block :is-space="true">
      <div class="stake-enter-amount__lock">
        <Switch :is-checked="isCompounding" @update:check="updateCompounding" />
        <p>Lock rewards for compounding?</p>
        <info-tooltip :text="rewardsInfo" />
      </div>
      <base-button
        title="Continue"
        :action="nextAction"
        :send="true"
        :disabled="!isValid"
      />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import Switch from "@/components/switch/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import { Account } from "@/types/account";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedNetwork,
  stakingWizardOptions,
} from "@/stores";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { isValidDecimals, toBase } from "@/utils/units";
import { toBN } from "web3-utils";
import { stakeExtrinsic } from "@/utils/extrinsic";
import { GasFeeInfo } from "@/types/transaction";
import { getGasFeeInfo } from "@/utils/fee";

const router = useRouter();

const rewardsInfo =
  "If you choose not to lock your rewards, then your newly minted rewards will be transferrable by default. However, this would mean lower earnings over longer period of time.";

const fromAccount = ref<Account>(accounts.value[0]);
const amount = ref<number>(0);
const fee = ref<GasFeeInfo>();
const isCompounding = ref<boolean>(true);
const hasEnough = ref(true);

onMounted(() => {
  useGetNativeBalances();
  useGetNativePrice();
  loadPreviousStakingOptions();
});

watch(selectedNetwork, () => {
  useGetNativeBalances();
  useGetNativePrice();
  loadPreviousStakingOptions();
});

watch(
  [amount, nativeBalances, fromAccount],
  async () => {
    if (!amount.value || !fromAccount.value?.address) {
      return;
    }

    if (!isValidDecimals(amount.value.toString(), nativeToken.value.decimals)) {
      hasEnough.value = false;
      return;
    }

    const api = await apiPromise.value;

    const rawAmount = toBN(
      toBase(amount.value?.toString() || "0", nativeToken.value.decimals)
    );

    const rawBalance = toBN(
      toBase(
        nativeBalances[fromAccount.value.address]?.available.toString() || "0",
        nativeToken.value.decimals
      )
    );

    if (rawAmount.gt(rawBalance)) {
      hasEnough.value = false;
    } else {
      hasEnough.value = true;
    }

    const tx = await stakeExtrinsic(
      api,
      fromAccount.value.address,
      rawAmount.toString(),
      [fromAccount.value.address],
      isCompounding.value
    );

    fee.value = await getGasFeeInfo(tx, fromAccount.value.address);
  },
  { deep: true }
);

const loadPreviousStakingOptions = () => {
  isCompounding.value = stakingWizardOptions.value.isCompounding;
  if (stakingWizardOptions.value.amount) {
    amount.value = stakingWizardOptions.value.amount;
  }
};

const isValid = computed<boolean>(() => {
  return !!fromAccount.value && Number(amount.value) > 0 && hasEnough.value;
});

const availableBalance = computed(() => {
  if (!nativeBalances || !fromAccount.value) {
    return 0;
  }

  return nativeBalances[fromAccount.value.address]?.available.toNumber() || 0;
});

const nextAction = () => {
  stakingWizardOptions.value = {
    ...stakingWizardOptions.value,
    fromAccount: fromAccount.value,
    isCompounding: isCompounding.value,
    amount: amount.value,
  };
  router.push({
    name: "stake-nominate",
  });
};

const back = () => {
  router.go(-1);
};

const updateCompounding = (newValue: boolean) => {
  isCompounding.value = newValue;
};

const selectAccount = (account: Account) => {
  fromAccount.value = account;
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-enter-amount {
  &__wrap {
    padding: 16px 32px;
  }
  &__header {
    position: relative;
  }
  &__title {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding-left: 60px;
    .sizing();
  }
  &__info {
    padding: 16px;
    width: 100%;
    .sizing();
    background: @gray002;
    border-radius: 16px;
    margin: 0 0 16px 0;

    p {
      .body1__Regular();
      color: @primaryLabel;
      margin: 0 0 12px 0;
      position: relative;
      padding-left: 44px;

      &:before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: @accent;
        left: 7px;
        top: 50%;
        margin-top: -4px;
        border-radius: 100%;
      }

      &:last-child {
        margin: 0;
      }
    }
  }
  &__lock {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    p {
      .body2__Regular();
      margin: 0 8px;
      color: @primaryLabel;
    }
  }
}
</style>
