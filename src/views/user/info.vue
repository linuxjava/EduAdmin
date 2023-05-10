<template>
  <div>
    <el-dialog
      title="用户详情"
      :visible.sync="dialogVisible"
      width="60%">

      <el-container style="height: 600px;">
        <el-header style="width: 100%">
          <el-row style="height: 50px">
            <el-col :span="6"><div>ID: {{userDetail.id}}</div></el-col>
            <el-col :span="6"><div>用户名: {{userDetail.user.username}}</div></el-col>
            <el-col :span="6"><div>昵称: {{userDetail.user.nickname}}</div></el-col>
            <el-col :span="6"><div>手机号: {{userDetail.user.phone}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div>锁定: {{userDetail.status === 0 ? '未锁定' : '已锁定'}}</div></el-col>
            <el-col :span="6"><div>会员: {{userDetail.user_level}}</div></el-col>
            <el-col :span="6"><div>会员到期时间: {{userDetail.user_level_expire | timeFilter}}</div></el-col>
            <el-col :span="6"><div>注册时间: {{userDetail.created_time | timeFilter}}</div></el-col>
          </el-row>
        </el-header>

        <el-main style="width: 100%;margin-top: 10px">
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="item.labels" :name="item.name" v-for="(item, index) in tabs" :key="index">
              <el-table
                :data="item.data"
                border
                fit
                v-loading="tableLoading"
                highlight-current-row
                style="width: 100%;height: 100%;overflow: auto">
                <el-table-column v-for="(d, dI) in item.ths" :key="dI" :label="d.lab" :prop="d.prop" min-width="150px" align="center">
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>

        <!--分页-->
        <pagination v-show="currentTab.total>0" :total="currentTab.total" :page.sync="currentTab.form.page" :limit.sync="currentTab.form.limit"
                    @pagination="getTableData" style="padding-left: 0;text-align: center;margin-top: 0px"/>

      </el-container>

    </el-dialog>
  </div>
</template>

<script>
import {fetchUserDetail, fetchCourseSubscription, fetchColumnSubscription, fetchOrderRecord,
  fetchHistory,
  fetchComment} from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {parseTime} from '@/utils'

let statusOptions = {
  'succ': '支持成功',
  'fail': '支持失败',
  'pendding': '等待支付'
}

let typeOptions = {
  'media': '图文',
  'video': '视频',
  'audio': '音频 ',
  'column': '专栏 '
}

export default {
  name: "info",
  components: {Pagination},
  filters: {
    timeFilter(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  computed: {
    currentTab: function (){
      return this.tabs.find( item => item.name === this.activeName)
    },
    tableLoading: function () {
      return this.currentTab.tableLoading
    }
  },
  data() {
    return {
      id: -1,
      dialogVisible: false,
      userDetail: {
        id: '',
        user_id: '',
        username: '',
        avatar: '',
        nickname: '',
        phone: '',
        status: 0,
        created_time: '',
        user_level: '',
        user_level_expire: ''
      },
      tabs: [
        {
          name: 'course',
          labels: '课程订阅',
          ths: [
            {lab: '课程标题', prop: 'title'},
            {lab: '购买价格', prop: 'price'},
            {lab: '购买时间', prop: 'created_time'}
          ],
          data: [],
          total: 0,
          req: fetchCourseSubscription,
          form: {
            page: 1,
            limit: 10
          },
          tableLoading: false
        },
        {
          name: 'column',
          labels: '专栏订阅',
          ths: [
            {lab: '专栏标题', prop: 'title'},
            {lab: '购买价格', prop: 'price'},
            {lab: '购买时间', prop: 'created_time'}
          ],
          data: [],
          total: 0,
          req: fetchColumnSubscription,
          form: {
            page: 1,
            limit: 10
          },
          tableLoading: false
        },
        {
          name: 'order',
          labels: '订单记录',
          ths: [
            {lab: 'ID', prop: 'id'},
            {lab: '订单号', prop: 'no'},
            {lab: '价格', prop: 'price'},
            {lab: '状态', prop: 'status'},
            {lab: '商品', prop: 'title'},
            {lab: '购买时间', prop: 'created_time'},
          ],
          data: [],
          total: 0,
          req: fetchOrderRecord,
          form: {
            page: 1,
            limit: 10
          },
          tableLoading: false
        },
        {
          name: 'history',
          labels: '观看历史',
          ths: [
            {lab: '课程标题', prop: 'title'},
            {lab: '课程类型', prop: 'type'},
            {lab: '学习时长', prop: 'created_time'}
          ],
          data: [],
          total: 0,
          req: fetchHistory,
          form: {
            page: 1,
            limit: 10
          },
          tableLoading: false
        },
        {
          name: 'comment',
          labels: '用户评论',
          ths: [
            {lab: '评论内容', prop: 'content'},
            {lab: '评论时间', prop: 'created_time'},
            {lab: '课程标题', prop: 'title'},
            {lab: '类型', prop: 'type'}
          ],
          data: [],
          total: 0,
          req: fetchComment,
          form: {
            page: 1,
            limit: 10
          },
          tableLoading: false
        }
      ],
      activeName: 'course',
    }
  },
  methods: {
    open(id){
      this.id = id
      this.dialogVisible = true;
      this.getUserDetail()
      this.getTableData()
    },
    async getUserDetail() {
      const res = await fetchUserDetail({id: this.id})
      this.userDetail = res.data
    },
    async getTableData() {
      let query = {user_id: this.id, ...this.currentTab.form}
      this.currentTab.tableLoading = true
      const res = await this.currentTab.req(query)
      this.currentTab.tableLoading = false
      if(res.code === 20000) {
        this.currentTab.data = res.data.items
        if(this.currentTab.name === 'order') {
          this.currentTab.data.map(item => item.status = statusOptions[item.status])
        }else if(this.currentTab.name === 'history' || this.currentTab.name === 'comment') {
          this.currentTab.data.map(item => item.type = typeOptions[item.type])
        }
        this.currentTab.total = res.data.total
      }
    },
    handleTabClick(){
      this.getTableData()
    }
  }

}
</script>

<style scoped>

</style>
