<template>
  <a class="more-link" @click="action()">
    {{ title }}
    <chevron-small-right />
  </a>
</template>

<script setup lang="ts">
import ChevronSmallRight from "@/icons/common/chevron-small-right.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  action: {
    type: Function,
    default: () => ({}),
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.more-link {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  .body2__Regular();
  color: @secondaryLabel;
  position: relative;
  padding-right: 24px;
  .transition(color, 0.3s);

  svg {
    display: inline-block;
    position: relative;
    top: -2px;
    position: absolute;
    right: 0;
    .transition(opacity, 0.3s);
    opacity: 0.56;
  }

  &:hover {
    color: @primaryLabel;

    svg {
      opacity: 0.96;
    }
  }

  &:active {
    color: @tertiaryLabel;

    svg {
      opacity: 0.32;
    }
  }
}
</style>
