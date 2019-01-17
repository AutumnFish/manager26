<template>
  <div class="user-container">
    <!-- 顶部面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <myBreadcrumb :level2="level2" :level3="level3"></myBreadcrumb>
        </div>
      </el-col>
    </el-row>
    <!-- 用户数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="rightLists" style="width: 100%" border>
          <el-table-column label="#" width="60" type="index"></el-table-column>
          <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
          <el-table-column prop="path" label="路径" width="300"></el-table-column>
          <el-table-column prop="level" label="层级" width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.level==='0'">一级</span>
              <span v-if="scope.row.level==='1'">二级</span>
              <span v-if="scope.row.level==='2'">三级</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      level2: "权限管理",
      level3: "权限列表",
      // 用户的数据
      rightLists: []
    };
  },
  // 生命周期函数 回调函数
  async created() {
    // 从上往下执行代码
    let res = await this.$axios.get("rights/list");
    // 赋值
    // console.log(res);
    this.rightLists = res.data.data;
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
