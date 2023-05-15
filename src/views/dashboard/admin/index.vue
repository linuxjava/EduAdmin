<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row :gutter="40">
     <el-col :span="12">
       <card-box title="运营小助手" :data="cardData1"></card-box>
     </el-col>
     <el-col :span="12">
       <card-box title="常见功能" :data="cardData2"></card-box>
     </el-col>
    </el-row>

    <el-row :gutter="40" style="margin-top: 40px">
      <el-col :span="12">
        <course title="最新课程" :data="cardData1"></course>
      </el-col>
      <el-col :span="12">
        <order title="最近订单" :data="cardData2"></order>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import CardBox from './components/CardBox'
import Course from './components/Course'
import Order from './components/Order'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    CardBox,
    Course,
    Order
  },
  data() {
    return {
      cardData1: [
        {
          name: '拼团',
          remark: '多人拼团享受优惠',
          icon: 'el-icon-user',
          path: 'Group'
        },
        {
          name: '秒杀',
          remark: '限时秒杀享低价',
          icon: 'el-icon-info',
          path: 'Flashsale'
        },
        {
          name: '优惠卷',
          remark: '有偿课程激励推广',
          icon: 'el-icon-upload',
          path: 'Coupon'
        },
        {
          name: '限时折扣',
          remark: '限时限量打折降价',
          icon: 'el-icon-s-platform',
          path: 'Flashsale'
        },
      ],
      cardData2: [
        {
          name: '图文',
          remark: '图文课程',
          icon: 'el-icon-user',
          path: 'Media'
        },
        {
          name: '音频',
          remark: '音频课程',
          icon: 'el-icon-info',
          path: 'Audio'
        },
        {
          name: '视频',
          remark: '视频课程',
          icon: 'el-icon-upload',
          path: 'Video'
        },
        {
          name: '专栏',
          remark: '专栏课程',
          icon: 'el-icon-s-platform',
          path: 'Column'
        },
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
