<template>
  <div class="claim-invalid-account">
    <h2>Nothing to claim</h2>
    <p>
      Looks like there is no claim associated with this address.<br />
      Please check the address or try a different one.
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim-invalid-account {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(95, 99, 104, 0.2);
  border-radius: 10px;
  margin-bottom: 16px;
  background-color: #f2f4f7;

  h2 {
    .body1__Bold();
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }

  p {
    .body1__Regular();
    color: @primaryLabel;
    margin: 0;
  }
}
</style>
