import { createRouter, createWebHistory } from "vue-router";
import Accounts from "@/views/accounts/index.vue";
import SendTransaction from "@/views/send-transaction/index.vue";
import SendTransactionVerify from "@/views/send-transaction-verify/index.vue";
import Invite from "@/views/invite-friend/index.vue";
import Claim from "@/views/claim/index.vue";
import Claiming from "@/views/claiming/index.vue";
import Stake from "@/views/stake/index.vue";
import StakeEnterAmount from "@/views/stake-enter-amount/index.vue";
import StakeNominate from "@/views/stake-nominate/index.vue";
import StakeConfirm from "@/views/stake-confirm/index.vue";
import Crowdloan from "@/views/crowdloan/index.vue";
import Empty from "@/views/empty/index.vue";

const routes = {
  main: {
    path: "/",
    components: {
      view: Accounts,
    },
    name: "main",
  },
  send: {
    path: "/send",
    children: [
      {
        path: "",
        components: {
          view: SendTransaction,
        },
        name: "send",
      },
      {
        path: "verify",
        children: [
          {
            path: "",
            components: {
              view: SendTransactionVerify,
              modal: Empty,
            },
            name: "send-verify",
          },
          {
            path: "#invite",
            components: {
              view: SendTransactionVerify,
              modal: Invite,
            },
            name: "invite",
          },
        ],
      },
    ],
  },
  stake: {
    path: "/stake",
    children: [
      {
        path: "",
        components: {
          view: Stake,
        },
        name: "stake",
      },
      {
        path: "enter-amount",
        components: {
          view: StakeEnterAmount,
        },
        name: "stake-enter-amount",
      },
      {
        path: "enter-nominate",
        components: {
          view: StakeNominate,
        },
        name: "stake-nominate",
      },
      {
        path: "confirm",
        components: {
          view: StakeConfirm,
        },
        name: "stake-confirm",
      },
    ],
  },
  crowdloan: {
    path: "/crowdloan",
    components: {
      view: Crowdloan,
    },
    name: "crowdloan",
  },
  claim: {
    path: "/claim",
    children: [
      {
        path: "",
        components: {
          view: Claim,
        },
        name: "claim",
      },
      {
        path: "claiming",
        components: {
          view: Claiming,
        },
        name: "claiming",
      },
    ],
  },
};

export default createRouter({
  history: createWebHistory(),
  routes: Object.values(routes),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 71,
      };
    }
  },
});

export { routes };
