module.exports = {
  //TODO build时把这个打开   // publicPath: './',
  publicPath:process.env.NODE_ENV === 'production'?'./':'/',
  // publicPath: './',
  devServer: {
    port: 9002,
    proxy: {
      '/seaMapApi': {
        target: 'http://172.16.23.55:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/seaMapApi': ''
        }
      },
      '/attentionApi': {
        target: 'http://172.16.20.20:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/attentionApi': ''
        }
      },
      '/nodeApi': {
        target: 'http://172.16.20.43:3030',
        changeOrigin: true,
        pathRewrite: {
          '^/nodeApi': ''
        }
      },
    }
  },
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/page/main/main.js",
      template: "src/page/main/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "webWSMSVue",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    print: {
      // page 的入口
      entry: "src/page/print/main.js",
      // 模板来源
      template: "src/page/print/prints.html",
      // 在 dist/index.html 的输出
      filename: "prints.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Print Page",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "print"]
    }
  },
  chainWebpack: config => {
    config.module.rule("snapsvg")
      .test(require.resolve("snapsvg"))
      .use("imports-loader?this=>window,fix=>module.exports=0")
      .loader("imports-loader")
      .end();
  },
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      maxEntrypointSize: 1024 * 1024,//1M  入口起点的最大体积
      maxAssetSize: 1024 * 1024,//1M 单个资源体积
    }
  },
};