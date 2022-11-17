<template>
  <white-wrapper class="stake__wrap">
    <h2 class="stake__title">Stake DOT and earn rewards</h2>
    <div class="stake__block stake__block--start">
      <stake-start-image />
      <h3>
        You can earn rewards by bonding assets and then nominating your
        validators.
      </h3>
      <more-link title="Learn more about how it works" :action="moreAction" />
    </div>
    <div class="stake__calculate">
      <div class="stake__calculate-header">
        <h4>Calculate investments</h4>
        <info-tooltip :text="periodInfo" />
        <base-select
          :options="periodOptions"
          :selected="period"
          @toggle:select="selectPeriod"
        />
      </div>
      <div class="row justify-content-start">
        <div class="col-6">
          <stake-amount-input
            :token="nativeToken"
            :value="String(amount)"
            @update:amount="inputAmount"
          />
        </div>
        <div class="col-6">
          <div class="stake__calculate-items">
            <div class="stake__calculate-block">
              <h6>Estimated Returns</h6>
              <h5>
                {{
                  estimatedReturn
                    ? $filters.cryptoCurrencyFormat(estimatedReturn)
                    : "--"
                }}<span>{{ nativeToken.symbol }}</span>
              </h5>
              <p>~{{ $filters.currencyFormat(estimatedReturnUsd, "USD") }}</p>
            </div>
            <div class="stake__calculate-block">
              <h6>Estimated Yield</h6>
              <h5>
                {{
                  estimatedYield
                    ? $filters.cryptoCurrencyFormat(estimatedYield * 100)
                    : "--"
                }}
                %
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <buttons-block :is-space="true">
      <div class="stake__lock">
        <Switch :is-checked="isCompounding" @update:check="updateCompounding" />
        <p>Lock rewards for compounding?</p>
        <info-tooltip :text="rewardsInfo" />
      </div>
      <base-button title="Start staking" :action="nextAction" :send="true" />
    </buttons-block>
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
import StakeAmountInput from "./stake-amount-input.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { apiPromise, nativeToken, stakingWizardOptions } from "@/stores";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { periodOptions, periodToNumberOfDays } from "@/types/staking";
import { getLastEraReward } from "@/utils/staking";

const router = useRouter();

const amount = ref<number>(0);
const period = ref<BaseSelectItem>(periodOptions[0]);
const lastEraReward = ref<number>(0);
const isCompounding = ref<boolean>(true);

const rewardsInfo =
  "If you choose not to lock your rewards, then your newly minted rewards will be transferrable by default. However, this would mean lower earnings over longer period of time.";
const periodInfo =
  "Time period is only used for estimating returns. It doesn’t affect the unbonding period of approximately 28 days.";

onMounted(async () => {
  useGetNativeBalances();
  useGetNativePrice();
  updateRewardCalculation();
  loadPreviousStakingOptions();
});

const estimatedYield = computed(() => {
  const numberOfDays = periodToNumberOfDays(period.value.id);

  return isCompounding.value
    ? Math.pow(1 + lastEraReward.value, numberOfDays) - 1
    : lastEraReward.value * numberOfDays;
});

const estimatedReturn = computed(() => {
  return estimatedYield.value * amount.value;
});

const estimatedReturnUsd = computed(() => {
  return nativeToken.value.price.times(estimatedReturn.value).toNumber();
});

const loadPreviousStakingOptions = () => {
  isCompounding.value = stakingWizardOptions.value.isCompounding;
  if (stakingWizardOptions.value.amount) {
    amount.value = stakingWizardOptions.value.amount;
  }
  const searchPeriod = periodOptions.find(
    (item) => item.id === stakingWizardOptions.value?.period
  );
  if (searchPeriod) {
    period.value = searchPeriod;
  }
};

const updateRewardCalculation = async () => {
  const api = await apiPromise.value;
  lastEraReward.value = await getLastEraReward(api);
};

const updateCompounding = (newValue: boolean) => {
  isCompounding.value = newValue;
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};

const nextAction = () => {
  stakingWizardOptions.value = {
    isCompounding: isCompounding.value,
    period: period.value.id,
    amount: amount.value,
  };
  router.push({
    name: "stake-enter-amount",
  });
};

const moreAction = () => {
  console.log("moreAction");
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
      span {
        text-transform: uppercase;
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
}
</style>
