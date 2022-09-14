<template>
  <div class="claiming-success">
    <success-icon />
    <h3>Successfully claimed</h3>
    <div class="claiming-success__amount">
      <img class="claiming-success__amount-icon" :src="token.image" />
      <h4 class="claiming-success__amount-amount">
        {{ $filters.cryptoCurrencyFormat(amount) }}
        <span>{{ token.symbol }}</span>
      </h4>
    </div>
    <div class="claiming__buttons">
      <base-button title="Go to accounts" :action="closeAction" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SuccessIcon from "@/icons/send/success-icon.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";
import { Token } from "@/types/token";
import { PropType } from "vue";

const router = useRouter();

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

const closeAction = () => {
  router.push({ name: "main" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claiming-success {
  padding: 32px 0 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h3 {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 16px 0;
    text-align: center;
  }

  &__amount {
    text-decoration: none;
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    margin: 0 0 48px 0;

    &-icon {
      box-shadow: @shadowIcon;
      width: 32px;
      height: 32px;
      border-radius: 100%;
      margin-right: 16px;
    }

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

  &__buttons {
    .base-button {
      margin: 0 8px;
    }
  }
}
</style>
