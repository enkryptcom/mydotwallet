<template>
  <div class="white-wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.white-wrapper {
  background: @white;
  box-shadow: @shadow100;
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
}
</style>
