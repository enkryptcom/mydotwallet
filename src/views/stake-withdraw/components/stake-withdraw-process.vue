<template>
  <div class="stake-withdraw-process">
    <done-animation v-if="isDone" />
    <spinner-animation v-else />

    <h3 v-if="isDone">You have successfully<br />whithdew your assets</h3>
    <h3 v-else>Your transaction is<br />on the way</h3>
    <p v-if="!isDone">Awaiting confirmation...</p>

    <base-button v-if="isDone" title="View details" :action="detailsAction" />
  </div>
</template>

<script setup lang="ts">
import DoneAnimation from "@/icons/animation/done.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import BaseButton from "@/components/base-button/index.vue";

defineProps({
  isDone: {
    type: Boolean,
    default: false,
  },
});

const detailsAction = () => {
  console.log("detailsAction");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-withdraw-process {
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
