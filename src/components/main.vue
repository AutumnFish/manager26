<template>
  <div>main
    <el-button @click="logout" type="success">退出</el-button>
  </div>
</template>
<script>
export default {
  // 声明周期函数
  beforeCreate() {
    // 判断是否有token
    let token = window.sessionStorage.getItem("token");
    if (token) {
      // 登录成功
    } else {
      // 没有token 没有登录
      this.$message.error("请先登录");
      // 去登录页 编程式导航
      this.$router.push("login");
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      // 编程式导航
      this.$router.push("login");
    }
  }
};
</script>
<style>
</style>
