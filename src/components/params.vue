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
    <!-- 提示框 -->
    <el-row class="mt">
      <el-col :span="24">
        <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 级联选择器 -->
    <el-row class="mt">
      <el-col :span="24">
        <span class="mr">请选择商品分类:</span>
        <el-cascader
          expand-trigger="hover"
          :options="paramList"
          v-model="selectedOptions2"
          :props="props"
          @change="getDetailInfo"
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- tabs -->
    <el-row class="mt">
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary">添加动态参数</el-button>
            <el-table :data="manyRows" style="width: 100%" border>
              <el-table-column type="expand">
                <!-- 模板 -->
                <template slot-scope="props">
                  <!-- 生成 最左边的一级菜单 -->
                  <el-tag class="mr" v-for="item in props.row.items" closable>{{item}}</el-tag>
                  <!-- 新增的文本框 -->
                  <el-input
                    @blur="saveItem(props.row)"
                    @keyup.enter="saveItem(props.row)"
                    v-model="newItem"
                    size="mini"
                    class="my-el-input"
                    v-show="showAdd==false"
                  ></el-input>
                  <!-- 新增的按钮 -->
                  <el-button @click="showAdd=false" size="mini" v-show="showAdd==true">
                    <i class="el-icon-plus"></i> New Tag
                  </el-button>

                  <!-- 要么没有参数 -->
                  <el-row v-if="props.row.items.length==0">
                    <el-col :span="24">没有设置参数</el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column label="#" width="30" type="index"></el-table-column>
              <el-table-column prop="attr_name" label="商品参数" width="180"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
                  <el-button type="warning" plain size="mini" icon="el-icon-check"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="only">
            <el-button type="primary">静态参数</el-button>
            <el-table :data="onlyRows" style="width: 100%" border>
              <el-table-column label="#" width="30" type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
              <el-table-column prop="attr_vals" label="属性值" width="180"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
                  <el-button type="warning" plain size="mini" icon="el-icon-check"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      level2: "商品管理",
      level3: "分类参数",
      // 用户的数据
      paramList: [],
      // 选中的数据
      selectedOptions2: [],
      // 别名
      props: {
        label: "cat_name",
        value: "cat_id"
      },
      // tabs命中的tab栏
      activeName: "many",
      // 动态数据源
      manyRows: [],
      // 静态数据源
      onlyRows: [],
      // 显示 隐藏 新增按钮
      showAdd: true,
      // 双向数据绑定
      newItem: ""
    };
  },
  // 方法
  methods: {
    // 获取详情数据
    async getDetailInfo() {
      // console.log(this.selectedOptions2);
      if (this.selectedOptions2.length === 3) {
        // 三级 可以获取数据
        let res = await this.$axios.get(
          `categories/${this.selectedOptions2[2]}/attributes?sel=${
            this.activeName
          }`
        );

        // 动态数据
        if (this.activeName === "many") {
          res.data.data.forEach(v => {
            v.items = v.attr_vals.split(",");
          });
        }

        // console.log(res);
        // activeName->many 或者 only
        // [this.activeName+'Rows']  manyRows 或者 onlyRows
        this[this.activeName + "Rows"] = res.data.data;
        // 保存数据 到不同的数据源 让table进行渲染
      } else {
        // 什么都不干
      }
    },
    // tab栏切换
    handleClick() {
      this.getDetailInfo();
    },
    // 新增item
    async saveItem(data) {
      // 非空判断
      if (this.newItem === "") {
        return;
      }
      // 显示按钮
      this.showAdd = true;
      // 添加数据
      data.items.push(this.newItem);
      // 清空内容
      this.newItem = "";

      // 打印数据
      // 准备提交的数据
      let sendData = {
        attr_name: data.attr_name,
        attr_sel: data.attr_sel,
        attr_vals: data.items.join(",")
      };
      // console.log(data);
      let res = await this.$axios.put(
        `/categories/${data.cat_id}/attributes/${data.attr_id}`,
        sendData
      );
      console.log(res);
    }
  },
  // 生命周期函数 回调函数
  async created() {
    // 从上往下执行代码
    let res = await this.$axios.get("categories?type=3");
    // 赋值
    // console.log(res);
    this.paramList = res.data.data;
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
</style>
