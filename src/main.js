import Vue from 'vue';
import App from './App.vue';

// 全局样式导入
import './assets/base.css';

// element-ui导入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});