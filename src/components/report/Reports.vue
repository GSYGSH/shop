<template>
  <div class="reports">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data(){
    return{
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created(){

  },
  async mounted(){
    /* 初始化 */
     var myChart = echarts.init(document.getElementById('main'));


    /* 数据 */
    let{data:res} = await this.$http.get(`reports/type/1`)
    if(res.meta.status !== 200)return this.$message.error('获取折线图数据失败')
    console.log(res);

    let echartsData = {...this.options,...res.data};
    echartsData.xAxis[0].boundaryGap = false

    /* 显示图表 */
          myChart.setOption(echartsData)
  },
  methods:{

  }
};
</script>

<style lang='less' scoped>
</style>