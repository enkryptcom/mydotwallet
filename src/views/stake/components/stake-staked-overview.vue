<template>
  <div class="stake-staked-overview">
    <div class="stake-staked-overview__block">
      <p>Total staked</p>
      <h5>
        {{ $filters.cryptoCurrencyFormat(total) }}
        <span>{{ nativeToken.symbol }}</span>
      </h5>
      <h6>
        {{
          $filters.currencyFormat(total * nativeToken.price?.toNumber(), "USD")
        }}
      </h6>
    </div>
    <div class="stake-staked-overview__block">
      <p>Overall earnings</p>
      <h5>
        {{ $filters.cryptoCurrencyFormat(earnings) }}
        <span>{{ nativeToken.symbol }}</span>
      </h5>
      <h6>
        {{
          $filters.currencyFormat(
            earnings * nativeToken.price?.toNumber(),
            "USD"
          )
        }}
      </h6>
    </div>
    <div class="stake-staked-overview__block">
      <p>Overall yield</p>
      <h5>{{ $filters.cryptoCurrencyFormat(yield) }}%</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nativeToken } from "@/stores";

defineProps({
  total: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  yield: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-staked-overview {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  &__block {
    margin: 0 44px 0 0;
    text-align: left;

    &:last-child {
      margin: 0;
    }

    p {
      .caption__Regular();
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0 0 4px 0;
    }
    h5 {
      .headline6__Bold();
      color: @primaryLabel;
      margin: 0;

      span {
        text-transform: uppercase;
      }
    }
    h6 {
      .body2__Regular();
      color: @secondaryLabel;
      margin: 0;
    }
  }
}
</style>
