<template>
  <div class="stake-nominate__controls">
    <div class="stake-nominate__controls-sort">
      <span>Sort by:</span>
      <base-select
        :options="sortOptions"
        :selected="sort"
        @update:toggle="selectSort"
      />
    </div>
    <div class="stake-nominate__controls-filter">
      <div class="stake-nominate__controls-filter-block">
        <span>Hide high risk validators</span>
        <info-tooltip :text="rewardsInfo" />
        <Switch :is-checked="isHighRisk" @update:check="highRiskSwitch" />
      </div>
      <div class="stake-nominate__controls-filter-block">
        <span>Only show selected</span>
        <Switch
          :is-checked="isOnlySelected"
          @update:check="onlySelectedSwitch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoTooltip from "@/components/info-tooltip/index.vue";
import Switch from "@/components/switch/index.vue";
import BaseSelect from "@/components/base-select/index.vue";
import { BaseSelectItem } from "@/types/base-select";
import { ref } from "vue";

const sort = ref<BaseSelectItem>({
  id: 0,
  name: "Estimated returns",
});

const sortOptions = [
  {
    id: 0,
    name: "Estimated returns",
  },
  {
    id: 1,
    name: "Validator name",
  },
];

const rewardsInfo =
  "Rewards will be credited to your bonded balance for compound earning.";

const emit = defineEmits<{
  (e: "update:high-risk", isChecked: boolean): void;
  (e: "update:only-selected", isChecked: boolean): void;
  (e: "update:sort", item: BaseSelectItem): void;
}>();

defineProps({
  isHighRisk: {
    type: Boolean,
    default: false,
  },
  isOnlySelected: {
    type: Boolean,
    default: false,
  },
});

const highRiskSwitch = (isChecked: boolean) => {
  emit("update:high-risk", isChecked);
};

const onlySelectedSwitch = (isChecked: boolean) => {
  emit("update:only-selected", isChecked);
};

const selectSort = (item: BaseSelectItem) => {
  sort.value = item;
  emit("update:sort", item);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-nominate {
  &__controls {
    padding: 10px 0 18px 0;
    .sizing();
    height: 52px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-sort {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      span {
        .body2__Regular();
        color: @secondaryLabel;
        margin-right: 8px;
      }
    }

    &-filter {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      &-block {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 0 0 0 32px;

        span {
          .body2__Regular();
          color: @primaryLabel;
          letter-spacing: 0.25px;
        }

        .switch,
        .info-tooltip {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
