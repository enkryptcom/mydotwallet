<template>
  <div class="stake-confirm-validators">
    <h5>Validators</h5>

    <stake-confirm-validator-item
      v-for="(item, index) in props.validators"
      :key="index"
      :validator="item"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import StakeConfirmValidatorItem from "./stake-confirm-validator-item.vue";
import { Validator } from "@/types/staking";

const props = defineProps({
  amountToStake: { type: Number, default: 0 },
  validators: {
    type: Object as PropType<Array<Validator>>,
    default: () => {
      return [];
    },
  },
  yield: { type: Number, default: 0 },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-validators {
  padding: 12px 0 12px 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;

  h5 {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: @secondaryLabel;
    margin: 0;
  }
}
</style>
