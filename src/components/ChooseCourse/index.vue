<template>
  <div>
    <el-dialog
      title="选择"
      :visible.sync="dialogVisible"
      width="60%">
      <!--搜索-->
      <div class="filter-container" style="display: flex;justify-content: space-between;margin-top: 10px">
        <div></div>
        <div style="margin-right: 30px">
          <el-input
            placeholder="请输入搜索内容"
            v-model="listQuery.title"
            style="width: 200px;margin-right: 10px"
            class="filter-item"
            clearable
            @clear="clearSearchInput"/>

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
      </div>

      <el-container style="height: 450px;margin-left: 30px;margin-right: 30px;border: 1px solid #eeeeee;">
        <el-aside width="200px" style="margin-bottom: 0;padding: 0;">
          <el-menu ref="menu" style="width: 100%;height: 100%;" default-active="1" @select="handleMenuSelect">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">图文</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span slot="title">音频</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-setting"></i>
              <span slot="title">视频</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main style="padding: 0">
            <!--表格-->
            <el-table
              ref="multiTable"
              :data="list"
              stripe
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
                      style="width: 100px;height: 50px">
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
                  <span>{{ row.courseType | courseTypeFilter }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="padding: 0;display:flex;align-items: center">
            <!--分页-->
<!--            @pagination="getColumnCourse"-->
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page"
                        :limit.sync="listQuery.limit"
                         style="width: 100%;margin-top: 0;padding: 0;text-align: center"
                        @pagination="pagination"
                        layout="prev, pager, next"/>
          </el-footer>
        </el-container>

      </el-container>

      <span style="display:block;text-align: center;margin-top: 20px">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="add">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import {fetchList as fetchMediaList} from '@/api/media'
// import {fetchList as fetchAudioList} from '@/api/audio'
// import {fetchList as fetchVideoList} from '@/api/video'
import {fetchList} from '@/api/course'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: "ChooseCourse",
  directives: {waves},
  components: {Pagination},
  props: {
    isMulti: Boolean
  },
  filters: {
    courseTypeFilter(status) {
      const statusMap = {
        0: '图文',
        1: '音频',
        2: '视频',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      dialogVisible: false,
      listQuery: {
        title: '',
        page: 1,
        limit: 10,
      },
      multipleSelection: [],
      callback: undefined
    }
  },
  methods: {
    open(callback) {
      this.callback = callback;
      this.dialogVisible = true
      this.handleMenuSelect(1, null)

      // let m ={}
      // let r = require.context('@/api/', true, /\.js$/)
      // console.log(r)
      // console.log(r.keys())
      // r.keys().forEach(key => m[key] = r(key))
      // console.log(m)
    },
    //清除搜索内容
    clearSearchInput() {
      this.handleMenuSelect(this.$refs.menu.activeIndex, null)
    },
    handleMenuSelect(key, keyPath){
      let method = fetchList
      if(key == 1) {
        // method = fetchMediaList
        this.list.type = 'media'
      }else if(key == 2) {
        // method = fetchAudioList
        this.list.type = 'audio'
      }else if(key == 3) {
        // method = fetchVideoList
        this.list.type = 'video'
      }


      method(this.listQuery).then(res => {
        if(res && res.code === 20000) {
          this.list = res.data.items
          this.total = res.data.total
        }
      })
    },
    pagination() {
      this.handleMenuSelect(this.$refs.menu.activeIndex, null)
    },
    search(){
      this.handleMenuSelect(this.$refs.menu.activeIndex, null)
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    add() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择课程')
        return
      }

      if(this.isMulti) {

      }else {
        if (this.multipleSelection.length !== 1) {
          this.$message.info('只能选择一门课程')
          return
        }
      }

      this.callback && this.callback(this.multipleSelection)
      this.listQuery.title = ''
      this.$refs.multiTable.clearSelection()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
