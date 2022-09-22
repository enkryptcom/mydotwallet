<template>
  <white-wrapper class="stake-confirm__wrap">
    <div class="stake-confirm__header">
      <back-button :action="back" />
      <h1 class="stake-confirm__title">Review and confirm</h1>
    </div>

    <buttons-block>
      <base-button title="Stake 1000 DOT" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot, accounts } from "@/types/mock";

const router = useRouter();

const fromAccount = ref<Account>(accounts[0]);
const amount = ref<number>(1000);
const token = ref<Token>(dot);

const nextAction = () => {
  router.push({ name: "stake-nominate" });
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm {
  &__wrap {
    padding: 16px 32px;
  }
  &__header {
    position: relative;
  }
  &__title {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding-left: 60px;
    .sizing();
  }
}
</style>
