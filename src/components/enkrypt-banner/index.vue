<template>
  <div
    v-show="extension?.name != 'enkrypt'"
    v-if="isLeft"
    class="enkrypt-banner left"
  >
    <enkrypt-logo-white />
    <h3>Multi-chain web3 extension.</h3>
    <p>
      Use Ethereum and Polkadot networks with its Parachains in single wallet.
    </p>
    <base-button title="Get extenion" :small="true" :action="action" />
  </div>
  <div v-show="extension?.name != 'enkrypt'" v-else class="enkrypt-banner">
    <h3>Enkrypt: multi-chain web3 extension.</h3>
    <p>
      Enkrypt is a wallet extension that allows you to use all networks. Most
      popular ones, like Ethereum and Polkadot with its Parachains are already
      built in.
    </p>
    <base-button title="Get on Chrome web store" :action="action" />
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base-button/index.vue";
import EnkryptLogoWhite from "@/icons/common/enkrypt-logo-white.vue";
import { extension } from "@/stores";

defineProps({
  isLeft: {
    type: Boolean,
    default: false,
  },
});

const action = () => {
  console.log("Get on Chrome web store");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.enkrypt-banner {
  background: url("@/assets/img/top-gradient.jpeg");
  background-color: @bannerBg;
  box-shadow: @shadow100;
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  isolation: isolate;
  margin-bottom: 16px;

  h3 {
    .headline5__Bold();
    color: @white;
    margin: 0;
  }

  p {
    .body2__Regular();
    color: @white;
    letter-spacing: 0.25px;
    margin: 0 0 12px 0;
    opacity: 0.8;
    padding-right: 30%;
  }

  &.left {
    width: 100%;
    max-width: 200px;
    min-width: 140px;
    padding: 12px;
    border-radius: 16px;

    svg {
      display: block;
      max-width: 100%;
      margin: 0 0 13px 0;
    }

    h3 {
      .body1__Bold();
      margin: 0 0 8px 0;
    }

    p {
      .caption__Regular();
      padding-right: 0;
    }
  }
}
</style>
