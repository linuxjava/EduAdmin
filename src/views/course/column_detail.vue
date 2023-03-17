<template>
  <div class="app-container">
    <el-card class="box-card">
      <div style="display: flex">
        <img :src="detail.cover">
        <div style="flex:1;margin-left: 16px">
          <div style="display: flex;justify-content: space-between">
            <h5 style="margin: 0px">{{ detail.title }}</h5>
            <small style="color: #bbbbbb">{{ detail.updateStatus === 1 ? '已完结' : '连载中' }}</small>
          </div>
          <p style="color: #bbbbbb;margin: 4px 0"><small>{{ detail.introduce }}</small></p>
          <p style="margin: 4px 0"><small style="color: red">$</small><small>{{ detail.price }}</small></p>

          <el-button-group>
            <el-button size="mini" :type="detail.status === 1 ? 'info' : 'success'"
                       @click="updateStatus(detail.status)">{{ detail.status === 1 ? '下架' : "上架" }}
            </el-button>
            <el-button size="mini" @click="updateIsEnd(detail.updateStatus)">
              {{ detail.updateStatus === 1 ? '设置为连载中' : "设置为已完结" }}
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>

    <!--搜索和新增-->
    <div class="filter-container" style="display: flex;justify-content: space-between;margin-top: 20px">
      <el-button class="filter-item" type="primary" icon="el-icon-edit">新增课程</el-button>
      <div>
        <el-select
          v-model="listQuery.status"
          placeholder="商品状态"
          clearable
          style="width: 110px;margin-right: 10px"
          class="filter-item">
          <el-option v-for="(item, k) in statusOptions" :key="k" :label="item" :value="k"/>
        </el-select>

        <el-input
          v-model="listQuery.title"
          placeholder="Title"
          style="width: 200px;margin-right: 10px"
          class="filter-item"
          clearable
          @clear="clearColumnCourse"/>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchColumnCourse">搜索</el-button>
      </div>
    </div>

    <!--表格-->
    <el-table
      ref="dragTable"
      :data="columnCourses"
      border
      v-loading="columnCourseLoading"
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>

      <el-table-column label="课程名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display: flex">
            <img
              :src="row.cover"
              style="width: 100px;height: 50px"
            >
            <div
              style="display: flex;flex-direction: column;justify-content: space-between;align-items:flex-start;margin-left: 10px">
              <span style="color:#0485fd;">{{ row.title }}</span>
              <span style="color: red">${{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="类型" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ courseType[row.courseType] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="访问量" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visits }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini">
            编辑
          </el-button>
          <el-popconfirm title="是否要删除该记录?" style="margin-left: 10px;">
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Drag" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="columnCoursesTotal>0" :total="columnCoursesTotal" :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getColumnCourse" style="padding-left: 0px"/>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchDetail, updateStatus, updateIsEnd, fetchColumnCourse} from '@/api/column'

let id
export default {
  name: "ColumnDetail",
  directives: {waves},
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      detail: {
        id: undefined,
        cover: '',
        title: '',
        introduce: '',
        content: '',
        price: undefined,
        updateStatus: undefined,
        status: undefined
      },
      columnCourseLoading: false,
      columnCourses: [],
      columnCoursesTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        status: undefined,
        title: undefined,
      },
      statusOptions: ['未上架', '已上架'],
      courseType: ['图文', '音频', '视频'],
    }
  },
  beforeRouteEnter(to, from, next) {
    id = to.query.id
    next()
  },
  created() {
    this.getDetail()
    this.getColumnCourse()
  },
  methods: {
    getDetail() {
      fetchDetail({id}).then(res => {
        this.detail = res.data
      })
    },
    getColumnCourse() {
      this.listLoading = true
      console.log(this.listQuery)
      fetchColumnCourse(this.listQuery).then(res => {
        this.listLoading = false
        if (res.code === 20000) {
          console.log(res.data)
          this.columnCourses = res.data.data
          this.columnCoursesTotal = res.data.total
        }
      })
    },
    updateStatus(curStatus) {
      const newStatus = curStatus ===1 ? 0 : 1
      updateStatus({
        id,
        status: newStatus
      }).then(res => {
        if (res.code === 20000) {
          this.detail.status = newStatus
        }
      })
    },
    updateIsEnd(isEnd) {
      const newStatus = isEnd === 1 ? 0 : 1
      updateIsEnd({
        id,
        status: newStatus
      }).then(res => {
        console.log(res)
        if (res.code === 20000) {
          this.detail.updateStatus = newStatus
        }
      })
    },
    searchColumnCourse() {
      this.getColumnCourse()
    },
    clearColumnCourse() {
      this.getColumnCourse()
    }
  }
}
</script>

<style scoped>
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
