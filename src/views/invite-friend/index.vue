<template>
  <modal-wrapper title="Send invite to your friend">
    <div class="invite-friend__textarea">
      Hey! You should check out *Polkadapp*. It is an easy to use and secure
      Polkadot dapp with the most useful features.<br />*polkadapp.com*
      <a class="invite-friend__copy" @click="copy"><copy-icon /></a>
    </div>
  </modal-wrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "@/components/modal-wrapper/index.vue";
import CopyIcon from "@/icons/common/copy-icon.vue";

const copy = () => {
  navigator.clipboard.writeText(
    "Hey! You should check out *Polkadapp*. It is an easy to use and secure Polkadot dapp with the most useful features. *polkadapp.com*"
  );
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.invite-friend {
  &__textarea {
    padding: 16px 56px 16px 16px;
    border: 1px solid @gray01;
    border-radius: 16px;
    background-color: @white;
    width: 100%;
    resize: none;
    .body1__Regular();
    color: @secondaryLabel;
    height: auto;
    position: relative;
    outline: none;
  }
  &__copy {
    opacity: 1;
    .transition(opacity, 0.3s);
    position: absolute;
    right: 16px;
    top: 50%;
    margin-top: -12px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
}
</style>
