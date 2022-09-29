<template>
  <div class="crowdloan-item">
    <div class="crowdloan-item__block">
      <div class="crowdloan-item__info">
        <img :src="item.image" alt="" />
        <div class="crowdloan-item__info-block">
          <h3>
            {{ item.name }}
          </h3>
        </div>
      </div>
    </div>
    <div class="crowdloan-item__block">
      <span>{{ item.percent }}%</span>
    </div>
    <div class="crowdloan-item__block">
      <span>{{ item.tokens }}</span>
    </div>
    <div class="crowdloan-item__block">
      <span>-</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { CrowdloanItem } from "@/types/crowdloan";

defineProps({
  item: {
    type: Object as PropType<CrowdloanItem>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.crowdloan-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 8px 0;
  height: 52px;
  .sizing();
  cursor: pointer;

  &__block {
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
      min-width: 27.9%;
      text-align: right;
    }

    span {
      .body2__Regular();
      color: @primaryLabel;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 52px;

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
</style>
