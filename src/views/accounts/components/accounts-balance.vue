<template>
  <div class="accounts-balance container-inner">
    <div class="row justify-content-beetwen align-items-center">
      <div class="col-8">
        <h4 class="accounts-balance__title">Total Balance</h4>
        <h2 class="accounts-balance__amount">
          {{ $filters.cryptoCurrencyFormat(totalBalance) }} <span>dot</span>
        </h2>
        <p class="accounts-balance__fiat">
          {{ $filters.currencyFormat(totalUsdValue, "USD") }}
        </p>
      </div>
      <div class="col-4 row justify-content-end">
        <base-button title="Stake" :stroke="true" :small="true" />
        <base-button title="Send" :stroke="true" :small="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base-button/index.vue";
import { accounts } from "@/stores";
import { ref, watch } from "vue";

const totalBalance = ref<number>(0);
const totalUsdValue = ref<number>(0);

watch(accounts, () => {
  totalBalance.value = accounts.value.reduce((previous, current) => {
    return previous + current.balance;
  }, 0);
  // TODO get price of tokens so we can calculate usd value
  totalUsdValue.value = totalBalance.value * 10;
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.accounts-balance {
  padding: 16px 16px 32px 16px !important;

  &__title {
    .body2__Regular();
    color: @secondaryLabel;
    margin: 0;
  }

  &__amount {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0;

    span {
      text-transform: uppercase;
    }
  }

  &__fiat {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0;
  }

  .base-button {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
