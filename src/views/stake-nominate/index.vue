<template>
  <white-wrapper class="stake-nominate__wrap">
    <div class="stake-nominate__header">
      <back-button :action="back" />
      <h1 class="stake-nominate__title">Nominate validators</h1>

      <stake-nominate-header-info
        :amount="amount"
        :returns="estimatedReturn"
        :yield="estimatedYield * 100"
      />
    </div>

    <stake-nominate-controls
      :is-high-risk="isHighRisk"
      :is-only-selected="isOnlySelected"
      @update:high-risk="highRiskSwitch"
      @update:only-selected="onlySelectedSwitch"
      @update:sort="updateSort"
    />

    <div class="stake-nominate__table-header">
      <div class="stake-nominate__table-item">Validator</div>
      <div class="stake-nominate__table-item">Commission</div>
      <div class="stake-nominate__table-item">Total stake</div>
      <div class="stake-nominate__table-item">Estimated returns</div>
      <div class="stake-nominate__table-item"></div>
    </div>

    <div
      ref="blockRef"
      class="stake-nominate__table-block"
      :style="{ maxHeight: height + 'px', minHeight: height + 'px' }"
    >
      <custom-scrollbar
        ref="blockScrollRef"
        class="stake-nominate__scroll-area"
        :style="{ maxHeight: height + 'px' }"
      >
        <stake-nominate-item
          v-for="(item, index) in sortedAndFiltered"
          :key="index"
          :amount-to-stake="amount"
          :validator="item"
          :yield="estimatedYield"
          @update:select-validator="selectValidator"
          @update:delete-validator="deleteValidator"
          @update:sort="updateSort"
        />
      </custom-scrollbar>
    </div>

    <buttons-block :is-border="true">
      <div class="stake-nominate__count">
        <p class="stake-nominate__count-all">
          Choose up to {{ validators.length }} validators.
        </p>
        <p class="stake-nominate__count-select">
          {{ selectedValidators.length }} selected
        </p>
      </div>
      <base-button title="Continue" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import StakeNominateHeaderInfo from "./components/stake-nominate-header-info.vue";
