<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button class="filter-item" type="danger" icon="el-icon-edit" @click="addBlackList">黑名单设置</el-button>
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

      <el-table-column label="创建时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.created_time}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini">
            详情
          </el-button>
          <el-button size="mini" type="success">
            联系用户
          </el-button>
          <el-button size="mini">
            黑名单设置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchList} from '@/api/my_user'
export default {
  name: "user",
  components: {Pagination},
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
      total: 0
    }
  },
  methods: {
    getList(){
      fetchList(this.listQuery).then(res => {
        console.log(res)
        if(res.code === 20000) {
          this.list = res.data.items
          this.total = res.data.total
        }
      })
    },
    addBlackList(){},
    handleSelectionChange(val){}
  }
}
</script>

<style scoped>

</style>
