<template>
  <div
    ref="dropdownRef"
    class="dropdown-wrapper"
    :style="{ maxHeight: height + 'px' }"
  >
    <custom-scrollbar
      ref="dropdownScrollRef"
      class="dropdown-wrapper__scroll-area"
      :style="{ maxHeight: height - 16 + 'px' }"
    >
      <div class="dropdown-wrapper__wrap"><slot></slot></div>
    </custom-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, ref, onMounted, onUnmounted } from "vue";
import CustomScrollbar from "@/components/custom-scrollbar/index.vue";

const dropdownScrollRef = ref<ComponentPublicInstance<HTMLElement>>();
const dropdownRef = ref<ComponentPublicInstance<HTMLElement>>();
const height = ref<number>(0);

defineExpose({ dropdownScrollRef, dropdownRef });

onMounted(() => {
  window.addEventListener("resize", onResize);
  setTimeout(() => {
    onResize();
  }, 100);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  if (dropdownRef.value) {
    const topOffset = (dropdownRef.value as HTMLElement).getBoundingClientRect()
      .top;
    const windowHeight = window.screen.height;
    const bottomOffset = 32;

    height.value = windowHeight - (topOffset + bottomOffset);
  }
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.dropdown-wrapper {
  background: @white;
  box-shadow: @shadow20;
  border-radius: 16px;
  padding: 6px 0;
  .sizing();
  position: absolute;
  width: 100%;
  left: 0;
  top: calc(~"100% + 1px");
  z-index: 1;

  &__wrap {
    padding: 10px 0;
  }

  &__scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding-right: 0 !important;
  }
}
</style>
