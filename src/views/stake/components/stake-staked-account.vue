<template>
  <div class="stake-staked-account">
    <div class="stake-staked-account__item">
      <div class="stake-staked-account__item-info">
        <img :src="account?.image" alt="" />
        <div class="stake-staked-account__item-block">
          <h3>
            {{ account?.name }}
            <span v-if="account?.isLedger">Ledger</span>
          </h3>
          <p>
            {{ $filters.replaceWithEllipsis(account?.address, 6, 6) }}
          </p>
        </div>
      </div>
      <div class="stake-staked-account__item-action">
        <div class="stake-staked-account__item-action-info">
          Unbond to withdraw funds
          <info-tooltip :text="unbondInfo" />
        </div>
        <base-button
          title="Unbond"
          :stroke="true"
          :small="true"
          :action="unbondAction"
        />
        <base-button
          title="Withdraw"
          subtitle="800 DOT"
          :stroke="true"
          :small="true"
          :action="withdrawAction"
        />
      </div>
    </div>
    <div class="stake-staked-account__stats">
      <div class="stake-staked-account__stats-block">
        <p>Total staked</p>
        <div class="stake-staked-account__stats-block-amount">
          <h5>{{ $filters.cryptoCurrencyFormat(1000) }} <span>dot</span></h5>
          <h6>{{ $filters.currencyFormat(7945.24, "USD") }}</h6>
        </div>
      </div>
      <div class="stake-staked-account__stats-block">
        <p>Overall earnings</p>
        <div class="stake-staked-account__stats-block-amount">
          <h5>{{ $filters.cryptoCurrencyFormat(1.473) }} <span>dot</span></h5>
          <h6>{{ $filters.currencyFormat(8.24, "USD") }}</h6>
        </div>
      </div>
      <div class="stake-staked-account__stats-block">
        <p>Overall yield</p>
        <div class="stake-staked-account__stats-block-amount">
          <h5>{{ $filters.cryptoCurrencyFormat(1.46) }}%</h5>
        </div>
      </div>
    </div>
    <div class="stake-staked-account__validators-toggle" @click="toggle">
      Show 4 validators
      <expand :class="{ open: isOpen }" />
    </div>
    <div v-show="isOpen" class="stake-staked-account__validators-list">
      <stake-staked-validators :validators="selectValidators" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base-button/index.vue";
import Expand from "@/icons/common/expand.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import StakeStakedValidators from "./stake-staked-validators.vue";
import { ref, PropType } from "vue";
import { Account } from "@/types/account";
import { selectValidators } from "@/types/mock";
import { useRouter } from "vue-router";

const router = useRouter();

const isOpen = ref<boolean>(false);
const unbondInfo =
  "Oversubscribed info will be credited to your bonded balance for compound earning.";

defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const unbondAction = () => {
  router.push({ name: "stake-unbound" });
};

const withdrawAction = () => {
  router.push({ name: "stake-withdraw" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-staked-account {
  position: relative;
  padding-left: 48px;

  &__item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    position: relative;

    img {
      width: 32px;
      height: 32px;
      border-radius: 100%;
      margin-right: 12px;
      box-shadow: @shadowIcon;
      position: absolute;
      left: -48px;
      top: 50%;
      margin-top: -16px;
    }

    &-block {
      h3 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0 0 4px 0;
        position: relative;

        span {
          padding: 0px 6px;
          height: 18px;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 20px;
          font-style: normal;
          font-weight: 700;
          font-size: 10px;
          line-height: 18px;
          color: @secondaryLabel;
          position: relative;
          margin: 0 0 0 6px;
          display: inline-block;
          top: -2px;
        }
      }

      p {
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

      &-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        letter-spacing: 0.25px;
        color: @secondaryLabel;
        .caption__Regular();

        .info-tooltip {
          margin-left: 5px;
          top: 4px;
        }
      }

      .base-button {
        margin-left: 16px;
      }
    }
  }

  &__stats {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    position: relative;

    &-block {
      margin: 0 24px 0 0;
      text-align: left;

      &:last-child {
        margin: 0;
      }

      p {
        .caption__Regular();
        letter-spacing: 0.25px;
        color: @secondaryLabel;
        margin: 0 0 4px 0;
      }
      h5 {
        .body2__Medium();
        color: @primaryLabel;
        margin: 0;

        span {
          text-transform: uppercase;
        }
      }
      h6 {
        .body2__Regular();
        color: @secondaryLabel;
        margin: 0 0 0 8px;
      }

      &-amount {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }

  &__validators {
    &-toggle {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .body2__Medium();
      color: @primaryLabel;
      height: 45px;
      cursor: pointer;

      svg {
        margin-left: 4px;
        .transition(all, 0.3s);

        &.open {
          .rotate(90deg);
        }
      }
    }
    &-list {
      padding: 4px 0 0 0;
    }
  }
}
</style>
