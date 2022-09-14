<template>
  <div class="modal-wrapper">
    <div class="modal-wrapper__overlay"></div>
    <div class="modal-wrapper__content">
      <div class="modal-wrapper__header">
        <h3>{{ title }}</h3>
        <a class="modal-wrapper__header-close" @click="close"><close-icon /></a>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseIcon from "@/icons/common/close-icon.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  title: {
    type: String,
    default: "",
  },
});

const close = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.modal-wrapper {
  position: fixed;
  z-index: 101;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;

  &__overlay {
    background-color: @gray032;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 102;
  }

  &__content {
    background: @white;
    box-shadow: @shadow100;
    border-radius: 20px;
    padding: 16px 32px;
    box-sizing: border-box;
    position: relative;
    z-index: 103;
    width: 560px;
  }

  &__header {
    position: relative;

    h3 {
      .headline5__Bold();
      color: @primaryLabel;
      margin: 0 0 16px 0;
    }

    &-close {
      padding: 4px;
      .sizing();
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
      .transition(background, 0.3s);
      display: block;
      position: absolute;
      right: -20px;
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
  }
}
</style>
