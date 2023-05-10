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
          v-model="listQuery.keyword"
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
      v-loading="tableLoading"
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
              :src="row.user.avatar || 'https://img.zcool.cn/community/01e4ea57a6e2550000018c1bfdce56.jpg'"
              style="width: 50px;height: 50px;border-radius: 50px">
            <div
              style="display: flex;flex-direction: column;justify-content: center;align-items:flex-start;margin-left: 10px">
              <span style="color:#0485fd;">{{ row.user.username}}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="消费总额" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.total_consume}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{row.created_time | timeFilter}}</span>
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
              <el-dropdown-item @click.native="changeCommentStatus(row)">{{row.no_comment === 0 ? '禁止评论' : '允许评论'}}</el-dropdown-item>
              <el-dropdown-item @click.native="changeAccessStatus(row)">{{row.no_access === 0 ? '禁止访问' : '允许访问'}}</el-dropdown-item>
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
import {fetchUserList, updateAccess, updateComment} from '@/api/user'
import {parseTime} from '@/utils'
export default {
  name: "user",
  components: {Pagination, Info},
  directives: {waves},
  filters: {
    timeFilter(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  created() {
    this.getList()
  },
  data() {
    return {
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 10
      },
      list: [],
      total: 0,
      multipleSelection: [],
      tableLoading: false
    }
  },
  methods: {
    getList(){
      this.tableLoading = true
      fetchUserList(this.listQuery).then(res => {
        this.tableLoading = false
        this.list = res.data.items
        this.total = res.data.total
      })
    },
    addBlackList(){},
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    userDetail(row){
      this.$refs.userInfo.open(row.id)
    },
    changeCommentStatus(row){
      let msg = row.no_comment === 0 ? '是否禁止当前用户评论' : '是否允许当前用户评论'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        await updateComment({id: row.id, no_comment: (row.no_comment === 0 ? 1 : 0)})
        this.$notify.success('更新成功')
        this.getList()
      })
    },
    changeAccessStatus(row){
      let msg = row.no_access === 0 ? '是否禁止当前用户访问' : '是否允许当前用户访问'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        await updateAccess({id: row.id, no_access: (row.no_access === 0 ? 1 : 0)})
        this.$notify.success('更新成功')
        this.getList()
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
      }).then(async action => {
        let ids = this.multipleSelection.map(user => user.id)
        await updateComment({id: ids[0], no_comment: 1})
        this.$notify.success('更新成功')
        this.$refs.multiTable.clearSelection()
        this.getList()
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
      }).then(async action => {
        let ids = this.multipleSelection.map(user => user.id)
        await updateAccess({id: ids[0], no_access: 1})
        this.$notify.success('更新成功')
        this.$refs.multiTable.clearSelection()
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
