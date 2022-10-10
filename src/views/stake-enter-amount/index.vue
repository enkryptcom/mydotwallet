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
      :is-amount="true"
      title="From"
      @update:select="selectAccount"
    />

    <amount-input
      :token="token"
      :value="String(amount)"
      @update:amount="inputAmount"
    />

    <buttons-block :is-space="true">
      <div class="stake-enter-amount__lock">
        <Switch />
        <p>Lock rewards for compounding?</p>
        <info-tooltip :text="rewardsInfo" />
      </div>
      <base-button title="Continue" :action="nextAction" :send="true" />
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
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot, accounts } from "@/types/mock";

const router = useRouter();

const rewardsInfo =
  "If you choose not to lock your rewards, then your newly minted rewards will be transferrable by default. However, this would mean lower earnings over longer period of time.";

const fromAccount = ref<Account>(accounts[0]);
const amount = ref<number>(1000);
const token = ref<Token>(dot);

const nextAction = () => {
  router.push({ name: "stake-nominate" });
};

const back = () => {
  router.go(-1);
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
