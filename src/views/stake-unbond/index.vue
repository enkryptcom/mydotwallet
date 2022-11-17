<template>
  <white-wrapper class="stake-unbound__wrap">
    <div class="stake-unbound__header">
      <back-button :action="back" />
      <h1 class="stake-unbound__title">Unbound</h1>
    </div>
    <p class="stake-unbound__description">
      Bonded assets can be unbond at any time, but unbonding takes 28 days.
    </p>
    <h4 class="stake-unbound__label">Amount to unbond</h4>

    <amount-input
      :has-enough-balance="hasEnough"
      :token="nativeToken"
      :value="String(amount)"
      :max-value="stakedBalance"
      @update:amount="inputAmount"
    />

    <!-- <div class="stake-unbound__fee">
      <p class="stake-unbound__fee-title">Network fee:</p>
      <p class="stake-unbound__fee-fiat">
        {{ $filters.currencyFormat(0.34, "USD") }}
      </p>
      <p class="stake-unbound__fee-amount">
        {{ $filters.cryptoCurrencyFormat(0.037) }} <span>dot</span>
      </p>
    </div> -->

    <fee-info :fee="fee" />
    <buttons-block>
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
import AmountInput from "@/components/amount-input/index.vue";
import FeeInfo from "@/components/fee-info/index.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedNetwork,
} from "@/stores";
import { Account } from "@/types/account";
import { loadStakerState } from "@/utils/staking";
import BigNumber from "bignumber.js";
import { fromBase, isValidDecimals, toBase } from "@/utils/units";
import { toBN } from "web3-utils";
import { getGasFeeInfo } from "@/utils/fee";
import { GasFeeInfo } from "@/types/transaction";
import { unbondExtrinsic } from "@/utils/extrinsic";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";

const router = useRouter();
const route = useRoute();

const amount = ref<number>(0);
const fee = ref<GasFeeInfo>();
const fromAccount = ref<Account>();
const stakedBalance = ref<BigNumber>(new BigNumber(0));
const hasEnough = ref(true);

onMounted(() => {
  if (route.query.address) {
    const found = accounts.value.find(
      (item) => item.address === route.query.address
    );
    if (found) {
      fromAccount.value = found;
      updateStakedAmount();
      useGetNativeBalances();
      useGetNativePrice();
      return;
    }
  }
  router.push({ name: "stake" });
});

const updateStakedAmount = async () => {
  if (!fromAccount.value) {
    return;
  }

  const api = await apiPromise.value;
  const stakerState = await loadStakerState(api, fromAccount.value.address);

  if (!stakerState?.stakingLedger) {
    return;
  }

  stakedBalance.value = new BigNumber(
    fromBase(
      stakerState.stakingLedger.active.unwrap().toString(),
      nativeToken.value.decimals
    )
  );
};

watch([selectedNetwork], () => {
  updateStakedAmount();
  useGetNativeBalances();
  useGetNativePrice();
});

watch(accounts, () => {
  router.push({
    name: "stake",
  });
});

// Update fees values
watch(
  [amount, stakedBalance],
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
      toBase(stakedBalance.value?.toString() || "0", nativeToken.value.decimals)
    );

    if (rawAmount.gt(rawBalance)) {
      hasEnough.value = false;
    } else {
      hasEnough.value = true;
    }

    const tx = await unbondExtrinsic(api, rawAmount.toString());

    fee.value = await getGasFeeInfo(tx, fromAccount.value.address);
  },
  { deep: true }
);

const isValid = computed<boolean>(() => {
  return (
    (Number(amount.value) > 0 &&
      hasEnough.value &&
      fee.value?.nativeValue.lte(
        nativeBalances[
          fromAccount.value?.address || ""
        ]?.available.toString() || "0"
      )) ||
    false
  );
});

const nextAction = () => {
  router.push({
    name: "stake-unbound-confirm",
    query: {
      address: fromAccount.value?.address || "",
      amount: amount.value.toString(),
    },
  });
};

const back = () => {
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-unbound {
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
  &__description {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0 0 16px 0;
    padding: 0 60px;
    .sizing();
  }
  &__label {
    .body1__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding: 0 60px;
    .sizing();
  }
  &__fee {
    padding: 0 60px;
    .sizing();
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;

    &-title {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0 10px 0 0;
    }

    &-fiat {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0 10px 0 0;
    }

    &-amount {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @tertiaryLabel;
      margin: 0;

      span {
        text-transform: uppercase;
      }
    }
  }
}
</style>
