module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: "/",
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
  },
  css: {
    extract: true,
  },
  // configureWebpack: {
  //   devServer: {
  //     headers: { "Access-Control-Allow-Origin": "*" }
  //   }
  // },
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" },
    //proxy: 'https://s1kinrz9zg.execute-api.eu-west-1.amazonaws.com/test-invoke-stage/',
    proxy: {
      '/api-dev.therapyou.it': {
        target: 'https://api-dev.therapyou.it/',
        changeOrigin: true,
        ws: true
      }
    }
  },
};
