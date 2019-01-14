<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <img src="../assets/logo.png" alt>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">电商后台管理系统</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-button @click="logout" type="success">退出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>选项1
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      // 注册在原型上的方法
      this.$confirm("你真的要退出吗?o(╥﹏╥)o", "提示", {
        confirmButtonText: "狠心退出",
        cancelButtonText: "再看看",
        type: "warning"
      })
        .then(() => {
          // 清除token
          window.sessionStorage.removeItem("token");
          // 编程式导航
          this.$router.push("login");
          // 成功
          this.$message({
            type: "success",
            message: "你真狠!"
          });
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "你真好 ღ( ´･ᴗ･` )比心"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
// 预处理 集合 父选择器[css作用域]
.main-container {
  height: 100%;
  /* element-ui的自带的类名 直接添加 */
  .el-container {
    height: 100%;
  }
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
    .el-col-18 {
      font-size: 30px;
      font-weight: 900;
      color: white;
    }
    .el-col-4 {
      text-align: left;
    }
    .el-col-2 {
      text-align: right;
    }
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  // 设置折叠菜单 样式
  .el-submenu__title {
    text-align: left;
  }
}
</style>
