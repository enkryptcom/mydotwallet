<template>
  <white-wrapper class="send__wrap">
    <h1 class="send__title">Send</h1>
    <div v-if="accounts.length">
      <select-account-input
        :account="fromAccount"
        :accounts="accounts"
<<<<<<< HEAD
=======
        :is-amount="true"
>>>>>>> develop
        title="From"
        @update:select="selectFromAccount"
      />
      <search-account-input
        :account="toAccount"
        :accounts="accounts"
        :recent="recent"
        @update:select="selectToAccount"
      />
      <amount-input
        :has-enough-balance="hasEnough"
        :token="selectedAsset"
        :value="amount"
        :max-value="nativeBalances[fromAccount?.address]?.available"
        @update:amount="inputAmount"
      />
      <fee-info :fee="fee" />
      <send-error v-if="edWarn" :token="selectedAsset" />
      <buttons-block>
        <base-button
          title="Continue"
          :action="nextAction"
          :send="true"
          :disabled="!isValid"
        />
      </buttons-block>
    </div>
    <div v-else>Please connect your wallet so you can send tokens.</div>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import SearchAccountInput from "@/components/search-account-input/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import FeeInfo from "@/components/fee-info/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import SendError from "./components/send-error.vue";
import { recent } from "@/types/mock";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedNetwork,
} from "@/stores";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetAccountNativeBalance } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { fromBase, isValidDecimals, toBase } from "@/utils/units";
import BigNumber from "bignumber.js";
import { GasFeeInfo } from "@/types/transaction";
import { sendExtrinsic } from "@/utils/extrinsic";
import { toBN } from "web3-utils";
const router = useRouter();
const route = useRoute();

<<<<<<< HEAD
const fromAccount = ref<Account>(accounts.value[0]);
=======
const fromAccount = ref<Account>(
  route.query.address
    ? accounts.value.find(
        (acc) => acc.address === (route.query.address as string)
      ) ?? accounts.value[0]
    : accounts.value[0]
);
>>>>>>> develop
const toAccount = ref<Account>();
const amount = ref<string>("");
const fee = ref<GasFeeInfo>();
const selectedAsset = ref<Token>(nativeToken.value);
const hasEnough = ref(true);
const isValid = computed<boolean>(() => {
  return (
    !!fromAccount.value &&
    !!toAccount.value &&
    Number(amount.value) > 0 &&
    hasEnough.value
  );
});

watch(fromAccount, () => {
  if (fromAccount.value) {
    useGetAccountNativeBalance(fromAccount.value.address);
    useGetNativePrice();
  }
});

watch(selectedNetwork, () => {
  selectedAsset.value = nativeToken.value;
});

onMounted(() => {
  if (route.query.from) {
    const found = accounts.value.find(
      (item) => item.address === route.query.from
    );
    if (found) {
      fromAccount.value = found;
    }
  }
  if (route.query.to) {
    const found = accounts.value.find(
      (item) => item.address === route.query.to
    );
    if (found) {
      toAccount.value = found;
    }
  }
  if (route.query.amount) {
    const converted = Number(route.query.amount);
    if (converted) {
      amount.value = converted.toString();
    }
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

const selectFromAccount = (account: Account) => {
  fromAccount.value = account;
};

const selectToAccount = (account: Account) => {
  toAccount.value = account;
};

const inputAmount = (newVal: string) => {
  amount.value = newVal;
};

const nextAction = () => {
  router.push({
    name: "send-verify",
    query: {
      from: fromAccount.value.address,
      to: toAccount.value?.address,
      amount: amount.value,
    },
  });
};

watch(
  [selectedAsset, amount, nativeBalances, fromAccount, toAccount],
  async () => {
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
          nativeBalances.value[
            fromAccount.value.address
          ]?.available.toString() || "0",
          selectedAsset.value.decimals
        )
      );

      if (rawAmount.gt(rawBalance)) {
        hasEnough.value = false;
      } else {
        hasEnough.value = true;
      }

      const transferType = "transfer";

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

      const txPrice = new BigNumber(selectedAsset.value.price).times(
        txFeeHuman
      );

      fee.value = {
        fiatSymbol: "USD",
        fiatValue: txPrice,
        nativeSymbol: selectedAsset.value.symbol ?? "",
        nativeValue: txFeeHuman,
      };
    }
  }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.send {
  &__wrap {
    padding: 16px 32px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
}
</style>
