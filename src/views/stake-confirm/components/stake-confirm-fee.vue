<template>
  <div class="stake-confirm-fee">
    <p class="stake-confirm-fee__title">Network fee:</p>
    <p class="stake-confirm-fee__fiat">
      {{ $filters.currencyFormat(fee.fiatValue, fee.fiatSymbol) }}
    </p>
    <p class="stake-confirm-fee__amount">
      {{ $filters.cryptoCurrencyFormat(fee.nativeValue) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { GasFeeInfo } from "@/types/transaction";
import BigNumber from "bignumber.js";
import { PropType } from "vue";

defineProps({
  fee: {
    type: Object as PropType<GasFeeInfo>,
    default: () => ({
      nativeValue: new BigNumber(0),
      fiatValue: new BigNumber(0),
      nativeSymbol: "dot",
      fiatSymbol: "USD",
    }),
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-fee {
  padding: 12px 12px 12px 60px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  &__title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    margin: 0 10px 0 0;
  }

  &__fiat {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    margin: 0 10px 0 0;
  }

  &__amount {
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
</style>
