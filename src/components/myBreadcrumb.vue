<template>
  <el-breadcrumb class='my-el-breadcrumb' separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level3}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  // 通过props 让外部传递数据
  props:['level2','level3']
};
</script>
<style >
.my-el-breadcrumb{
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
}
</style>