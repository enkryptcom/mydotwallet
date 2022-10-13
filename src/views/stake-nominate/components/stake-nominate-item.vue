<template>
  <div class="stake-nominate__item" @click.capture="toggleSelect">
    <div class="stake-nominate__item-block">
      <div class="stake-nominate__item-info">
        <img src="@/assets/pic/account1.png" alt="" />
        <div class="stake-nominate__item-info-block">
          <h3>
            {{
              validator.name != ""
                ? validator.name
                : $filters.replaceWithEllipsis(validator.address, 6, 6)
            }}
            <span v-if="validator.isHighRisk">High risk</span>
          </h3>
          <p v-if="!validator.isOversubscribed">
            {{ validator.nominators }} nominators
          </p>
          <p v-else class="over">
            Oversubscribed {{ validator.nominators }}
            <info-tooltip :text="overInfo" />
          </p>
        </div>
      </div>
    </div>
    <div class="stake-nominate__item-block">
      <span>{{ validator.commission }}%</span>
    </div>
    <div class="stake-nominate__item-block">
      <span>{{ $filters.cryptoCurrencyFormat(validator.total || 0) }} DOT</span>
    </div>
    <div class="stake-nominate__item-block">
      <span>{{ $filters.cryptoCurrencyFormat(validator.returns || 0) }} DOT</span>
    </div>
    <div class="stake-nominate__item-block">
      <base-checkbox
        class="hardware-select-account__checkbox"
        :is-checked="isSelect"
        :disabled="false"
        @toggle:select="toggleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import BaseCheckbox from "@/components/base-checkbox/index.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import { Validator } from "@/types/validator";

const isSelect = ref<boolean>(false);
const overInfo =
  "Oversubscribed info will be credited to your bonded balance for compound earning.";

const emit = defineEmits<{
  (e: "update:selectValidator", validator: Validator): void;
  (e: "update:deleteValidator", validator: Validator): void;
}>();

const props = defineProps({
  validator: {
    type: Object as PropType<Validator>,
    default: null,
  },
});

const selectValidator = () => {
  emit("update:selectValidator", props.validator);
};

const deleteValidator = () => {
  emit("update:deleteValidator", props.validator);
};

const toggleSelect = () => {
  isSelect.value = !isSelect.value;

  if (isSelect.value) {
    selectValidator();
  } else {
    deleteValidator();
  }
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-nominate {
  &__item {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 32px 0 32px;
    height: 48px;
    .sizing();
    cursor: pointer;

    &-block {
      &:nth-child(1) {
        min-width: 43.73%;
      }
      &:nth-child(2) {
        min-width: 12.545%;
      }
      &:nth-child(3) {
        min-width: 18.759%;
      }
      &:nth-child(4) {
        min-width: 22.21%;
      }
      &:nth-child(5) {
        min-width: 24px;
      }

      span {
        .body2__Regular();
        color: @primaryLabel;
      }
    }

    &-info {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 64px;

      img {
        width: 32px;
        margin-right: 16px;
        border-radius: 100%;
        box-shadow: @shadowIcon;
      }

      &-block {
        h3 {
          .body2__Medium();
          color: @primaryLabel;
          margin: 0 0 1px 0;

          span {
            padding: 0px 6px;
            height: 18px;
            box-sizing: border-box;
            display: inline-block;
            margin-left: 8px;
            background: @error01;
            border-radius: 20px;
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 18px;
            color: @error;
            position: relative;
            top: -2px;
          }
        }

        p {
          .caption__Regular();
          color: @secondaryLabel;
          margin: 0;

          &.over {
            .caption__Bold();
            color: @orange;

            .info-tooltip {
              top: 3px;
              left: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
