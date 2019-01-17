import Vue from 'vue'; // let Vue = require('xxx');
import App from './App.vue';

// 全局样式导入
import './assets/base.css';

// 导入自己抽取的axios插件
import VueAxios from './lib/vue-axios';
Vue.use(VueAxios); // 调用插件实现的install方法

// element-ui导入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // Vue的原型上 增加了很多的方法

// 导入自己抽取的路由
import router from './lib/router';

// 导入自己的面包屑
import myBreadcrumb from './components/myBreadcrumb.vue';
// 全局注册面包屑组件
Vue.component('myBreadcrumb', myBreadcrumb)

// 导入moment.js
import moment from 'moment';

// 过滤器
Vue.filter('beautifyTime', (value) => {
  // moment.js格式化
  return moment(value).format('YYYY年MM月DD日 HH:mm:ss')
})

new Vue({
  el: '#app',
  // 挂载到 最顶级的Vue实例上
  router,
  render: h => h(App)
});