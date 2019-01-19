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
    <!-- 操纵框 -->
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" v-model="pageData.query">
            <template slot="append">
              <i class="el-icon-search"></i>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-button type="success" plain>添加商品</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分类数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="categoryList" style="width: 100%" border>
          <!-- 树形table -->
          <el-tree-grid
            prop="cat_name"
            label="分类名称"
            treeKey="cat_id"
            parentKey="cat_pid"
            levelKey="cat_level"
            childKey="children"
            :indentSize="30"
          ></el-tree-grid>
          <el-table-column prop="cat_level" label="级别" width="100">
            <template slot-scope="prop">
              <span v-if="prop.row.cat_level===0">一级</span>
              <span v-if="prop.row.cat_level===1">二级</span>
              <span v-if="prop.row.cat_level===2">三级</span>
            </template>
          </el-table-column>
          <el-table-column prop label="是否有效" width="100">
            <template slot-scope="prop">{{prop.row.cat_deleted?'有效':'无效'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 底部的分页 -->
    <el-row>
      <el-col :span="24">
        <el-pagination
          :current-page="pageData.pagenum"
          :page-sizes="[2, 4, 6, 8,10]"
          :page-size="pageData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 导入
import ElTreeGrid from "element-tree-grid";
// Vue.component(ElTreeGrid.name,ElTreeGrid);
export default {
  name: "goods",
  // 注册组件
  components: {
    ElTreeGrid
  },
  data() {
    return {
      level2: "商品管理",
      level3: "商品分类",
      pageData: {
        type: 3,
        // 页码
        pagenum: 1,
        // 页容量
        pagesize: 6
      },
      // 总页数
      total: 0,
      // 分类的数据
      categoryList: []
    };
  },
  // 事件
  methods: {
    // 获取分页数据的方法
    async getCategories() {
      // 从上往下执行代码
      let res = await this.$axios.get("categories", {
        params: this.pageData
      });
      // 赋值
      console.log(res);
      this.total = res.data.data.total;
      this.categoryList = res.data.data.result;
    },
    // 页码改变
    currentChange(pagenum) {
      // console.log(pagenum);
      // 修改页码
      this.pageData.pagenum = pagenum;
      // 重新获取数据即可
      this.getCategories();
    },
    // 页容量改变
    sizeChange(pagesize) {
      // console.log(pagesize);
      // 修改页容量
      this.pageData.pagesize = pagesize;
      // 重置页码
      this.pageData.pagenum = 1;
      // 获取数据
      this.getCategories();
    }
  },
  // 生命周期函数 回调函数
  async created() {
    // 直接调用方法
    this.getCategories();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
}
</style>
