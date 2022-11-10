module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: "/",
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
  },
  css: {
    extract: true,
  },
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      '/api-dev.therapyou.it': {
        target: 'https://api-dev.therapyou.it/',
        changeOrigin: true,
        ws: true
      }
    }
  },
};
