<template>
  <white-wrapper v-if="!isSend" class="stake-withdraw__wrap">
    <div class="stake-withdraw__header">
      <back-button :action="back" />
      <h1 class="stake-withdraw__title">Withdraw assets</h1>
    </div>
    <p class="stake-withdraw__description">
      Your funds will be transfered instantly after transaction go through.
    </p>
    <h4 class="stake-withdraw__label">Amount to withdraw</h4>

    <div class="stake-withdraw__block">
      <div class="stake-withdraw__block-item">
        <stake-confirm-amount
          :token="nativeToken"
          :amount="withdrawableBalance.toNumber()"
        />
      </div>
    </div>

    <div class="stake-withdraw__fee">
      <p class="stake-withdraw__fee-title">Network fee:</p>
      <p class="stake-withdraw__fee-fiat">
        {{
          $filters.currencyFormat(fee?.fiatValue || 0, fee?.fiatSymbol || "USD")
        }}
      </p>
      <p class="stake-withdraw__fee-amount">
        {{ $filters.cryptoCurrencyFormat(fee?.nativeValue || 0) }}
        <span>{{ nativeToken.symbol.toLocaleUpperCase() }}</span>
      </p>
    </div>

    <buttons-block>
      <base-button
        :disabled="withdrawableBalance.lte(0)"
        title="Continue"
        :action="nextAction"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="stake-withdraw__wrap">
    <stake-withdraw-process :is-done="isSendDone" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import stakeConfirmAmount from "../stake-confirm/components/stake-confirm-amount.vue";
import StakeWithdrawProcess from "./components/stake-withdraw-process.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeToken,
  selectedNetwork,
  signer,
} from "@/stores";
import { GasFeeInfo } from "@/types/transaction";
import { Account } from "@/types/account";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { loadStakerState } from "@/utils/staking";
import BigNumber from "bignumber.js";
import { fromBase } from "@/utils/units";
import { getGasFeeInfo } from "@/utils/fee";
import { withdrawExtrinsic } from "@/utils/extrinsic";

const router = useRouter();
const route = useRoute();

const fee = ref<GasFeeInfo>();
const fromAccount = ref<Account>();
const withdrawableBalance = ref<BigNumber>(new BigNumber(0));
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);

onMounted(() => {
  if (!route.query.address) {
    router.push({ name: "stake" });
    return;
  }
  const found = accounts.value.find(
    (item) => item.address === route.query.address
  );
  if (found) {
    fromAccount.value = found;
  } else {
    router.push({ name: "stake" });
  }
  updateStakedAmount();
  useGetNativeBalances();
  useGetNativePrice();
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

  withdrawableBalance.value = new BigNumber(
    fromBase(stakerState.redeemable.toString(), nativeToken.value.decimals)
  );
};

watch(selectedNetwork, () => {
  updateStakedAmount();
  useGetNativeBalances();
  useGetNativePrice();
});

watch(
  [withdrawableBalance],
  async () => {
    if (!withdrawableBalance.value || !fromAccount.value?.address) {
      return;
    }

    const api = await apiPromise.value;

    const tx = await withdrawExtrinsic(api);

    fee.value = await getGasFeeInfo(tx, fromAccount.value?.address || "");
  },
  { deep: true }
);

const nextAction = async () => {
  if (!fromAccount.value) {
    return;
  }
  isSend.value = true;

  const api = await apiPromise.value;

  const tx = await withdrawExtrinsic(api);

  const unsubscribe = await tx.signAndSend(
    fromAccount.value.address,
    {
      signer: signer.value,
      nonce: -1,
    },
    async (result) => {
      if (!result || !result.status) {
        return;
      }

      if (result.status.isFinalized || result.status.isInBlock) {
        result.events
          .filter(({ event: { section } }) => section === "system")
          .forEach(({ event: { method } }): void => {
            if (method === "ExtrinsicFailed") {
              // Handle error
            } else if (method === "ExtrinsicSuccess") {
              // Handle succes
              isSendDone.value = true;
            }
          });
      } else if (result.isError) {
        // Handle error
      }

      if (result.isCompleted) {
        unsubscribe();
      }
    }
  );
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-withdraw {
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
  &__block {
    background: @gray002;
    border-radius: 16px;
    .sizing();

    &-item {
      position: relative;

      &::after {
        content: "";
        width: calc(~"100% - 60px");
        height: 1px;
        background-color: @gray01;
        position: absolute;
        right: 0;
        bottom: 0;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
