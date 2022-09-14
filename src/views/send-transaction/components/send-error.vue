<template>
  <div class="send-error">
    <alert-icon />
    <p>
      If you send this transaction your balance will drop below the Existential
      Limit of 1 DOT. This will cause your remaining balance to drop to 0 DOT.
    </p>
    <p><a href="#">What is Existential Limit?</a></p>
  </div>
</template>

<script setup lang="ts">
import AlertIcon from "@/icons/common/alert-icon.vue";
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.send-error {
  width: 100%;
  display: block;
  margin: 16px 0 0 0;
  background: @error01;
  padding: 12px 16px 12px 60px;
  border-radius: 16px;
  .sizing();
  position: relative;

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    margin-top: -16px;
  }

  p {
    .body2__Regular();
    color: @error;
    margin: 0 0 12px 0;

    &:last-child {
      margin-bottom: 0;
    }

    a {
      color: @error;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
