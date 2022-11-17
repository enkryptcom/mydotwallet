<template>
  <white-wrapper v-if="!isSend" class="crowdloan-confirm__wrap">
    <div class="crowdloan-confirm__header">
      <back-button :action="back" />
      <h1 class="crowdloan-confirm__title">Review and confirm</h1>
    </div>
    <p class="crowdloan-confirm__description">
      Double check the information and confirm transaction.
    </p>

    <div class="crowdloan-confirm__block">
      <div class="crowdloan-confirm__block-item">
        <stake-confirm-account
          :account="fromAccount"
          :amount="availableBalance"
          title="From"
        />
      </div>
      <div class="crowdloan-confirm__block-item">
        <stake-confirm-amount :token="nativeToken" :amount="amount" />
      </div>
      <div class="crowdloan-confirm__block-item">
        <stake-confirm-fee :fee="fee" />
      </div>
    </div>

    <buttons-block>
      <base-button
        title="Confirm and contribute"
        :action="nextAction"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="crowdloan-confirm__wrap">
    <crowdloan-confirm-process :is-done="isSendDone" :is-error="isError" />
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
import { Account } from "@/types/account";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CrowdloanConfirmProcess from "./components/crowdloan-confirm-process.vue";
import { GasFeeInfo } from "@/types/transaction";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedCrowdloan,
  selectedNetwork,
  signer,
} from "@/stores";
import { toBN } from "web3-utils";
import { toBase } from "@/utils/units";
import { getGasFeeInfo } from "@/utils/fee";
import { ParaId } from "@polkadot/types/interfaces";
import { crowdloanContributeExtrinsic } from "@/utils/extrinsic";
import { ISubmittableResult } from "@polkadot/types/types";

const router = useRouter();
const route = useRoute();

const fromAccount = ref<Account>();
const amount = ref<number>(0);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);

const fee = ref<GasFeeInfo>();

onMounted(() => {
  if (!selectedCrowdloan.value || !route.query.address || !route.query.amount) {
    router.push({ name: "crowdloan" });
    return;
  }

  const found = accounts.value.find(
    (item) => item.address === route.query.address
  );

  const convertedAmount = Number(route.query.amount);

  if (found && convertedAmount) {
    fromAccount.value = found;
    amount.value = Number(convertedAmount.toString());
  } else {
    router.push({ name: "crowdloan" });
  }
});

const nextAction = async () => {
  if (!fromAccount.value) {
    return;
  }

  isSend.value = true;

  const api = await apiPromise.value;
  const rawAmount = toBN(
    toBase(amount.value?.toString() || "0", nativeToken.value.decimals)
  );

  const tx = await crowdloanContributeExtrinsic(
    api,
    api.createType<ParaId>("ParaId", selectedCrowdloan.value?.paraId),
    rawAmount.toString()
  );

  try {
    const unsubscribe = await tx.signAndSend(
      fromAccount.value.address,
      {
        signer: signer.value,
        nonce: -1,
      },
      async (result: ISubmittableResult) => {
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
  } catch (error) {
    console.error("Unexpected error when sending transaction", error);
    isError.value = true;
  }
};

const back = () => {
  router.go(-1);
};

const availableBalance = computed(() => {
  if (!nativeBalances || !fromAccount.value) {
    return 0;
  }

  return nativeBalances[fromAccount.value.address]?.available.toNumber() || 0;
});

watch([selectedNetwork, accounts], () => {
  router.push({ name: "crowdloan" });
});

watch([amount, nativeBalances], async () => {
  if (!amount.value || !fromAccount.value) {
    return;
  }

  const api = await apiPromise.value;

  const rawAmount = toBN(
    toBase(amount.value?.toString() || "0", nativeToken.value.decimals)
  );

  const tx = await crowdloanContributeExtrinsic(
    api,
    api.createType<ParaId>("ParaId", selectedCrowdloan.value?.paraId),
    rawAmount.toString()
  );

  fee.value = await getGasFeeInfo(tx, fromAccount.value?.address || "");
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.crowdloan-confirm {
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
