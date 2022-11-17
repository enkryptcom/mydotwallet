<template>
  <white-wrapper class="crowdloan__wrap">
    <buttons-block :is-space="true">
      <h2 class="crowdloan__title">Crowdloan</h2>
      <select-list
        :select="selectedAccount"
        :items="selectAccountItems"
        :is-list-image="true"
        @update:select="selectAccountAction"
      />
    </buttons-block>

    <h4 class="crowdloan__label">Ongoing</h4>

    <div class="crowdloan__header">
      <div class="crowdloan__header-item">Parachain</div>
      <div class="crowdloan__header-item">
        Raised {{ nativeToken.symbol.toLocaleUpperCase() }}
      </div>
      <div class="crowdloan__header-item">Liquidity Tokens</div>
      <div class="crowdloan__header-item">My contribution</div>
    </div>

    <div v-if="isLoading" class="crowdloan__loading">
      <spinner-animation />
    </div>
    <crowdloan-item
      v-for="(item, index) in ongoing"
      v-else
      :key="index"
      :item="item"
      :address="selectedAccount?.address"
    />

    <h4 class="crowdloan__label inner">Completed</h4>

    <div v-if="isLoading" class="crowdloan__loading">
      <spinner-animation />
    </div>
    <crowdloan-item
      v-for="(item, index) in completed"
      v-else
      :key="index"
      :item="item"
      :address="selectedAccount?.address"
    />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import CrowdloanItem from "./components/crowdloan-item.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import SelectList from "@/components/select-list/index.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import { computed, onMounted, ref, watch } from "vue";
import { getCrowdloanItems } from "@/utils/crowdloan";
import { accounts, apiPromise, nativeToken, selectedNetwork } from "@/stores";
import { CrowdloanInfo } from "@/types/crowdloan";
import { AccountSelectItem, SelectItem } from "@/types/select-list";

const ongoing = ref<Array<CrowdloanInfo>>([]);
const completed = ref<Array<CrowdloanInfo>>([]);
const selectedAccount = ref<AccountSelectItem>();
const isLoading = ref(false);

onMounted(async () => {
  if (accounts.value.length) {
    selectedAccount.value = selectAccountItems.value[0];
    loadCrowdloanData();
  }
});

watch([selectedNetwork], () => {
  loadCrowdloanData();
});

const loadCrowdloanData = async () => {
  if (!isLoading.value) {
    isLoading.value = true;
    const api = await apiPromise.value;
    const [active, ended] = await getCrowdloanItems(api);
    ongoing.value = active;
    completed.value = ended;
    isLoading.value = false;
  }
};

const selectAccountAction = (item: SelectItem): void => {
  selectedAccount.value = item as AccountSelectItem;
};

const selectAccountItems = computed<AccountSelectItem[]>(() => {
  return accounts.value.map(
    (item) =>
      ({
        id: item.id,
        name: item.name,
        image: item.image,
        address: item.address,
      } as AccountSelectItem)
  );
});

watch(
  selectAccountItems,
  () => {
    if (selectAccountItems.value.length) {
      selectedAccount.value = selectAccountItems.value[0];
    }
    loadCrowdloanData();
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
.crowdloan {
  &__wrap {
    padding: 16px 32px;
    margin-left: -4px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__label {
    .body1__Bold();
    color: @primaryLabel;
    margin: 0;

    &.inner {
      margin: 24px 0 0 0;
    }
  }
  &__loading {
    padding: 48px 0 48px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &__header {
    padding: 8px 0;
    .sizing();
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    &-item {
      .caption__Regular();
      color: @secondaryLabel;
      margin: 0;
      letter-spacing: 0.25px;

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
    }
  }
}
</style>
