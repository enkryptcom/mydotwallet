<template>
  <stake-intro v-if="showStakeIntro" />
  <white-wrapper
    v-else
    class="stake__wrap"
    :style="{
      marginTop: '32px',
    }"
  >
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--staked">
      <stake-staked-overview :totat="1000" :overall="1.473" :yield="14.46" />
      <base-button title="Stake more" :action="stakeMoreAction" />
    </div>

    <div class="stake__staked-list">
      <stake-staked-account :account="accounts[1]" />
    </div>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import StakeStakedOverview from "./components/stake-staked-overview.vue";
import StakeStakedAccount from "./components/stake-staked-account.vue";
import StakeIntro from "./components/stake-intro.vue";
import { useRouter } from "vue-router";
import { accounts } from "@/types/mock";
import { onMounted, ref } from "vue";

const router = useRouter();

const showStakeIntro = ref<boolean>(false);

onMounted(() => {
  showStakeIntro.value = true;
});

const stakeMoreAction = () => {
  router.push({ name: "stake-enter-amount" });
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

    &--staked {
      padding: 16px 44px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }
  }
  &__staked-list {
    padding: 8px 0 16px 0;
  }
}
</style>
