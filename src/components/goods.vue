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
    <!-- 用户数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="goodsList" style="width: 100%" border>
          <el-table-column label="#" width="40" type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="250">
            <template slot-scope="prop">{{prop.row.add_time | beautifyTime}}</template>
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
export default {
  name: "goods",
  data() {
    return {
      level2: "商品管理",
      level3: "商品列表",
      pageData: {
        query: "",
        // 页码
        pagenum: 1,
        // 页容量
        pagesize: 6
      },
      // 总页数
      total: 0,
      // 用户的数据
      goodsList: []
    };
  },
  // 事件
  methods: {
    // 获取分页数据的方法
    async getGoods() {
      // 从上往下执行代码
      let res = await this.$axios.get("goods", {
        params: this.pageData
      });
      // 赋值
      // console.log(res);
      this.total = res.data.data.total;
      this.goodsList = res.data.data.goods;
    },
    // 页码改变
    currentChange(pagenum) {
      // console.log(pagenum);
      // 修改页码
      this.pageData.pagenum = pagenum;
      // 重新获取数据即可
      this.getGoods();
    },
    // 页容量改变
    sizeChange(pagesize) {
      // console.log(pagesize);
      // 修改页容量
      this.pageData.pagesize = pagesize;
      // 重置页码
      this.pageData.pagenum = 1;
      // 获取数据
      this.getGoods();
    }
  },
  // 生命周期函数 回调函数
  async created() {
    // 直接调用方法
    this.getGoods();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
