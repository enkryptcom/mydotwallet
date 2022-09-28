<template>
  <div class="stake-confirm-validator-item">
    <div class="stake-confirm-validator-item__info">
      <img src="@/assets/pic/account1.png" alt="" />
      <div class="stake-confirm-validator-item__info-block">
        <h3>
          {{ validator.name }}
          <span
            v-if="validator.isHightRisk"
            :class="{ empty: validator.name == '' }"
          >
            High risk
          </span>
        </h3>
        <p>{{ validator.address }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Validator } from "@/types/validator";

defineProps({
  validator: {
    type: Object as PropType<Validator>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-validator-item {
  margin-left: -44px;
  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;

    img {
      width: 32px;
      margin-right: 12px;
      border-radius: 100%;
      box-shadow: @shadowIcon;
    }

    &-block {
      h3 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0;

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

          &.empty {
            margin-left: 0;
          }
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
</style>
