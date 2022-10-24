<template>
  <div class="stake-amount-input" :class="{ error: isError }">
    <h4>I want to invest</h4>
    <div class="stake-amount-input__wrapper">
      <input
        ref="inputRef"
        v-model="textValue"
        type="text"
        class="stake-amount-input__input"
        :placeholder="`0 ${token.symbol.toLocaleUpperCase()}`"
        :style="{ width: size + 'ch' }"
      />
      <span v-show="props.value != '0'" @click="focus">{{ token.symbol }}</span>
    </div>

    <p v-if="props.value == '0'" class="stake-amount-input__fiat">
      {{ $filters.currencyFormat(0, "USD") }}
    </p>
    <p v-else class="stake-amount-input__fiat">
      ~{{ $filters.currencyFormat(amountUsd, "USD") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, ComponentPublicInstance } from "vue";
import { Token } from "@/types/token";

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
});

const emit = defineEmits(["update:amount"]);

const amountUsd = computed(() => {
  return props.token.price.times(props.value).toNumber();
});

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

.stake-amount-input {
  width: calc(~"100% - 28px");
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 12px 16px 12px 16px;
  border: 1px solid @gray01;
  border-radius: 16px;
  margin-right: 28px;

  &.error {
    border: 1px solid @error;
  }

  h4 {
    .caption__Regular();
    color: @secondaryLabel;
    margin: 0 0 4px 0;
  }

  &__wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    span {
      .headline6__Bold();
      color: @primaryLabel;
      font-variant: small-caps;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 4px;
    }
  }

  &__input {
    width: auto;
    .headline6__Bold();
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
    .body2__Regular();
    color: @secondaryLabel;
    margin: 0;
  }
}
</style>
