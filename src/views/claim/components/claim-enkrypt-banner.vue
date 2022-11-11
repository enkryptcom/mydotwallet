<template>
  <div class="claim-enkrypt-banner">
    <expand
      class="claim-enkrypt-banner__arrow"
      :class="{ open: isOpen }"
      @click="toggle"
    />
    <h4 v-show="!isOpen" @click="toggle">I Don't have Polkadot Wallet</h4>
    <div v-show="isOpen" class="claim-enkrypt-banner__content">
      <h3>Create one in Enkrypt chrome extension</h3>
      <p>
        Enkrypt is a wallet extension that allows you to use all networks. Most
        popular ones, like Ethereum and Polkadot with its Parachains are already
        built in.
      </p>
      <base-button
        :title="`Get on ${browserName} web store`"
        :action="action"
      />
      <img
        class="claim-enkrypt-banner__image"
        src="@/assets/pic/enkrypt.png"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base-button/index.vue";
import Expand from "@/icons/common/expand.vue";
import { ref } from "vue";
import { getBrowserName, extensionUrl } from "@/utils/browser";

const isOpen = ref<boolean>(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const action = () => {
  window.open(extensionUrl[browserName], "_blank");
};

const browserName = getBrowserName();
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim-enkrypt-banner {
  box-sizing: border-box;
  position: relative;
  padding: 0 16px;
  .transition(all, 0.3s);

  &__arrow {
    position: absolute;
    top: 2px;
    right: 16px;
    cursor: pointer;
    .transition(all, 0.3s);

    &.open {
      .rotate(90deg);
    }
  }

  h4 {
    .headline6__Bold();
    color: @primaryLabel;
    margin: 0;
    cursor: pointer;
  }

  &__content {
    padding: 16px 0 16px 0;
  }

  h3 {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }

  p {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0 0 16px 0;
    padding-right: 32.4%;
  }

  &__image {
    width: 34.405%;
    position: absolute;
    right: -28px;
    bottom: -24px;
    filter: drop-shadow(0px 28.9091px 11.4545px rgba(0, 0, 0, 0.01))
      drop-shadow(0px 16.3636px 9.81818px rgba(0, 0, 0, 0.05))
      drop-shadow(0px 7.09091px 7.09091px rgba(0, 0, 0, 0.09))
      drop-shadow(0px 1.63636px 3.81818px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.1));
  }
}
</style>
