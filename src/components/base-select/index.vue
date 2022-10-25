<template>
  <label class="base-select">
    <select @change="onChange">
      <option
        v-for="(item, index) in options"
        :key="index"
        :selected="item.id == selected.id"
        :value="item.id"
      >
        {{ item.name }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { BaseSelectItem } from "@/types/base-select";
import { PropType } from "vue";
const emit = defineEmits<{
  (e: "toggle:select", account: BaseSelectItem): void;
}>();
const props = defineProps({
  selected: {
    type: Object as PropType<BaseSelectItem>,
    default: null,
  },
  options: {
    type: Object as PropType<Array<BaseSelectItem>>,
    default: () => ({}),
  },
});

const onChange = (event: any) => {
  const item = props.options.filter((item) => item.id == event.target.value);
  emit("toggle:select", item[0]);
};
</script>

<style lang="less">
@import "@/assets/styles/theme.less";

.base-select {
  select {
    .sizing();
    outline: none;
    cursor: pointer;
    display: block;
    .body2__Medium();
    color: @primaryLabel;
    padding: 2px 24px 2px 0;
    margin: 0;
    border: 0 none;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 9.5L12 14.5L7 9.5' stroke='black' stroke-opacity='0.56' stroke-width='2'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0 top 0;
    width: auto;
  }
}
</style>
