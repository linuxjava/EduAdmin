<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button class="filter-item" type="primary" icon="el-icon-edit">新增</el-button>
      <div>
        <el-select v-model="listQuery.importance" placeholder="商品状态" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" />
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
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订阅量" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test1 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Media',
  data() {
    return {
      tableKey: 0,
      list: [{
        test1: 'test1',
        test2: 'test2',
        test3: 'test3',
        test4: 'test4',
        test5: 'test5',
        test6: 'test6'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        importance: ['已上架', '未上架'],
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  }
}
</script>

<style scoped>

</style>
