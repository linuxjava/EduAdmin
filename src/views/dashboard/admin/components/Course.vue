<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div>
        <el-table
          :data="list"
          v-loading="listLoading"
          fit
          highlight-current-row
          style="width: 100%;">

          <el-table-column label="标题" min-width="150px" align="center">
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

          <el-table-column label="创建时间" width="180px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.created_time | timeFilter }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {fetchList} from '@/api/course'
import {parseTime} from "@/utils";

export default {
  name: "Course",
  props: {
    title: String,
  },
  filters: {
    timeFilter(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  data(){
    return {
      list: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
  }
}
</script>

<style scoped>

</style>
