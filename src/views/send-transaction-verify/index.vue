<template>
  <white-wrapper v-if="!isSend" class="send-verify__wrap">
    <div class="send-verify__header">
      <back-button :action="back" />
      <h1 class="send-verify__title">Verify transaction</h1>
    </div>
    <p class="send-verify__description">
      Double check the information and confirm transaction.
    </p>
    <div class="send-verify__block">
      <div class="send-verify__block-item">
        <send-verify-item :account="fromAccount" title="From" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-item :account="toAccount" title="To" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-amount :token="selectedAsset" :amount="amount" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-fee :fee="fee" />
      </div>
    </div>
    <send-error v-if="edWarn" :token="selectedAsset" />
    <buttons-block>
      <base-button title="Confirm and send" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="send-verify__wrap">
    <send-verify-success />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import SendError from "../send-transaction/components/send-error.vue";
import SendVerifyItem from "./components/send-verify-item.vue";
import SendVerifyAmount from "./components/send-verify-amount.vue";
import SendVerifyFee from "./components/send-verify-fee.vue";
import SendVerifySuccess from "./components/send-verify-success.vue";

import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  signer,
} from "@/stores";
import { encodeSubstrateAddress } from "@/utils";
import { formatAddress } from "@/utils/filters";
<<<<<<< HEAD
import createIcon from "@/libs/identicon/polkadot";
=======
import createIcon from "@/libs/polkadot-identicon";
>>>>>>> develop
import { GasFeeInfo } from "@/types/transaction";
import { fromBase, isValidDecimals, toBase } from "@/utils/units";
import { sendExtrinsic } from "@/utils/extrinsic";
import BigNumber from "bignumber.js";
import { toBN } from "web3-utils";

const router = useRouter();
const route = useRoute();

const fromAccount = ref<Account>(accounts.value[0]);
const toAccount = ref<Account>();
const amount = ref<string>();
const fee = ref<GasFeeInfo>();
const selectedAsset = ref<Token>(nativeToken.value);
const hasEnough = ref(true);
const isSend = ref<boolean>(false);

onMounted(() => {
  if (!route.query.from || !route.query.to || !route.query.amount) {
    router.push({ name: "send" });
    return;
  }

  const foundFrom = accounts.value.find(
    (item) => item.address === route.query.from
  );
  let foundTo = accounts.value.find((item) => item.address === route.query.to);
  if (!foundTo) {
    const toAddress = route.query.to.toString();
    const isValidAddress = encodeSubstrateAddress(toAddress);
    if (isValidAddress) {
      foundTo = {
        id: Number.MAX_SAFE_INTEGER,
        name: "",
        image: createIcon(toAddress),
        address: formatAddress(toAddress),
        isLedger: false,
      };
    }
  }
  const convertedAmount = Number(route.query.amount);

  if (foundFrom && foundTo && convertedAmount) {
    fromAccount.value = foundFrom;
    toAccount.value = foundTo;
    amount.value = convertedAmount.toString();
  } else {
    router.push({ name: "send" });
  }
});

const edWarn = computed(() => {
  if (!fee.value || !amount.value) {
    return false;
  }

  if (!isValidDecimals(amount.value, selectedAsset.value.decimals)) {
    return false;
  }

  const rawAmount = toBN(
    toBase(amount.value?.toString() || "0", selectedAsset.value.decimals)
  );
  const ed = toBN(
    toBase(
      selectedAsset.value.existentialDeposit || "0",
      selectedAsset.value.decimals
    )
  );
  const userBalance = toBN(
    toBase(
      nativeBalances.value[fromAccount.value.address]?.available.toString() ||
        "0",
      selectedAsset.value.decimals
    )
  );

  const txFee = toBN(
    toBase(fee.value.nativeValue.toString(), selectedAsset.value.decimals)
  );
  return userBalance.sub(txFee).sub(rawAmount).lt(ed);
});

watch([selectedAsset, amount, nativeBalances, toAccount], async () => {
  if (amount.value && selectedAsset.value && toAccount.value) {
    if (
      !isValidDecimals(amount.value.toString(), selectedAsset.value.decimals)
    ) {
      hasEnough.value = false;
      return;
    }

    const api = await apiPromise.value;
    await api.isReady;

    const rawAmount = toBN(
      toBase(amount.value?.toString() || "0", selectedAsset.value.decimals)
    );

    const rawBalance = toBN(
      toBase(
        nativeBalances.value[fromAccount.value.address]?.available.toString() ||
          "0",
        selectedAsset.value.decimals
      )
    );

    if (rawAmount.gt(rawBalance)) {
      hasEnough.value = false;
    } else {
      hasEnough.value = true;
    }

    const transferType = "all";

    const tx = await sendExtrinsic(
      api,
      toAccount.value.address,
      rawAmount.toString(),
      transferType
    );
    const { partialFee } = (
      await tx.paymentInfo(fromAccount.value.address)
    ).toJSON();

    const txFeeHuman = new BigNumber(
      fromBase(partialFee?.toString() ?? "", selectedAsset.value.decimals)
    );

    const txPrice = new BigNumber(selectedAsset.value.price).times(txFeeHuman);

    fee.value = {
      fiatSymbol: "USD",
      fiatValue: txPrice,
      nativeSymbol: selectedAsset.value.symbol ?? "",
      nativeValue: txFeeHuman,
    };
  }
});

const nextAction = async () => {
  if (!toAccount.value?.address || !amount.value) {
    return;
  }

  const api = await apiPromise.value;
  const sendAmount = toBase(amount.value, selectedAsset.value.decimals);
  const transferType = "transfer";

  const tx = await sendExtrinsic(
    api,
    toAccount.value.address,
    sendAmount,
    transferType
  );

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

  isSend.value = true;
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.send-verify {
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
    margin: 0 0 16px 0;
    color: @secondaryLabel;
    padding-left: 60px;
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
