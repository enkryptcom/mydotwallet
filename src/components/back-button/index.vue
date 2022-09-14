<template>
  <a class="back-button" @click="action()">
    <back-arrow />
  </a>
</template>

<script setup lang="ts">
import BackArrow from "@/icons/common/back-arrow.vue";
defineProps({
  action: {
    type: Function,
    default: () => ({}),
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.back-button {
  padding: 4px;
  .sizing();
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;
  .transition(background, 0.3s);
  display: block;
  position: absolute;
  left: -4px;
  top: 50%;
  margin-top: -16px;
  font-size: 0;

  &:hover {
    background: @gray004;
  }

  &:active {
    background: @gray002;
  }
}
</style>
