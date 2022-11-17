const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/mydotwallet/",
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
});
