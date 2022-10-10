<template>
  <white-wrapper class="stake__wrap">
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--start">
      <stake-start-image />
      <h3>
        You can earn rewards by bonding assets and then nominating your
        validators.
      </h3>
      <more-link title="Lear more about how it works" :action="moreAction" />
    </div>
    <div class="stake__calculate">
      <div class="stake__calculate-header">
        <h4>Calculate investments</h4>
        <info-tooltip :text="periodInfo" />
        <base-select
          :options="periodOptions"
          :selected="period"
          @update:toggle="selectPeriod"
        />
      </div>
      <div class="row justify-content-start">
        <div class="col-6">
          <stake-amount-input
            :token="token"
            :value="String(amount)"
            @update:amount="inputAmount"
          />
        </div>
        <div class="col-6">
          <div class="stake__calculate-items">
            <div class="stake__calculate-block">
              <h6>Estimated Returns</h6>
              <h5>
                {{ $filters.cryptoCurrencyFormat(140.738) }} <span>dot</span>
              </h5>
              <p>~$980.37</p>
            </div>
            <div class="stake__calculate-block">
              <h6>Estimated Yield</h6>
              <h5>14.27%</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <buttons-block :is-space="true">
      <div class="stake__lock">
        <Switch />
        <p>Lock rewards for compounding?</p>
        <info-tooltip :text="rewardsInfo" />
      </div>
      <base-button title="Start staking" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>

  <white-wrapper
    class="stake__wrap"
    :style="{
      marginTop: '32px',
    }"
  >
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--staked">
      <stake-staked-overview :totat="1000" :overall="1.473" :yield="14.46" />
      <base-button title="Stake more" :action="stakeMoreAction" />
    </div>

    <div class="stake__staked-list">
      <stake-staked-account :account="accounts[1]" />
    </div>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import StakeStartImage from "@/icons/stake/stake-start-image.vue";
import MoreLink from "@/components/more-link/index.vue";
import Switch from "@/components/switch/index.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import BaseSelect from "@/components/base-select/index.vue";
import { BaseSelectItem } from "@/types/base-select";
import StakeAmountInput from "./components/stake-amount-input.vue";
import StakeStakedOverview from "./components/stake-staked-overview.vue";
import StakeStakedAccount from "./components/stake-staked-account.vue";
import { useRouter } from "vue-router";
import { dot, accounts } from "@/types/mock";
import { Token } from "@/types/token";
import { ref } from "vue";

const router = useRouter();

const token = ref<Token>(dot);
const amount = ref<number>(0);
const period = ref<BaseSelectItem>({
  id: 0,
  name: "for 12 months",
});

const rewardsInfo =
  "If you choose not to lock your rewards, then your newly minted rewards will be transferrable by default. However, this would mean lower earnings over longer period of time.";
const periodInfo =
  "Time period is only used for estimating returns. It doesn’t affect the unbonding period of approximately 28 days.";

const periodOptions = [
  {
    id: 0,
    name: "for 12 months",
  },
  {
    id: 1,
    name: "for 6 months",
  },
  {
    id: 3,
    name: "for 3 months",
  },
  {
    id: 4,
    name: "for 1 month",
  },
];

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};

const nextAction = () => {
  router.push({ name: "stake-enter-amount" });
};

const moreAction = () => {
  console.log("moreAction");
};

const stakeMoreAction = () => {
  router.push({ name: "stake-enter-amount" });
};

const selectPeriod = (item: BaseSelectItem) => {
  period.value = item;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake {
  &__wrap {
    padding: 16px 32px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__block {
    padding: 24px 64px;
    margin: 0 0 24px 0;
    background: @gray002;
    border-radius: 16px;

    &--start {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h3 {
        text-align: center;
        .headline6__Bold();
        color: @primaryLabel;
        margin: 16px 0 2px 0;
        padding: 0 8px;
      }
    }

    &--staked {
      padding: 16px 44px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }
  }
  &__calculate {
    &-header {
      margin: 0 0 10px 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      h4 {
        .body1__Bold();
        color: @primaryLabel;
        margin: 0;
      }

      .info-tooltip {
        margin: 0 16px 0 12px;
      }
    }
    &-items {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      text-align: center;
      padding-left: 4px;
      .sizing();
      text-align: left;
      height: 98px;
    }
    &-block {
      text-align: left;
      width: 50%;
      padding-top: 12px;
      h6 {
        .caption__Regular();
        color: @secondaryLabel;
        letter-spacing: 0.25px;
        margin: 0 0 4px 0;
      }
      h5 {
        .headline6__Bold();
        letter-spacing: 0.15px;
        color: @primaryLabel;
        margin: 0 0 4px 0;
      }
      p {
        .body2__Regular();
        color: @secondaryLabel;
        letter-spacing: 0.25px;
        margin: 0;
      }
    }
  }
  &__lock {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    p {
      .body2__Regular();
      margin: 0 8px;
      color: @primaryLabel;
    }
  }
  &__staked-list {
    padding: 8px 0 16px 0;
  }
}
</style>
