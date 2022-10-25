<template>
  <white-wrapper class="stake__wrap">
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--start">
      <stake-start-image />
      <h3>
        You can earn rewards by bonding assets and then nominating your
        validators.
      </h3>
      <more-link title="Lear more about how it works" :action="moreAction" />
    </div>
    <div class="stake__calculate">
      <div class="stake__calculate-header">
        <h4>Calculate investments</h4>
      </div>
    </div>
    <buttons-block>
      <base-button title="Start staking" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import StakeStartImage from "@/icons/stake/stake-start-image.vue";
import MoreLink from "@/components/more-link/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const nextAction = () => {
  // router.push({ name: "claiming" });
};

const moreAction = () => {
  console.log("moreAction");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake {
  &__wrap {
    padding: 16px 32px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__block {
    padding: 24px 64px;
    margin: 0 0 24px 0;
    background: @gray002;
    border-radius: 16px;

    &--start {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h3 {
        text-align: center;
        .headline6__Bold();
        color: @primaryLabel;
        margin: 16px 0 2px 0;
        padding: 0 8px;
      }
    }
  }
  &__calculate {
    &-header {
      margin: 0 0 8px 0;
      h4 {
        .body1__Bold();
        color: @primaryLabel;
        margin: 0;
      }
    }
  }
}
</style>
