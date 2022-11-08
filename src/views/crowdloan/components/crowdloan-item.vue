<template>
  <div class="crowdloan-item">
    <div class="crowdloan-item__block">
      <a class="crowdloan-item__info" :href="item.link" target="_blank">
        <img :src="item.image" alt="" />
        <div class="crowdloan-item__info-block">
          <h3>
            {{ item.name }}
          </h3>
          <link-icon class="crowdloan-item__info-block-link" />
        </div>
      </a>
    </div>
    <div class="crowdloan-item__block">
      <div class="crowdloan-item__block-info">
        <p class="crowdloan-item__block-info-amount">
          <b>{{ item.percent.toFixed(2) }} %</b>
          {{ $filters.formatCompactNumber(item.amount) }} of
          {{ $filters.formatCompactNumber(item.cap) }}
        </p>
        <p class="crowdloan-item__block-info-count">
          {{ item.contributions }} contributions
        </p>
      </div>
    </div>
    <div class="crowdloan-item__block">
      <span>{{ item.tokens }}</span>
    </div>
    <div class="crowdloan-item__block">
      <div v-if="item.isContribute" class="crowdloan-item__block-action">
        <p class="crowdloan-item__block-action-timer">Ending in<b>3d 11h</b></p>
        <base-button
          title="Contribute"
          :small="true"
          :action="contributeAction"
        />
      </div>
      <span v-else>—</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { CrowdloanInfo } from "@/types/crowdloan";
import BaseButton from "@/components/base-button/index.vue";
import LinkIcon from "@/icons/common/link-icon.vue";
import { useRouter } from "vue-router";
import { selectedCrowdloan } from "@/stores";

const router = useRouter();

const props = defineProps({
  item: {
    type: Object as PropType<CrowdloanInfo>,
    default: null,
  },
});

const contributeAction = () => {
  selectedCrowdloan.value = props.item;
  router.push({ name: "crowdloan-contribute" });
};
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
      min-width: 26.44%;
      text-align: right;
    }

    span {
      .body2__Regular();
      color: @primaryLabel;
    }

    &-info {
      &-amount {
        .body2__Regular();
        color: @primaryLabel;
        margin: 0 0 3px 0;

        b {
          .body2__Bold();
        }
      }
      &-count {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0;
      }
    }

    &-action {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      &-timer {
        margin-right: 16px;
        .caption__Regular();
        color: @primaryLabel;

        b {
          display: block;
          .caption__Bold();
          color: @accent;
          margin: 3px 0 0 0;
        }
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 52px;
    text-decoration: none;
    cursor: pointer;

    img {
      width: 32px;
      margin-right: 16px;
      border-radius: 100%;
      box-shadow: @shadowIcon;
    }

    &-block {
      position: relative;

      &-link {
        position: absolute;
        right: -20px;
        top: 2.5px;
        opacity: 0;
        .transition(opacity, 0.3s);
      }

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

    &:hover {
      .crowdloan-item__info-block-link {
        opacity: 1;
      }
    }
  }
}
</style>
