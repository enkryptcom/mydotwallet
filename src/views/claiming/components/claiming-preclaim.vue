<template>
  <div class="claiming-preclaim">
    <h4>Selected address has a preclaim</h4>
    <p>Will redeem preclaimed amount</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  preclaimAddress: {
    type: String,
    default: "",
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claiming-preclaim {
  width: 100%;
  display: block;
  margin: 16px 0 16px 0;
  padding: 16px 64px 16px 64px;
  background-color: @success;
  border-radius: 16px;
  .sizing();
  position: relative;
  text-align: center;

  h4 {
    .headline6__Bold();
    color: @primaryLabel;
    margin: 0;
  }

  p {
    .body2__Regular();
    color: @secondaryLabel;
    margin: 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