import StakeNominateControls from "./components/stake-nominate-controls.vue";
import StakeNominateItem from "./components/stake-nominate-item.vue";
import CustomScrollbar from "@/components/custom-scrollbar/index.vue";
import { BaseSelectItem } from "@/types/base-select";
import {
  ComponentPublicInstance,
  ref,
  onMounted,
  onUnmounted,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import {
  periodOptions,
  periodToNumberOfDays,
  Validator,
} from "@/types/staking";
import { useGetNativeBalances } from "@/libs/balances";
import {
  DeriveStakingElected,
  DeriveStakingWaiting,
} from "@polkadot/api-derive/types";
import { apiPromise, stakingWizardOptions } from "@/stores";
import {
  extractNominatorList,
  extractValidatorData,
  getLastEraReward,
} from "@/utils/staking";

const router = useRouter();

const isHighRisk = ref<boolean>(false);
const isOnlySelected = ref<boolean>(false);

const blockScrollRef = ref<ComponentPublicInstance<HTMLElement>>();
const blockRef = ref<ComponentPublicInstance<HTMLElement>>();
const height = ref<number>(0);
const validators = ref<Array<Validator>>([]);
const selectedValidators = ref<Array<Validator>>([]);

const sortType = ref<number>(0);
const amount = ref<number>(0);
const isCompounding = ref<boolean>(true);
const periodNumberOfDays = ref<number>(365);
const lastEraReward = ref<number>(0);

defineExpose({ blockScrollRef, blockRef });

onMounted(() => {
  window.addEventListener("resize", onResize);
  setTimeout(() => {
    onResize();
  }, 100);

  useGetNativeBalances();
  loadPreviousStakingOptions();
  loadValidators();
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  if (blockRef.value) {
    const topOffset = (blockRef.value as HTMLElement).getBoundingClientRect()
      .top;
    const windowHeight = window.screen.height;
    const bottom = 24;
    const top = 96;

    height.value = windowHeight - (topOffset + bottom + top);
  }
};

const nextAction = () => {
  stakingWizardOptions.value = {
    ...stakingWizardOptions.value,
    validators: selectedValidators.value,
  };
  router.push({ name: "stake-confirm" });
};

const back = () => {
  router.go(-1);
};

const loadPreviousStakingOptions = () => {
  isCompounding.value = stakingWizardOptions.value.isCompounding;
  const searchPeriod = periodOptions.find(
    (item) => item.id === stakingWizardOptions.value?.period
  );
  if (searchPeriod) {
    periodNumberOfDays.value = periodToNumberOfDays(searchPeriod.id);
  }
  if (
    !stakingWizardOptions.value.amount ||
    !stakingWizardOptions.value.fromAccount
  ) {
    router.replace({
      name: "stake-enter-amount",
    });
    return;
  }
  amount.value = stakingWizardOptions.value.amount;
};

const loadValidators = async () => {
  const api = await apiPromise.value;

  lastEraReward.value = await getLastEraReward(api);
  const electedInfo: DeriveStakingElected =
    await api.derive.staking.electedInfo({
      withController: true,
      withExposure: true,
      withPrefs: true,
    });
  const waitingInfo: DeriveStakingWaiting =
    await api.derive.staking.waitingInfo({
      withController: true,
      withPrefs: true,
    });

  const nominatorList = await extractNominatorList(api);
  const [elected] = await extractValidatorData(
    api,
    [],
    electedInfo,
    nominatorList
  );
  const [waiting] = await extractValidatorData(
    api,
    [],
    waitingInfo,
    nominatorList
  );

  validators.value = elected.concat(waiting);
};

const sortedAndFiltered = computed(() => {
  // Apply filters
  let finalResult = isOnlySelected.value
    ? selectedValidators.value
    : validators.value;

  if (isHighRisk.value) {
    finalResult = finalResult.filter((item) => {
      return !isHighRisk.value || !item.isHighRisk;
    });
  }

  // Apply sorting
  finalResult.sort((a, b) => {
    if (sortType.value === 0) {
      return a.commission - b.commission;
    } else {
      return a.name ? (b.name ? a.name.localeCompare(b.name) : -1) : 1;
    }
  });
  return finalResult;
});

const estimatedYield = computed(() => {
  return isCompounding.value
    ? Math.pow(1 + lastEraReward.value, periodNumberOfDays.value) - 1
    : lastEraReward.value * periodNumberOfDays.value;
});

const estimatedReturn = computed(() => {
  return estimatedYield.value * amount.value;
});

const highRiskSwitch = (isChecked: boolean) => {
  isHighRisk.value = isChecked;
};

const onlySelectedSwitch = (isChecked: boolean) => {
  isOnlySelected.value = isChecked;
};

const selectValidator = (validator: Validator) => {
  selectedValidators.value.push(validator);
};

const deleteValidator = (validator: Validator) => {
  for (var i = selectedValidators.value.length; i--; ) {
    if (selectedValidators.value[i].id === validator.id)
      selectedValidators.value.splice(i, 1);
  }
};

const updateSort = (item: BaseSelectItem) => {
  sortType.value = item.id;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-nominate {
  &__wrap {
    padding: 16px 32px;
    width: 126.4%;
    margin-left: -4px;
    .sizing();

    .screen-lg({
        width: 120%;
    });
  }
  &__header {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 16px 0;
    height: 32px;
  }
  &__title {
    .headline5__Bold();
    color: @primaryLabel;
    padding-left: 60px;
    margin: 0;
    .sizing();
  }
  &__table {
    &-header {
      width: calc(~"100% + 64px");
      margin: 0 0 0 -32px;
      box-shadow: 0px 2.4px 2px -2px @gray02;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 8px 32px;
      .sizing();

      .stake-nominate__table-item {
        .caption__Regular();
        letter-spacing: 0.25px;
        color: @secondaryLabel;
      }
    }
    &-block {
      width: calc(~"100% + 64px");
      margin: 0 0 0 -32px;
    }
    &-item {
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
    }
  }

  &__count {
    text-align: right;
    margin-right: 32px;

    &-all {
      .body2__Regular();
      color: @secondaryLabel;
      margin: 0;
    }

    &-select {
      .body2__Medium();
      color: @accent;
      margin: 0;
    }
  }

  &__scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding-right: 0 !important;
  }
}
</style>
