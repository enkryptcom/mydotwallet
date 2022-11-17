<template>
  <div class="select-list">
    <a ref="toggle" class="select-list__block" @click="toggleAction">
      <img :src="select.image" />
      <span v-if="!isMinify">{{ select.name }}</span>
      <arrow-down />
    </a>
    <div v-show="isOpen" ref="dropdown" class="select-list__dropdown">
      <select-list-item
        :item="select"
        :is-selected="true"
        :is-list-image="isListImage"
        @update:select="toggleAction"
      ></select-list-item>
      <select-list-item
        v-for="(item, index) in listItems"
        :key="index"
        :item="item"
        :is-list-image="isListImage"
        @update:select="selectItem"
      ></select-list-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDown from "@/icons/common/arrow-down.vue";
import { SelectItem } from "@/types/select-list";
import SelectListItem from "./components/select-list-item.vue";
import { PropType, ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";

const isOpen = ref<boolean>(false);
const dropdown = ref(null);
const toggle = ref(null);

defineExpose({ isOpen });

const emit = defineEmits<{
  (e: "update:select", asset: SelectItem): void;
}>();

const props = defineProps({
  items: {
    type: Object as PropType<Array<SelectItem>>,
    default: () => ({}),
  },
  select: {
    type: Object as PropType<SelectItem>,
    default: () => ({}),
  },
  isMinify: {
    type: Boolean,
    default: false,
  },
  isListImage: {
    type: Boolean,
    default: false,
  },
});

const listItems = computed<Array<SelectItem>>(() => {
  if (!props.items.length) return [];
  return props.items.filter((item) => item.id !== props.select.id);
});

const toggleAction = () => {
  isOpen.value = !isOpen.value;
};
const selectItem = (item: SelectItem) => {
  emit("update:select", item);
  toggleAction();
};
onClickOutside(
  dropdown,
  () => {
    if (isOpen.value) isOpen.value = false;
  },
  { ignore: [toggle] }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.select-list {
  position: relative;

  &__block {
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 24px;
    height: 48px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    img {
      width: 24px;
      margin-right: 8px;
    }

    span {
      .body1__Meduim();
      color: @primaryLabel;
      display: block;
      margin-right: 8px;
    }
  }

  &__dropdown {
    position: absolute;
    left: 1px;
    top: 0;
    background: @white;
    box-shadow: @shadow16;
    border-radius: 24px;
    min-width: calc(~"100% - 2px");
    z-index: 2;
  }
}
</style>
