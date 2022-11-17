import { EndpointOption } from "@polkadot/apps-config/endpoints/types";

// Extracted from https://github.com/polkadot-js/apps/tree/master/packages/apps-config/src/endpoints
// Since the latest version is not published to npm
export const copyTestParasWestend: EndpointOption[] = [
  {
    info: "charcoal",
    paraId: 2086,
    text: "Charcoal",
    providers: {
      // Centrifuge: 'wss://fullnode-collator.charcoal.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8219
    },
  },
  {
    info: "integritee",
    paraId: 2081,
    text: "Integritee Network",
    providers: {
      Integritee: "wss://teerw1.integritee.network",
    },
  },
  {
    info: "interlay",
    paraId: 2094,
    text: "Interlay",
    providers: {
      // Interlay: 'wss://api-westend.interlay.io/parachain' // https://github.com/polkadot-js/apps/issues/6261
    },
  },
  {
    info: "moonshadow",
    paraId: 2002,
    text: "Moonshadow",
    providers: {
      // PureStake: 'wss://wss.moonshadow.testnet.moonbeam.network' // https://github.com/polkadot-js/apps/issues/6181
    },
  },
  {
    info: "pangoro",
    homepage: "https://darwinia.network/",
    paraId: 2102,
    text: "Pangoro",
    providers: {
      // Darwinia: 'wss://pangoro-parachain-rpc.darwinia.network' // https://github.com/polkadot-js/apps/issues/6530
    },
  },
  {
    info: "westendPichiu",
    homepage: "https://kylin.network/",
    paraId: 2112,
    text: "Pichiu",
    providers: {
      "Kylin Network": "wss://westend.kylin-node.co.uk",
    },
  },
  {
    info: "westendStandard",
    paraId: 2094,
    text: "Standard ",
    providers: {
      "Standard Protocol": "wss://rpc.westend.standard.tech",
    },
  },
  {
    info: "karura",
    paraId: 2005,
    text: "Wendala",
    providers: {
      // 'Acala Foundation': 'wss://karura-westend-rpc.aca-staging.network' // https://github.com/polkadot-js/apps/issues/5830
    },
  },
  {
    info: "whala",
    paraId: 2013,
    text: "Whala",
    providers: {
      // Phala: 'wss://whala.phala.network/ws' // https://github.com/polkadot-js/apps/issues/6181
    },
  },
  {
    info: "kilt",
    homepage: "https://www.kilt.io/",
    paraId: 2085,
    text: "WILT",
    providers: {
      "KILT Protocol": "wss://westend.kilt.io:9977",
    },
  },
];

export const copyTestParasWestendCommon: EndpointOption[] = [
  {
    info: "westmint",
    paraId: 1000,
    text: "Westmint",
    providers: {
      Parity: "wss://westmint-rpc.polkadot.io",
      Dwellir: "wss://westmint-rpc.dwellir.com",
    },
    teleport: [-1],
  },
  {
    info: "westendCollectives",
    paraId: 1001,
    text: "Collectives",
    providers: {
      Parity: "wss://westend-collectives-rpc.polkadot.io",
    },
    teleport: [-1],
  },
];
