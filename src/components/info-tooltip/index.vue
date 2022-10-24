<template>
  <div class="info-tooltip" @mouseenter="onHover" @mouseleave="onHide">
    <info-icon />
    <div v-show="show" class="info-tooltip__text" :class="classObject()">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoIcon from "@/icons/common/info-icon.vue";
import { ref } from "vue";

const show = ref(false);
const visible = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

defineProps({
  text: {
    type: String,
    default: "",
  },
});

const onHover = () => {
  if (timeout != null) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    if (!show.value) {
      show.value = true;
      setTimeout(() => {
        visible.value = true;
      }, 50);
    }
  }, 300);
};
const onHide = () => {
  if (timeout != null) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (visible.value) {
    visible.value = false;
    setTimeout(() => {
      show.value = false;
    }, 200);
  } else {
    visible.value = false;
    show.value = false;
  }
};
const classObject = () => {
  return { normal: true, visible: visible.value };
};
</script>

<style lang="less">
@import "@/assets/styles/theme.less";
.info-tooltip {
  display: inline-block;
  position: relative;
  font-size: 0;
  top: 1px;

  &__text {
    position: absolute;
    bottom: 25px;
    left: 50%;
    margin-left: -128px;
    padding: 8px 12px;
    position: absolute;
    width: 256px;
    background: @surfaceTetriary;
    border-radius: 8px;
    .sizing();
    .caption__Regular();
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    .transition(opacity, 300ms);
    opacity: 0;

    &.visible {
      opacity: 1;
    }
  }
}
</style>
