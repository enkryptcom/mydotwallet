<template>
  <white-wrapper v-if="!isSend" class="send-verify__wrap">
    <div class="send-verify__header">
      <back-button :action="back" />
      <h1 class="send-verify__title">Verify transaction</h1>
    </div>
    <p class="send-verify__description">
      Double check the information and confirm transaction.
    </p>
    <div class="send-verify__block">
      <div class="send-verify__block-item">
        <send-verify-item :account="fromAccount" title="From" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-item :account="toAccount" title="To" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-amount :token="token" :amount="amount" />
      </div>
      <div class="send-verify__block-item">
        <send-verify-fee />
      </div>
    </div>
    <send-error />
    <buttons-block>
      <base-button title="Confirm and send" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="send-verify__wrap">
    <send-verify-success />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import SendError from "../send-transaction/components/send-error.vue";
import SendVerifyItem from "./components/send-verify-item.vue";
import SendVerifyAmount from "./components/send-verify-amount.vue";
import SendVerifyFee from "./components/send-verify-fee.vue";
import SendVerifySuccess from "./components/send-verify-success.vue";

import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { accounts, recent } from "@/types/mock";
import { dot } from "@/types/tokens";

const router = useRouter();

const fromAccount = ref<Account>(accounts[0]);
const toAccount = ref<Account>(recent[1]);
const amount = ref<number>(10.5);
const token = ref<Token>(dot);
const isSend = ref<boolean>(false);

const nextAction = () => {
  isSend.value = true;
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.send-verify {
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
  &__description {
    .body1__Regular();
    margin: 0 0 16px 0;
    color: @secondaryLabel;
    padding-left: 60px;
    .sizing();
  }
  &__block {
    background: @gray002;
    border-radius: 16px;
    .sizing();

    &-item {
      position: relative;

      &::after {
        content: "";
        width: calc(~"100% - 60px");
        height: 1px;
        background-color: @gray01;
        position: absolute;
        right: 0;
        bottom: 0;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
