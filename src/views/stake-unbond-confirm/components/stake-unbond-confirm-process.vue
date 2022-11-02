<template>
  <div v-if="isDone" class="stake-unbound-confirm-process">
    <done-animation />
    <h3>You have successfully<br />unbonded your assets</h3>
    <base-button title="View details" :action="detailsAction" />
  </div>
  <div v-else-if="isError" class="stake-unbound-confirm-process">
    <error-animation />
    <h3>Something went wrong with your transaction</h3>
    <base-button title="Try again" :action="errorAction" />
  </div>
  <div v-else class="stake-unbound-confirm-process">
    <spinner-animation />
    <h3>Your transaction is<br />on the way</h3>
    <p>Awaiting confirmation...</p>
  </div>
</template>

<script setup lang="ts">
import DoneAnimation from "@/icons/animation/done.vue";
import ErrorAnimation from "@/icons/animation/error.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  isDone: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
});

const detailsAction = () => {
  router.push("stake");
};

const errorAction = () => {
  router.push("stake");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-unbound-confirm-process {
  padding: 48px 0 48px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h3 {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 16px 0;
    text-align: center;
  }

  p {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0;
    text-align: center;
  }

  .base-button {
    margin: 32px 0 0 0;
  }
}
</style>
