<template>
  <white-wrapper class="crowdloan-contribute__wrap">
    <div class="crowdloan-contribute__header">
      <back-button :action="back" />
      <h1 class="crowdloan-contribute__title">Contribute to fund</h1>
    </div>
    <p class="crowdloan-contribute__description">
      Contribute to a crowd sale. It will be withdrawable when the crowdloan has
      ended and the funds are unused.
    </p>

    <select-account-input
      :account="fromAccount"
      :accounts="accounts"
      :is-amount="true"
      title="From"
      @update:select="selectAccount"
    />

    <div class="crowdloan-contribute__info">
      <div class="crowdloan-contribute__info-item">
        <p>Minimum allowed</p>
        <h5>5 <span>dot</span></h5>
      </div>
      <div class="crowdloan-contribute__info-item">
        <p>Remaining till cap</p>
        <h5>57.475K <span>dot</span></h5>
      </div>
    </div>

    <amount-input
      :token="token"
      :value="String(amount)"
      @update:amount="inputAmount"
    />

    <div class="crowdloan-contribute__fee">
      <p class="crowdloan-contribute__fee-title">Network fee:</p>
      <p class="crowdloan-contribute__fee-fiat">
        {{ $filters.currencyFormat(0.34, "USD") }}
      </p>
      <p class="crowdloan-contribute__fee-amount">
        {{ $filters.cryptoCurrencyFormat(0.037) }} <span>dot</span>
      </p>
    </div>

    <buttons-block>
      <base-button title="Continue" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot, accounts } from "@/types/mock";
import { Account } from "@/types/account";

const router = useRouter();

const fromAccount = ref<Account>(accounts[0]);
const amount = ref<number>(1000);
const token = ref<Token>(dot);

const nextAction = () => {
  router.push({ name: "crowdloan-confirm" });
};

const back = () => {
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};

const selectAccount = (account: Account) => {
  fromAccount.value = account;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.crowdloan-contribute {
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
  &__info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    padding: 0 60px;
    margin: 0 0 16px 0;
    .sizing();

    &-item {
      margin-right: 24px;
      p {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0 0 4px 0;
      }
      h5 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0;

        span {
          text-transform: uppercase;
        }
      }
    }
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
