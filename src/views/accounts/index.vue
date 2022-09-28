<template>
  <enkrypt-banner />
  <white-wrapper>
    <accounts-balance :balance="totalBalance" :token="nativeToken" />
    <accounts-item
      v-for="(item, index) in accounts"
      :key="index"
      :account="item"
      :balance="nativeBalances[item.address]"
      :token="nativeToken"
      :is-last="index == accounts.length - 1"
    ></accounts-item>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import EnkryptBanner from "@/components/enkrypt-banner/index.vue";
import AccountsBalance from "./components/accounts-balance.vue";
import AccountsItem from "./components/accounts-item.vue";
import { accounts, apiPromise, nativeBalances, nativeToken } from "@/stores";
import { useGetNativeBalances } from "@/libs/balances";
import { computed, watch } from "vue";
import { useGetNativePrice } from "@/libs/prices";

watch([accounts, apiPromise], () => {
  useGetNativeBalances();
  useGetNativePrice();
});

const totalBalance = computed(() => {
  return Object.values(nativeBalances.value).reduce(
    (previous, current) => previous + Number(current?.total || 0),
    0
  );
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
