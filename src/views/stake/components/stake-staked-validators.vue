<template>
  <div class="stake-staked-validators__header">
    <div class="stake-staked-validators__table-item">Validator</div>
    <div class="stake-staked-validators__table-item">Status</div>
    <div class="stake-staked-validators__table-item">Commission</div>
    <div class="stake-staked-validators__table-item">Total stake</div>
    <div class="stake-staked-validators__table-item">Bonded amount</div>
  </div>

  <stake-staked-validator-item
    v-for="(item, index) in validators"
    :key="index"
    :validator="item"
  />
</template>

<script setup lang="ts">
import StakeStakedValidatorItem from "./stake-staked-validator-item.vue";
import { PropType } from "vue";
import { Validator } from "@/types/validator";

defineProps({
  validators: {
    type: Object as PropType<Array<Validator>>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-staked-validators {
  &__header {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 2px 0;
    height: 32px;
  }
  &__table {
    &-block {
      width: 100%;
      margin: 0;
    }
    &-item {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;

      &:nth-child(1) {
        min-width: 37.46%;
      }
      &:nth-child(2) {
        min-width: 12.54%;
      }
      &:nth-child(3) {
        min-width: 12.54%;
      }
      &:nth-child(4) {
        min-width: 18.81%;
      }
      &:nth-child(5) {
        min-width: 18.81%;
      }
    }
  }
}
</style>
