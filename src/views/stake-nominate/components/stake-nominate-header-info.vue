<template>
  <div class="stake-nominate__header-info">
    <div class="stake-nominate__header-info-block">
      <p>Staking amount</p>
      <h5>
        <img
          v-if="currencySymbol === 'DOT'"
          src="@/assets/pic/polkadot-white.png"
        />
        <img v-else src="@/assets/pic/kusama.token.png" />
        <span
          >{{ $filters.cryptoCurrencyFormat(amount) }}
          {{ currencySymbol }}</span
        >
      </h5>
    </div>
    <div class="stake-nominate__header-info-block">
      <p>Estimated Returns</p>
      <h5>{{ $filters.cryptoCurrencyFormat(returns) }} {{ currencySymbol }}</h5>
    </div>
    <div class="stake-nominate__header-info-block">
      <p>Estimated Yield</p>
      <h5>{{ $filters.cryptoCurrencyFormat(yield) }}%</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { selectedNetwork } from "@/stores";
import { Network } from "@/types/network";
import { computed } from "vue";

const currencySymbol = computed(() => {
  if (selectedNetwork.value === Network.Polkadot) {
    return "DOT";
  } else if (selectedNetwork.value === Network.Kusama) {
    return "KSM";
  } else {
    return "WND";
  }
});

defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  returns: {
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

.stake-nominate {
  &__header {
    &-info {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      &-block {
        margin: 0 0 0 24px;
        p {
          .caption__Regular();
          letter-spacing: 0.25px;
          color: @secondaryLabel;
          margin: 0 0 1px 0;
        }
        h5 {
          .body1__Meduim();
          color: @primaryLabel;
          margin: 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
            box-shadow: @shadowIcon;
            border-radius: 100%;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
