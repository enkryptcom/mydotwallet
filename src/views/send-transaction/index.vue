<template>
  <white-wrapper class="send__wrap">
    <h1 class="send__title">Send</h1>
    <select-account-input
      :account="fromAccount"
      :accounts="accounts"
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
      :token="token"
      :value="String(amount)"
      @update:amount="inputAmount"
    />
    <fee-info />
    <send-error />
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
import SelectAccountInput from "@/components/select-account-input/index.vue";
import SearchAccountInput from "@/components/search-account-input/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import FeeInfo from "@/components/fee-info/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import SendError from "./components/send-error.vue";
import { accounts, recent } from "@/types/mock";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { dot } from "@/types/tokens";

const router = useRouter();

const fromAccount = ref<Account>(accounts[0]);
const toAccount = ref<Account | null>(null);
const token = ref<Token>(dot);
const amount = ref<number>(0);
const isValid = computed<boolean>(() => {
  return !!fromAccount.value && !!toAccount.value && amount.value > 0;
});

const selectFromAccount = (account: Account) => {
  fromAccount.value = account;
};

const selectToAccount = (account: Account) => {
  toAccount.value = account;
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};

const nextAction = () => {
  router.push({ name: "send-verify" });
};
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
