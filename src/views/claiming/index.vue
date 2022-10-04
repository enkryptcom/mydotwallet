<template>
  <white-wrapper v-if="!isSend" class="claiming__wrap">
    <div class="claiming__header">
      <back-button :action="back" />
    </div>
    <h2 class="claiming__title">Claiming</h2>
    <claiming-amount :token="nativeToken" :amount="claimable.toNumber()" />
    <h3 class="claiming__sub-title">Select your Polkadot account</h3>
    <select-account-input
      :account="myAccount"
      :accounts="accounts"
      :amount="claimable.toNumber()"
      :is-amount="true"
      :token="nativeToken"
      title="Claim to account"
      @update:select="selectMyAccount"
    />
    <claiming-preclaim
      v-if="preclaimedAddress"
      :preclaim-address="preclaimedAddress"
    />
    <h3 class="claiming__sub-title">Sign message with your Ethereum address</h3>
    <claim-address-input
      :account="ethAccount"
      :value="ethAddress"
      @update:address="addressInput"
    />
    <h4 class="claiming__third-title">
      1. Copy the following string and sign it with the Ethereum account you
      used during the pre-sale:
    </h4>
    <div class="claiming__textarea">
      {{ messagePart1 }}<br />{{ messagePart2 }}
      <a class="claiming__copy" @click="copy"><copy-icon /></a>
    </div>
    <h4 class="claiming__third-title">
      2. Paste the signed message into the field below:
    </h4>
    <textarea
      v-model="signedMessage"
      class="claiming__textarea claiming__textarea--paste"
      placeholder="Paste here"
    ></textarea>
    <claiming-error v-if="isError" />
    <buttons-block>
      <base-button
        :title="buttonTitle"
        :action="nextAction"
        :send="true"
        :disabled="isEthLoading || isMyAccountLoading || !signature || !isValid"
      />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else>
    <claiming-success :token="nativeToken" :amount="claimable.toNumber()" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import CopyIcon from "@/icons/common/copy-icon.vue";
import ClaimAddressInput from "../claim/components/claim-address-input.vue";
import ClaimingAmount from "./components/claiming-amount.vue";
import ClaimingError from "./components/claiming-error.vue";
import ClaimingSuccess from "./components/claiming-success.vue";
import { Account } from "@/types/account";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeToken,
  selectedNetwork,
  signer,
  walletSelected,
} from "@/stores";
import { isAddress } from "web3-utils";
import createIcon from "@/libs/identicon/ethereum";
import type { Option } from "@polkadot/types";
import type { BalanceOf, StatementKind } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";
import { fromBase } from "@/utils/units";
import { BN_ZERO } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import { Buffer } from "buffer";
import { Network } from "@/types/network";
import ClaimingPreclaim from "./components/claiming-preclaim.vue";

const router = useRouter();
const route = useRoute();

const myAccount = ref<Account>();
const isMyAccountLoading = ref<boolean>(false);
const preclaimedAddress = ref<string>();
const signedMessage = ref<string>("");
const isSend = ref<boolean>(false);
const isError = ref<boolean>(false);

const ethAccount = ref<Account>();
const ethAddress = ref<string>("");
const isValid = ref<boolean>(false);
const isEthLoading = ref<boolean>(false);
const claimable = ref<BigNumber>(new BigNumber(0));

onMounted(() => {
  const trimmed = route.query.ethAddress?.toString().trim() || "";
  ethAddress.value = trimmed;
  const isValidAddress = isAddress(trimmed);

  if (!isValidAddress || walletSelected.value.id === 1) {
    router.push({ name: "claim" });
    return;
  }

  addressInput(trimmed);
});

watch(myAccount, async () => {
  if (myAccount.value) {
    try {
      isMyAccountLoading.value = true;
      const api = await apiPromise.value;
      // Get preclaim address info
      if (api.query.claims.preclaims) {
        const preclaims = await api.query.claims.preclaims<Option<BalanceOf>>(
          myAccount.value.address
        );
        const result = preclaims.unwrapOr(null);
        preclaimedAddress.value = result ? result.toString() : undefined;
      }

      isMyAccountLoading.value = false;
    } catch (err) {
      console.error(
        "Unexpected error when querying if account has preclaims",
        err
      );
      isMyAccountLoading.value = false;
    }
  }
});

watch(ethAccount, async () => {
  if (ethAccount.value) {
    try {
      isEthLoading.value = true;
      const api = await apiPromise.value;

      // Get claimable amount info
      const claims = await api.query.claims.claims<Option<BalanceOf>>(
        ethAccount.value.address
      );
      claimable.value = new BigNumber(
        fromBase(
          claims.unwrapOr(BN_ZERO).toString(),
          nativeToken.value.decimals
        )
      );
      isValid.value = claimable.value.gt(0);

      isEthLoading.value = false;
    } catch (err) {
      console.error(
        "Unexpected error when querying if account has claimable balance",
        err
      );
      isEthLoading.value = false;
    }
  }
});

