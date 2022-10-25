<template>
  <div class="buttons-block">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.buttons-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 32px 32px;
  width: calc(~"100% + 32px");
  background-color: @white;
  box-sizing: border-box;
  margin: 0 0 -16px -16px;
  border-radius: 0 0 20px 20px;
}
</style>
