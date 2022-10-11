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
      :token="token"
      :value="String(amount)"
      @update:amount="inputAmount"
    />

    <div class="stake-unbound__fee">
      <p class="stake-unbound__fee-title">Network fee:</p>
      <p class="stake-unbound__fee-fiat">
        {{ $filters.currencyFormat(0.34, "USD") }}
      </p>
      <p class="stake-unbound__fee-amount">
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
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot } from "@/types/tokens";

const router = useRouter();

const amount = ref<number>(1000);
const token = ref<Token>(dot);

const nextAction = () => {
  router.push({ name: "stake-unbound-confirm" });
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
