<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button class="filter-item" type="primary" icon="el-icon-edit">新增</el-button>
      <div>
        <el-select
          v-model="listQuery.importance"
          placeholder="商品状态"
          clearable
          style="width: 90px;margin-right: 10px"
          class="filter-item"
        >
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="Title"
          style="width: 200px;margin-right: 10px"
          class="filter-item"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display: flex">
            <img
              :src="row.cover"
              style="width: 100px;height: 50px"
            >
            <div style="display: flex;flex-direction: column;justify-content: space-between;align-items:flex-start;margin-left: 10px">
              <span>{{ row.title }}</span>
              <span style="color: red">${{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="订阅量" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subscription }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ importanceOptions[row.status === 'published' ? 0 : 1] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini">
            编辑
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success">
            上架
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini">
            下架
          </el-button>
          <el-button size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { fetchList } from '@/api/course'

export default {
  name: 'Media',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [{
        status: 'draft',
        timestamp: '1678436434'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: ['已上架', '未上架']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        // this.total = response.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
