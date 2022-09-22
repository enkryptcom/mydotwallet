<template>
  <div class="amount-input" :class="{ error: isError }">
    <img :src="token.image" class="amount-input__icon" />
    <base-button
      :stroke="true"
      class="amount-input__max"
      title="Max"
      :small="true"
      @click="setMaxValue"
    />
    <div class="amount-input__wrapper">
      <input
        ref="inputRef"
        v-model="textValue"
        type="text"
        class="amount-input__input"
        placeholder="0 DOT"
        :style="{ width: size + 'ch' }"
      />
      <span v-show="props.value != '0'" @click="focus">{{ token.symbol }}</span>
    </div>

    <p v-if="props.value == '0'" class="amount-input__fiat">
      {{ $filters.currencyFormat(0, "USD") }}
    </p>
    <p v-else class="amount-input__fiat">
      ~{{ $filters.currencyFormat(3.1, "USD") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, ComponentPublicInstance } from "vue";
import { Token } from "@/types/token";
import BaseButton from "@/components/base-button/index.vue";

const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>();
defineExpose({ inputRef });

const props = defineProps({
  token: {
    type: Object as PropType<Token>,
    default: null,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
  maxValue: {
    type: String,
    default: "0",
  },
});

const emit = defineEmits(["update:amount"]);

const setMaxValue = () => {
  emit("update:amount", props.maxValue);
};

const textValue = computed({
  get: () => (props.value != "0" ? props.value.replace(/[^0-9.-]+/g, "") : ""),
  set: (value) => emit("update:amount", value.replace(/[^0-9.-]+/g, "")),
});

const size = computed(() => {
  return textValue.value.length == 0 ? 70 : textValue.value.length;
});

const focus = () => {
  if (inputRef.value) inputRef.value.focus();
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.amount-input {
  width: 100%;
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 12px 82px 12px 60px;
  border: 1px solid @gray01;
  border-radius: 16px;
  margin-bottom: 16px;

  &.error {
    border: 1px solid @error;
  }

  &__wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    span {
      .headline4__Regular();
      color: @primaryLabel;
      font-variant: small-caps;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 4px;
    }
  }

  &__input {
    width: auto;
    .headline4__Regular();
    color: @primaryLabel;
    border: 0 none;
    outline: none;
    padding: 0;
    margin-bottom: 4px;
    max-width: 100%;

    &::placeholder {
      color: @tertiaryLabel;
    }
  }

  &__icon {
    position: absolute;
    box-shadow: @shadowIcon;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    left: 16px;
    top: 16px;
  }

  &__max {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  &__fiat {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @tertiaryLabel;
    margin: 0;
  }
}
</style>
