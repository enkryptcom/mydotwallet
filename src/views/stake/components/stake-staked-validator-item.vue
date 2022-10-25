<template>
  <div class="stake-staked-validator-item">
    <div class="stake-staked-validator-item__block">
      <div class="stake-staked-validator-item__info">
        <img src="@/assets/pic/account1.png" alt="" />
        <div class="stake-staked-validator-item__info-block">
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
    <div class="stake-staked-validator-item__block">
      <span>Active</span>
    </div>
    <div class="stake-staked-validator-item__block">
      <span>{{ validator.commission.toFixed(2) }}%</span>
    </div>
    <div class="stake-staked-validator-item__block">
      <span
        >{{ $filters.cryptoCurrencyFormat(validator.total || 0) }}
        {{ nativeToken.symbol.toLocaleUpperCase() }}</span
      >
    </div>
    <div class="stake-staked-validator-item__block">
      <span
        >{{ $filters.cryptoCurrencyFormat(approxBondedAmount || 0) }}
        {{ nativeToken.symbol.toLocaleUpperCase() }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import { Validator } from "@/types/staking";
import { nativeToken } from "@/stores";

const overInfo =
  "Oversubscribed info will be credited to your bonded balance for compound earning.";

defineProps({
  validator: {
    type: Object as PropType<Validator>,
    default: null,
  },
  approxBondedAmount: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-staked-validator-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0 2px 0;
  height: 44px;
  .sizing();
  cursor: pointer;

  &__block {
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

    span {
      .body2__Regular();
      color: @primaryLabel;

      &.red {
        color: @error;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;

    img {
      width: 32px;
      height: 32px;
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
