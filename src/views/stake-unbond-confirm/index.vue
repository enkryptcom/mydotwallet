<template>
  <white-wrapper v-if="!isSend" class="stake-unbound-confirm__wrap">
    <div class="stake-unbound-confirm__header">
      <back-button :action="back" />
      <h1 class="stake-unbound-confirm__title">
        Stop staking and unbond funds
      </h1>
    </div>
    <p class="stake-unbound-confirm__description">
      Double check the information and confirm transaction.
    </p>

    <div class="stake-unbound-confirm__block">
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-account
          :account="fromAccount"
          :amount="
            nativeBalances[fromAccount?.address || '']?.available?.toNumber()
          "
          title="From"
        />
      </div>
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-amount
          :token="nativeToken"
          :amount="amount ? Number(amount) : 0"
        />
      </div>
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-fee :fee="fee" />
      </div>
    </div>

    <buttons-block>
      <base-button
        title="Stop staking and unbond"
        :action="nextAction"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="stake-confirm__wrap">
    <stake-unbound-confirm-process :is-done="isSendDone" :is-error="isError" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import StakeConfirmAmount from "../stake-confirm/components/stake-confirm-amount.vue";
import StakeConfirmAccount from "../stake-confirm/components/stake-confirm-account.vue";
import StakeConfirmFee from "../stake-confirm/components/stake-confirm-fee.vue";
import StakeUnboundConfirmProcess from "./components/stake-unbond-confirm-process.vue";
import { Account } from "@/types/account";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedNetwork,
  signer,
} from "@/stores";
import BigNumber from "bignumber.js";
import { GasFeeInfo } from "@/types/transaction";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { loadStakerState } from "@/utils/staking";
import { fromBase, isValidDecimals, toBase } from "@/utils/units";
import { toBN } from "web3-utils";
import { unbondExtrinsic } from "@/utils/extrinsic";
import { getGasFeeInfo } from "@/utils/fee";

const router = useRouter();
const route = useRoute();

const fee = ref<GasFeeInfo>();
const fromAccount = ref<Account>();
const stakedBalance = ref<BigNumber>(new BigNumber(0));
const amount = ref<string>();
const hasEnough = ref(true);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);

onMounted(() => {
  if (!route.query.address || !route.query.amount) {
    router.push({ name: "stake" });
    return;
  }

  const found = accounts.value.find(
    (item) => item.address === route.query.address
  );

  const convertedAmount = Number(route.query.amount);

  if (found && convertedAmount) {
    fromAccount.value = found;
    amount.value = convertedAmount.toString();
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

  stakedBalance.value = new BigNumber(
    fromBase(
      stakerState.stakingLedger.active.unwrap().toString(),
      nativeToken.value.decimals
    )
  );
};

watch(selectedNetwork, () => {
  router.push({
    name: "stake-unbound",
    query: {
      address: fromAccount.value?.address,
    },
  });
});

watch(accounts, () => {
  router.push({
    name: "stake",
  });
});

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

const nextAction = async () => {
  if (!amount.value || !fromAccount.value) {
    return;
  }
  isSend.value = true;

  const api = await apiPromise.value;
  const sendAmount = toBase(amount.value, nativeToken.value.decimals);

  const tx = await unbondExtrinsic(api, sendAmount);

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
              isError.value = true;
            } else if (method === "ExtrinsicSuccess") {
              // Handle succes
              isSendDone.value = true;
            }
          });
      } else if (result.isError) {
        // Handle error
        isError.value = true;
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

.stake-unbound-confirm {
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
