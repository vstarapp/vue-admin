const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // 配置部署应用包时的基本 URL（如果有需要，发现放到服务器上静态资源路径请求不对的情况可以看着修改）
  publicPath: BASE_URL,
  // 关闭eslint校验, 项目开发中建议开启。这个只是在特殊情况下方便测试时关闭
  lintOnSave: 'error', // 设置eslint报错时停止代码编译

  // 运行配置
  devServer: {
    port: '8080', // 开发服务器运行端口号
    host: 'localhost', // 匹配本机IP地址(默认是0.0.0.0)
    open: true, // 项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    proxy: {
      '/admin/': {
        target: 'http://api.apiadmin.com/admin/', // 代理接口地址
        changeOrigin: true, // 是否跨域
        ws: true,
        pathRewrite: { // 重写路径
          '^/admin': '/' // 需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
        }
        // 既然我们设置了代理，则所有请求url都已写成/api/xxx/xxx，那请求如何知道我们到底请求的是哪个服务器的数据呢
        // 因此这里的意义在于， 以 /api开头的url请求，代理都会知道实际上应该请求那里，
        // ‘我是服务器/api’，后面的/api根据实际请求地址决定，即我的请求url：/api/test/test，被代理后请求的则是
        // https://我是服务器/api/test/test
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')).set('_c', resolve('src/components'))
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-design': 'view-design'
    }
  },
  productionSourceMap: false // 设置eslint报错时停止代码编译
}
