<template>
  <div class="stake-confirm-amount">
    <img class="stake-confirm-amount__icon" :src="token.image" />
    <div class="stake-confirm-amount__info">
      <h2 class="stake-confirm-amount__info-amount">
        {{ $filters.cryptoCurrencyFormat(amount) }}
        <span>{{ token.symbol }}</span>
      </h2>
      <div class="stake-confirm-amount__info-fiat">
        ~{{ $filters.currencyFormat(token.price.toNumber() * amount, "USD") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nativeToken } from "@/stores";
import { Token } from "@/types/token";
import { PropType } from "vue";

defineProps({
  token: {
    type: Object as PropType<Token>,
    default: nativeToken,
  },
  amount: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-amount {
  width: 100%;
  height: 88px;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding-left: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  &__icon {
    position: absolute;
    box-shadow: @shadowIcon;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    left: 16px;
    top: 50%;
    margin-top: -16px;
  }

  &__info {
    text-decoration: none;
    position: relative;
    width: 100%;

    &-amount {
      .headline4__Regular();
      color: @primaryLabel;
      margin: 0 0 4px 0;

      span {
        font-variant: small-caps;
        display: inline-block;
      }
    }

    &-fiat {
      .body2__Regular();
      color: @secondaryLabel;
      margin: 0;
    }
  }
}
</style>
