<template>
  <a
    class="select-list-item"
    :class="{ first: isSelected, image: isListImage }"
    @click="select"
  >
    <img v-if="isSelected || isListImage" :src="item.image" />
    <span :class="{ first: isSelected }">{{ item.name }}</span>
    <arrow-down v-if="isSelected" />
  </a>
</template>

<script setup lang="ts">
import ArrowDown from "@/icons/common/arrow-down.vue";
import { SelectItem } from "@/types/select-list";
import { PropType } from "vue";

const emit = defineEmits<{
  (e: "update:select", item: SelectItem): void;
}>();

const props = defineProps({
  item: {
    type: Object as PropType<SelectItem>,
    default: () => ({}),
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isListImage: {
    type: Boolean,
    default: false,
  },
});

const select = () => {
  emit("update:select", props.item);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.select-list-item {
  padding: 12px 12px 12px 44px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  position: relative;

  &:before {
    content: "";
    width: calc(~"100% - 44px");
    height: 1px;
    background: @gray01;
    position: absolute;
    left: 44px;
    top: 0;
  }

  &.first {
    padding-left: 12px;

    &:before {
      display: none;
    }
  }

  &.image {
    padding-left: 12px;
  }

  img {
    width: 24px;
    margin-right: 8px;
  }

  span {
    .body1__Regular();
    color: @primaryLabel;
    display: block;
    margin-right: 8px;

    &.first {
      .body1__Meduim();
    }
  }
}
</style>
