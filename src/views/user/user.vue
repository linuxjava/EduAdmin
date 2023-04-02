<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-dropdown style="margin-left: 10px">
        <el-button type="danger">
          黑名单设置<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="disableComment">禁止评论</el-dropdown-item>
          <el-dropdown-item @click.native="disableAccess">禁止访问</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div>
        <el-input
          v-model="listQuery.title"
          placeholder="昵称/用户名"
          style="width: 200px;margin-right: 10px"
          class="filter-item"
          clearable
          @clear="getList"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </div>
    </div>

    <el-table
      ref="multiTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;height: 100%;overflow: auto"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55"
        align="center">
      </el-table-column>

      <el-table-column label="内容" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display: flex">
            <img
              :src="row.cover"
              style="width: 50px;height: 50px;border-radius: 50px">
            <div
              style="display: flex;flex-direction: column;justify-content: center;align-items:flex-start;margin-left: 10px">
              <span style="color:#0485fd;">{{ row.title }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="消费总额" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.totalConsumption}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{row.created_time}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="330px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="userDetail(row)">
            用户详情
          </el-button>
          <el-button size="mini" type="success">
            联系用户
          </el-button>
          <el-dropdown style="margin-left: 10px">
            <el-button type="danger" size="mini">
              黑名单设置<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeCommentStatus(row)">{{row.comment === 0 ? '允许评论' : '禁止评论'}}</el-dropdown-item>
              <el-dropdown-item @click.native="changeAccessStatus(row)">{{row.access === 0 ? '允许访问' : '禁止访问'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

    <info ref="userInfo"></info>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Info from '@/views/user/info.vue'
import {fetchComment, fetchList, changeComment, changeAccess, disableComment, disableAccess} from '@/api/my_user'
export default {
  name: "user",
  components: {Pagination, Info},
  directives: {waves},
  created() {
    this.getList()
  },
  data() {
    return {
      listQuery: {
        title: '',
        page: 1,
        limit: 10
      },
      list: [],
      total: 0,
      multipleSelection: []
    }
  },
  methods: {
    getList(){
      fetchList(this.listQuery).then(res => {
        if(res.code === 20000) {
          this.list = res.data.items
          this.total = res.data.total
          console.log(this.list)
        }
      })
    },
    addBlackList(){},
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    userDetail(row){
      this.$refs.userInfo.open(row.user_id)
    },
    changeCommentStatus(row){
      let msg = row.comment === 0 ? '是否允许当前用户评论' : '是否禁止当前用户评论'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        changeComment({user_id: row.user_id}).then(res => {
          if(res.code === 20000) {
            this.getList()
            this.$notify.success('更新成功')
          }})
      })
    },
    changeAccessStatus(row){
      let msg = row.comment === 0 ? '是否允许当前用户访问' : '是否禁止当前用户访问'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        changeAccess({user_id: row.user_id}).then(res => {
          if(res.code === 20000) {
            this.getList()
            this.$notify.success('更新成功')
          }})
      })
    },
    disableComment(){
      if(this.multipleSelection.length <= 0) {
        this.$message.info('请至少选择一个用户')
        return
      }

      this.$confirm('是否禁止所有选择的用户评论', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        let ids = this.multipleSelection.map(user => user.user_id)
        disableComment({ids}).then(res => {
          console.log(res)
          if(res.code === 20000) {
            this.getList()
            this.$notify.success('更新成功')
            this.$refs.multiTable.clearSelection()
          }
        })
      })
    },
    disableAccess(){
      if(this.multipleSelection.length <= 0) {
        this.$message.info('请至少选择一个用户')
        return
      }

      this.$confirm('是否禁止所有选择的用户评论', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        let ids = this.multipleSelection.map(user => user.user_id)
        disableAccess({ids}).then(res => {
          console.log(res)
          if(res.code === 20000) {
            this.getList()
            this.$notify.success('更新成功')
            this.$refs.multiTable.clearSelection()
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
