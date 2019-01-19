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
    <!-- echarts 容器 -->
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <div class="echarts-container" ref="echarts"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      level2: "数据统计",
      level3: "数据报表",
      // 表格的初始数据
      // echarts 实例中的基础数据 https://echarts.baidu.com/examples/editor.html?c=area-stack
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    };
  },
  // 生命周期函数 回调函数
  // mounted dom元素有了
  async mounted() {
    // 直接获取dom元素 不是Vue推荐的方式
    // let myChart = echarts.init(document.querySelector(".echarts-container"));
    // 通过 this.$refs.xx 获取标记的 dom元素
    let myChart = echarts.init(this.$refs.echarts);
    console.log(document.querySelector(".echarts-container"));
    // 获取接口数据
    // 使用服务器返回的数据 生成 图标
    let res = await this.$axios.get("reports/type/1");
    console.log(res);
    for (const key in res.data.data) {
      this.options[key] = res.data.data[key];
    }
    // 设置两边留白
    this.options.xAxis[0].boundaryGap = false;
    myChart.setOption(this.options);
  }
};
</script>
<style lang="scss" scoped>
.user-container {
  // background-color: #af676b;
}
.echarts-container {
  width: 800px;
  height: 500px;
}
</style>
