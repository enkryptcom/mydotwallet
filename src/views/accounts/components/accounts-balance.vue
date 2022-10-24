<template>
  <div class="accounts-balance container-inner">
    <div class="row justify-content-beetwen align-items-center">
      <div class="col-8">
        <h4 class="accounts-balance__title">Total Balance</h4>
        <h2 class="accounts-balance__amount">
          {{ $filters.cryptoCurrencyFormat(balance) }}
          <span>{{ token?.symbol || "dot" }}</span>
        </h2>
        <p class="accounts-balance__fiat">
          {{ $filters.currencyFormat(totalUsdValue, "USD") }}
        </p>
      </div>
      <div class="col-4 row justify-content-end">
        <base-button title="Stake" :stroke="true" :small="true" />
        <base-button
          title="Send"
          :stroke="true"
          :small="true"
          :action="navigateToSend"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base-button/index.vue";
import { computed, PropType } from "vue";
import { Token } from "@/types/token";
import BigNumber from "bignumber.js";
import { nativeToken } from "@/stores";
<<<<<<< HEAD
=======
import { useRouter } from "vue-router";

const router = useRouter();
>>>>>>> develop

const props = defineProps({
  balance: {
    type: Object as PropType<BigNumber>,
    default: new BigNumber(0),
  },
  token: {
    type: Object as PropType<Token>,
    default: nativeToken,
  },
});

const totalUsdValue = computed(() => {
  return props.balance.times(props.token.price);
});

const navigateToSend = () => {
  router.push({
    name: "send",
  });
};
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
