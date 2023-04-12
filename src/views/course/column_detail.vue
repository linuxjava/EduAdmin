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
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="addColunmCourse">新增课程</el-button>
      <div>
        <el-select
          v-model="listQuery.status"
          placeholder="商品状态"
          clearable
          style="width: 110px;margin-right: 10px"
          @clear="getColumnCourse"
          class="filter-item">
          <el-option v-for="(item, k) in statusOptions" :key="k" :label="item" :value="k"/>
        </el-select>

        <el-input
          v-model="listQuery.title"
          placeholder="请输入搜索内容"
          style="width: 200px;margin-right: 10px"
          class="filter-item"
          clearable
          @clear="getColumnCourse"/>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchColumnCourse">搜索</el-button>
      </div>
    </div>

    <!--表格
      row-key:必须要添加，否则拖拽后item的序号不会变
    -->
    <el-table
      ref="dragTable"
      :data="columnCourses"
      border
      row-key="id"
      v-loading="columnCourseLoading"
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        label="序号">
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
          <span>{{ row.visits}}</span>
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
          <el-popconfirm title="是否要删除该记录?" style="margin-left: 10px;" @onConfirm="deleteItem(row, $index)">
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

    <choose-course ref="chooseCourse" is-multi></choose-course>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchDetail, updateStatus, updateIsEnd, fetchColumnCourse} from '@/api/column'
import Sortable from "sortablejs";
import ChooseCourse from "@/components/ChooseCourse";

let id
export default {
  name: "ColumnDetail",
  directives: {waves},
  components: {
    Pagination,
    ChooseCourse
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
        title: '',
      },
      statusOptions: ['未上架', '已上架'],
      courseType: ['图文', '音频', '视频'],
      oldList: [],
      newList: []
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
    async getColumnCourse() {
      this.listLoading = true
      const {data} = await fetchColumnCourse(this.listQuery)
      this.columnCourses = data.data
      this.columnCoursesTotal = data.total
      this.$nextTick(() => {
        this.setSort()
      })
    },
    //拖拽排序
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnCourses.splice(evt.oldIndex, 1)[0]
          this.columnCourses.splice(evt.newIndex, 0, targetRow)
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
    //搜索专辑课程
    searchColumnCourse() {
      this.getColumnCourse()
    },
    //添加专辑课程
    addColunmCourse() {
      this.$refs.chooseCourse.open(data => {
        this.columnCourses = [...data, ...this.columnCourses]
      })
    },
    deleteItem(row, index){
      this.$notify({
        title: '提示',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.columnCourses.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}

.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
