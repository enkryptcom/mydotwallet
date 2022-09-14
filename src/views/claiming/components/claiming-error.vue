<template>
  <div class="claiming-error">
    <h4>Nothing to claim.</h4>
    <p>
      Please double check that you have signed the transaction correctly on the
      correct ETH account.
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claiming-error {
  width: 100%;
  display: block;
  margin: 16px 0 16px 0;
  background: @error01;
  padding: 16px 64px 16px 64px;
  border-radius: 16px;
  .sizing();
  position: relative;
  text-align: center;

  h4 {
    .headline6__Bold();
    color: @error;
    margin: 0;
  }

  p {
    .body2__Regular();
    color: @error;
    margin: 0;

    &:last-child {
      margin-bottom: 0;
    }

    a {
      color: @error;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
