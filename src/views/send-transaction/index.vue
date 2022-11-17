<template>
  <white-wrapper class="send__wrap">
    <h1 class="send__title">Send</h1>
    <div v-if="accounts.length">
      <select-account-input
        :account="fromAccount"
        :accounts="accounts"
        :is-amount="true"
        :token="nativeToken"
        title="From"
        @update:select="selectFromAccount"
      />
      <search-account-input
        :account="toAccount"
        :accounts="accounts"
        :recent="recentAccounts"
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
import { isValidDecimals, toBase } from "@/utils/units";
import { GasFeeInfo } from "@/types/transaction";
import { sendExtrinsic } from "@/utils/extrinsic";
import { toBN } from "web3-utils";
import { getGasFeeInfo } from "@/utils/fee";
import AccountsState from "@/state/accounts";

const router = useRouter();
const route = useRoute();
const accountsState = new AccountsState();

const fromAccount = ref<Account>(accounts.value[0]);
const toAccount = ref<Account>();
const amount = ref<string>("");
const fee = ref<GasFeeInfo>();
const selectedAsset = ref<Token>(nativeToken.value);
const hasEnough = ref(true);
const recentAccounts = ref<Account[]>([]);

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

onMounted(async () => {
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

  recentAccounts.value = await accountsState.getRecentAccounts();
  loadFeeInfo();
  validateInputs();
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
      selectedAsset.value.existentialDeposit.toString() || "0",
      selectedAsset.value.decimals
    )
  );
  const userBalance = toBN(
    toBase(
      nativeBalances[fromAccount.value.address]?.available.toString() || "0",
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

const validateInputs = async () => {
  if (
    amount.value &&
    selectedAsset.value &&
    fromAccount.value &&
    toAccount.value
  ) {
    if (
      !isValidDecimals(amount.value.toString(), selectedAsset.value.decimals)
    ) {
      hasEnough.value = false;
      return;
    }

    const rawAmount = toBN(
      toBase(amount.value?.toString() || "0", selectedAsset.value.decimals)
    );

    const rawBalance = toBN(
      toBase(
        nativeBalances[fromAccount.value.address]?.available.toString() || "0",
        selectedAsset.value.decimals
      )
    );

    if (rawAmount.gt(rawBalance)) {
      hasEnough.value = false;
    } else {
      hasEnough.value = true;
    }
  }
};

const loadFeeInfo = async () => {
  // Load fee info for transaction with mock values
  const api = await apiPromise.value;

  const tx = await sendExtrinsic(
    api,
    accounts.value[0].address,
    "1",
    "transfer"
  );

  fee.value = await getGasFeeInfo(tx, fromAccount.value.address);
};

watch(
  [
    selectedAsset,
    amount,
    nativeBalances,
    fromAccount,
    toAccount,
    selectedNetwork,
  ],
  validateInputs
);

watch([selectedNetwork, accounts], loadFeeInfo);
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
