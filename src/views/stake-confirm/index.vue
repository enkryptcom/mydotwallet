<template>
  <white-wrapper v-if="!isSend" class="stake-confirm__wrap">
    <div class="stake-confirm__header">
      <back-button :action="back" />
      <h1 class="stake-confirm__title">Review and confirm</h1>
    </div>
    <p class="stake-confirm__description">
      You will be locking your funds for staking. Double check the information
      and confirm transaction.
    </p>

    <div class="stake-confirm__block">
      <div class="stake-confirm__block-item">
        <stake-confirm-account :account="fromAccount" title="From" />
      </div>
      <div class="stake-confirm__block-item">
        <stake-confirm-amount :token="token" :amount="amount" />
      </div>
      <div
        ref="blockRef"
        class="stake-confirm__block-item"
        :style="{ maxHeight: height + 'px', minHeight: height + 'px' }"
      >
        <custom-scrollbar
          ref="blockScrollRef"
          class="stake-confirm__scroll-area"
          :style="{ maxHeight: height + 'px' }"
        >
          <stake-confirm-validators />
        </custom-scrollbar>
      </div>
      <div class="stake-confirm__block-item">
        <stake-confirm-fee />
      </div>
    </div>

    <buttons-block>
      <base-button title="Stake 1000 DOT" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else class="stake-confirm__wrap">
    <stake-confirm-process :is-done="isSendDone" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import StakeConfirmAmount from "./components/stake-confirm-amount.vue";
import StakeConfirmAccount from "./components/stake-confirm-account.vue";
import StakeConfirmFee from "./components/stake-confirm-fee.vue";
import StakeConfirmValidators from "./components/stake-confirm-validators.vue";
import StakeConfirmProcess from "./components/stake-confirm-process.vue";
import CustomScrollbar from "@/components/custom-scrollbar/index.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ComponentPublicInstance, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { accounts } from "@/types/mock";
import { dot } from "@/types/tokens";

const router = useRouter();

const blockScrollRef = ref<ComponentPublicInstance<HTMLElement>>();
const blockRef = ref<ComponentPublicInstance<HTMLElement>>();
const height = ref<number>(0);

const fromAccount = ref<Account>(accounts[0]);
const amount = ref<number>(1000);
const token = ref<Token>(dot);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);

defineExpose({ blockScrollRef, blockRef });

onMounted(() => {
  window.addEventListener("resize", onResize);
  setTimeout(() => {
    onResize();
  }, 100);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  if (blockRef.value) {
    const topOffset = (blockRef.value as HTMLElement).getBoundingClientRect()
      .top;
    const windowHeight = window.screen.height;
    const bottom = 68;
    const top = 96;

    height.value = windowHeight - (topOffset + bottom + top);
  }
};

const nextAction = () => {
  isSend.value = true;
  setTimeout(() => {
    isSendDone.value = true;
  }, 3000);
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
  &__description {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0 0 16px 0;
    padding: 0 60px;
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
