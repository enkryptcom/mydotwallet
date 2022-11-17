<template>
  <div class="claim-valid-account">
    <h2>Your Ethereum account has a valid claim for</h2>
    <div class="claim-valid-account__item">
      <img class="claim-valid-account__icon" :src="token.image" />
      <div class="claim-valid-account__info">
        <h3 class="claim-valid-account__info-amount">
          {{ $filters.cryptoCurrencyFormat(amount) }}
          <span>{{ token.symbol }}</span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Token } from "@/types/token";
import { PropType } from "vue";

defineProps({
  token: {
    type: Object as PropType<Token>,
    default: null,
  },
  amount: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim-valid-account {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(95, 99, 104, 0.2);
  border-radius: 10px;
  margin-bottom: 16px;

  h2 {
    .body1__Bold();
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }

  &__item {
    text-decoration: none;
    position: relative;
    box-sizing: border-box;
    padding-left: 48px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
  }

  &__icon {
    position: absolute;
    box-shadow: @shadowIcon;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    left: 0;
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
      margin: 0;

      span {
        text-transform: uppercase;
        display: inline-block;
      }
    }
  }
}
</style>