const nextAction = async () => {
  if (!myAccount.value || !ethAccount.value) {
    return;
  }

  try {
    isError.value = false;
    const api = await apiPromise.value;
    const statement =
      "I hereby agree to the terms of the statement whose SHA-256 multihash is Qmc1XYqT6S39WNp2UeiRUrZichUWUPpGEThDE6dAb3f6Ny. (This may be found at the URL: https://statement.polkadot.network/regular.html)";

    if (preclaimedAddress.value) {
      const unsubscribe = await api.tx.claims.attest(statement).signAndSend(
        myAccount.value.address,
        {
          signer: signer.value,
          nonce: -1,
        },
        async (result) => {
          if (!result || !result.status) {
            return;
          }

          if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === "system")
              .forEach(({ event: { method } }): void => {
                if (method === "ExtrinsicFailed") {
                  // Handle error
                } else if (method === "ExtrinsicSuccess") {
                  // Handle succes
                }
              });
          } else if (result.isError) {
            // Handle error
          }

          if (result.isCompleted) {
            unsubscribe();
          }
        }
      );
    } else {
      // Check if it is claim only or claim and attest
      const typeRes = await api.query.claims.signing<Option<StatementKind>>(
        ethAccount.value.address
      );
      const claimOnly = !typeRes.unwrapOr(null) || !api.tx.claims.claimAttest;
      const transaction = claimOnly
        ? api.tx.claims.claim(myAccount.value.address, signature.value)
        : api.tx.claims.claimAttest(
            myAccount.value.address,
            signature.value,
            statement
          );

      const unsubscribe = await transaction.send(async (result) => {
        if (!result || !result.status) {
          return;
        }

        if (result.status.isFinalized || result.status.isInBlock) {
          result.events
            .filter(({ event: { section } }) => section === "system")
            .forEach(({ event: { method } }): void => {
              if (method === "ExtrinsicFailed") {
                // Handle error
              } else if (method === "ExtrinsicSuccess") {
                // Handle succes
              }
            });
        } else if (result.isError) {
          // Handle error
        }

        if (result.isCompleted) {
          unsubscribe();
        }
      });
    }

    isSend.value = true;
  } catch (err) {
    console.log("Unexpected error when trying to claim", err);
    isError.value = true;
  }
};

const back = () => {
  router.go(-1);
};

const selectMyAccount = (account: Account) => {
  myAccount.value = account;
};

const addressInput = (newVal: string) => {
  const trimmed = newVal.trim();
  ethAddress.value = trimmed;
  const isValidAddress = isAddress(trimmed);
  ethAccount.value = isValidAddress
    ? {
        id: Number.MAX_SAFE_INTEGER,
        name: "",
        image: createIcon(trimmed),
        address: trimmed,
        isLedger: false,
      }
    : undefined;
};

const copy = () => {
  navigator.clipboard.writeText(messagePart1.value + messagePart2.value);
};

const buttonTitle = computed(() => {
  let title = "Claim ";
  title += claimable.value;
  title += " " + nativeToken.value.symbol.toLocaleUpperCase();

  return title;
});

const messagePart1 = computed(
  () =>
    `Pay ${nativeToken.value.symbol.toLocaleUpperCase()}s to the ${
      Network[selectedNetwork.value]
    } account:`
);

const messagePart2 = computed(() => {
  if (!myAccount.value?.address) {
    return "";
  }

  const decoded = decodeAddress(myAccount.value.address);
  const stringFormatted = Buffer.from(decoded).toString("hex");
  return stringFormatted;
});
const signature = computed(() => {
  try {
    const { sig } = JSON.parse(signedMessage.value || "");

    return sig;
  } catch (err) {
    console.warn("Could not extract signature from signed message", err);
    return undefined;
  }
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claiming {
  &__wrap {
    padding: 16px 32px;
  }
  &__header {
    position: relative;
    height: 32px;
    margin-bottom: 16px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }
  &__sub-title {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
  }
  &__third-title {
    .body1__Regular();
    color: @primaryLabel;
    margin: 16px 0 8px 0;
    padding-right: 21%;
  }
  &__textarea {
    padding: 16px;
    border: 1px solid @gray01;
    border-radius: 16px;
    background-color: @white;
    width: 100%;
    resize: none;
    .mono__text();
    color: @secondaryLabel;
    height: auto;
    position: relative;
    outline: none;

    &--paste {
      height: 92px;
      .sizing();
    }
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
