<template>
  <white-wrapper class="crowdloan__wrap">
    <h2 class="crowdloan__title">Crowdloan</h2>

    <h4 class="crowdloan__label">Ongoing</h4>

    <div class="crowdloan__header">
      <div class="crowdloan__header-item">Parachain</div>
      <div class="crowdloan__header-item">Raised DOT</div>
      <div class="crowdloan__header-item">Liquidity Tokens</div>
      <div class="crowdloan__header-item">My contribution</div>
    </div>

    <crowdloan-item
      v-for="(item, index) in ongoing"
      :key="index"
      :item="item"
    />

    <h4 class="crowdloan__label inner">Completed</h4>

    <crowdloan-item
      v-for="(item, index) in completed"
      :key="index"
      :item="item"
    />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import CrowdloanItem from "./components/crowdloan-item.vue";
import { ongoing, completed } from "@/types/mock";
import { onMounted } from "vue";
import { getCampaignsInfo } from "@/utils/crowdloan";
import { apiPromise } from "@/stores";

onMounted(async () => {
  const api = await apiPromise.value;
  getCampaignsInfo(api);
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
.crowdloan {
  &__wrap {
    padding: 16px 32px;
    margin-left: -4px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__label {
    .body1__Bold();
    color: @primaryLabel;
    margin: 0;

    &.inner {
      margin: 24px 0 0 0;
    }
  }
  &__header {
    padding: 8px 0;
    .sizing();
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    &-item {
      .caption__Regular();
      color: @secondaryLabel;
      margin: 0;
      letter-spacing: 0.25px;

      &:nth-child(1) {
        min-width: 25.07%;
      }
      &:nth-child(2) {
        min-width: 31.23%;
      }
      &:nth-child(3) {
        min-width: 17.26%;
      }
      &:nth-child(4) {
        min-width: 26.44%;
        text-align: right;
      }
    }
  }
}
</style>
