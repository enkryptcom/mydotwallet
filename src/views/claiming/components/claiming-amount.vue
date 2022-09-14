<template>
  <div class="claiming-amount">
    <img class="claiming-amount__icon" :src="token.image" />
    <div class="claiming-amount__info">
      <h3 class="claiming-amount__info-amount">
        {{ $filters.cryptoCurrencyFormat(amount) }}
        <span>{{ token.symbol }}</span>
      </h3>
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

.claiming-amount {
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 0 0 0 48px;
  margin: 0 0 16px 0;

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
