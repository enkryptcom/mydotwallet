<template>
  <div class="send-verify-success">
    <success-icon />
    <h3>Your transaction is<br />on the way</h3>
    <p>It should arrive in the next few minutes.</p>

    <div class="send-verify-success__buttons">
      <base-button title="Invite friend" :action="inviteAction" />
      <base-button title="Got it" :stroke="true" :action="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SuccessIcon from "@/icons/send/success-icon.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const inviteAction = () => {
  router.push({ name: "invite" });
};

const close = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.send-verify-success {
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
    margin: 0 0 32px 0;
    text-align: center;
  }

  &__buttons {
    .base-button {
      margin: 0 8px;
    }
  }
}
</style>
