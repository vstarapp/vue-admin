# vue-admin
Vue.js后台管理系统

git clone git@github.com:golang-demo/vue-admin.git
npm install 
npm run dev
配置：src/config/index.js
baseUrl: {
  dev: '/',
  pro: 'http://api.xxx.com/'
},
dev选项为本地开发环境
本地开发需要修改：vue.config.js
devServer: {
    port: '8080', // 开发服务器运行端口号
    host: 'localhost', // 匹配本机IP地址(默认是0.0.0.0)
    open: true, // 项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    proxy: {
      '/admin/': {
        target: 'http://api.xxx.com/admin/', // 代理接口地址
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
