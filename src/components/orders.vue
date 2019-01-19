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

    <!-- 订单数据 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="orderList" style="width: 100%" border>
          <el-table-column label="#" width="40" type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单编号" width="251"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
          <el-table-column prop="goods_weight" label="是否付款" width="100">
            <template slot-scope="prop">
              <el-button type="danger" v-if="prop.row.pay_status==='0'">未付款</el-button>
              <el-button type="success" v-else>已付款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="250"></el-table-column>
          <el-table-column prop="create_time" label="下单时间" width="250">
            <template slot-scope="prop">{{prop.row.create_time | beautifyTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
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
      level2: "订单管理",
      level3: "订单列表",
      pageData: {
        // 页码
        pagenum: 1,
        // 页容量
        pagesize: 6
      },
      // 总页数
      total: 0,
      // 订单的数据
      orderList: []
    };
  },
  // 事件
  methods: {
    // 获取分页数据的方法
    async getOrders() {
      // 从上往下执行代码
      let res = await this.$axios.get("orders", {
        params: this.pageData
      });
      // 赋值
      console.log(res);
      this.total = res.data.data.total;
      this.orderList = res.data.data.goods;
    },
    // 页码改变
    currentChange(pagenum) {
      // console.log(pagenum);
      // 修改页码
      this.pageData.pagenum = pagenum;
      // 重新获取数据即可
      this.getOrders();
    },
    // 页容量改变
    sizeChange(pagesize) {
      // console.log(pagesize);
      // 修改页容量
      this.pageData.pagesize = pagesize;
      // 重置页码
      this.pageData.pagenum = 1;
      // 获取数据
      this.getOrders();
    }
  },
  // 生命周期函数 回调函数
  async created() {
    // 直接调用方法
    this.getOrders();
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
