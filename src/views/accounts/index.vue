<template>
  <enkrypt-banner />
  <white-wrapper>
    <accounts-balance />
    <accounts-item
      v-for="(item, index) in accounts"
      :key="index"
      :account="item"
      :is-last="index == accounts.length - 1"
    ></accounts-item>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import EnkryptBanner from "@/components/enkrypt-banner/index.vue";
import AccountsBalance from "./components/accounts-balance.vue";
import AccountsItem from "./components/accounts-item.vue";
import { accounts } from "@/types/mock";
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
