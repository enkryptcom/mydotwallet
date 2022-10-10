<template>
  <div class="buttons-block" :class="{ space: isSpace, border: isBorder }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isSpace: {
    type: Boolean,
    default: false,
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.buttons-block {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 32px 32px;
  width: calc(~"100% + 64px");
  background-color: @white;
  box-sizing: border-box;
  margin: 0 0 -32px -32px;
  border-radius: 0 0 20px 20px;

  &.space {
    justify-content: space-between;
  }

  &.border {
    box-shadow: @shadow2;
  }
}
</style>
