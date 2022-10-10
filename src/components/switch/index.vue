<template>
  <label class="switch">
    <input type="checkbox" :checked="isChecked" @change="checkLocal($event)" />
    <span class="slider round" />
  </label>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "update:check", isChecked: boolean): void;
}>();
defineProps({
  isChecked: Boolean,
});
const checkLocal = (e: any) => {
  emit("update:check", e.target.checked);
};
</script>

<style lang="less">
@import "@/assets/styles/theme.less";
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 2px solid @secondaryLabel;
  box-sizing: border-box;
}
.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: @secondaryLabel;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: @accent;
  border-color: @accent;
}
input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
  background-color: @white;
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 2px;
}
/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
