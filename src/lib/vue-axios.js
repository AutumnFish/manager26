// 导入axios
import axios from 'axios';

// 设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// 暴露出去 (Vue的插件)
export default {
  install(Vue) {
    // 4. 添加实例方法
    Vue.prototype.$axios = axios;
  }
}

// let vueAxios = {}
// vueAxios.install = function(Vue){
//   Vue.prototype.$axios = axios;
// }
// export default vueAxios;
