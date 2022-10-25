<template>
  <header class="container-fluid header__wrap">
    <div class="row justify-content-between align-items-center header">
      <div class="col-3"><logo /></div>
      <div class="col-4 row justify-content-end">
        <div class="header__menu" :class="{ scroll: isScroll }">
          <select-list
            :select="network"
            :items="selectNetworkItems"
            :is-list-image="true"
            @update:select="selectNetworkAction"
          />
          <wallet-select />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from "vue";
import Logo from "@/icons/common/logo.vue";
import SelectList from "@/components/select-list/index.vue";
import WalletSelect from "@/components/wallet-select/index.vue";
import { selectNetwork, selectNetworkItems } from "@/types/mock";
import { SelectItem, NetworkSelectItem } from "@/types/select-list";
import {
  selectedNetwork,
  apiPromise,
  accounts,
  clearNativeBalances,
} from "@/stores";
import { useGetNativePrice } from "@/libs/prices";
import { useGetNativeBalances } from "@/libs/balances";

const isScroll = ref<boolean>(false);
const network = ref<SelectItem>(selectNetwork);

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

watch([apiPromise, accounts], () => {
  clearNativeBalances;
  useGetNativeBalances();
  useGetNativePrice();
});

const onScroll = () => {
  if (window.scrollY > 22) {
    if (isScroll.value == false) isScroll.value = true;
  } else {
    if (isScroll.value == true) isScroll.value = false;
  }
};

const selectNetworkAction = async (item: NetworkSelectItem) => {
  const api = await apiPromise.value;
  await api.disconnect();
  network.value = item;
  selectedNetwork.value = item.id;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.header {
  height: 96px;

  &__wrap {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
  }

  &__menu {
    padding: 4px;
    border-radius: 32px;
    display: flex;
    flex-direction: row;
    margin-right: -4px;
    & > .select-list {
      margin-left: 16px;

      &:first-child {
        margin-left: 0;
      }
    }

    &.scroll {
      background: @white;
      box-shadow: @shadow16;
    }

    .screen-sm({
      display: none;
    });
  }
}
</style>
