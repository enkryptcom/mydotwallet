<template>
  <div class="amount-input" :class="{ error: isError }">
    <img :src="token.image" class="amount-input__icon" />
    <base-button
      :stroke="true"
      class="amount-input__max"
      :class="{ error: !hasEnoughBalance }"
      title="Max"
      :small="true"
      @click="setMaxValue"
    />
    <div class="amount-input__wrapper">
      <input
        ref="inputRef"
        v-model="amountValue"
        type="number"
        class="amount-input__input"
        placeholder="0"
        :class="{ error: !hasEnoughBalance }"
        :style="{ width: size + 'ch' }"
      />
      <span v-show="props.value != '0'" @click="focus">{{ token.symbol }}</span>
    </div>

    <p v-if="props.value" class="amount-input__fiat">
      ~{{ $filters.currencyFormat(amountInFiat, "USD") }}
    </p>
    <p v-else class="amount-input__fiat">
      {{ $filters.currencyFormat(0, "USD") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, ComponentPublicInstance } from "vue";
import { Token } from "@/types/token";
import BaseButton from "@/components/base-button/index.vue";
import { nativeToken } from "@/stores";
import BigNumber from "bignumber.js";

const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>();
defineExpose({ inputRef });

const props = defineProps({
  token: {
    type: Object as PropType<Token>,
    default: nativeToken,
  },
  hasEnoughBalance: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: "",
  },
  maxValue: {
    type: Object as PropType<BigNumber>,
    default: new BigNumber(0),
  },
});

const emit = defineEmits(["update:amount"]);

const setMaxValue = () => {
  emit("update:amount", props.maxValue);
};

const amountValue = computed({
  get: () => props.value,
  set: (value) => {
    emit("update:amount", value ? new BigNumber(value).toFixed() : "");
  },
});
const size = computed(() => {
  return amountValue.value.length == 0 ? 70 : amountValue.value.length;
});

const amountInFiat = computed(() => {
  return new BigNumber(props.value || 0).times(props.token.price);
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

    &[type="number"]::-webkit-outer-spin-button,
    &[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      -moz-appearance: textfield;
    }

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

  .error {
    color: @error !important;
  }
}
</style>
