<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-document" :loading="downloadLoading"
                 @click="download">导出选中
      </el-button>

      <div>
        <el-select
          v-model="listQuery.status"
          placeholder="订单状态"
          clearable
          style="width: 110px;margin-right: 10px"
          class="filter-item"
          @clear="getList">
          <el-option v-for="(item, k) in statusOptions" :key="k" :label="item" :value="k"/>
        </el-select>
        <el-input
          v-model="listQuery.no"
          placeholder="订单号"
          style="width: 200px;margin-right: 10px"
          class="filter-item"/>
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

      <el-table-column label="订单号" width="110px" align="center">
        <template slot-scope="{row}">
          {{ row.no }}
        </template>
      </el-table-column>

      <el-table-column label="商品名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>

      <el-table-column label="订单类型" width="110px" align="center">
        <template slot-scope="{row}">
          {{ orderOptions[row.type] }}
        </template>
      </el-table-column>

      <el-table-column label="订单状态" width="110px" align="center">
        <template slot-scope="{row}">
          {{ statusOptions[row.status] }}
        </template>
      </el-table-column>

      <el-table-column label="原价/实付(元)" width="110px" align="center">
        <template slot-scope="{row}">
          {{ row.price }}/{{ row.total_price }}
        </template>
      </el-table-column>

      <el-table-column label="支付方式" width="110px" align="center">
        <template slot-scope="{row}">
          {{ payMethodOptions[row.pay_method] }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间/支付时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_time | timeFilter }}</span><br/>
          <span>{{ row.pay_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="danger" size="mini" @click="deleteItem(row)">
            删除
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
import {fetchOrders, removeOrder} from '@/api/pay'
import {parseTime} from "@/utils";


export default {
  name: "Order",
  components: {Pagination},
  directives: {waves},
  filters: {
    timeFilter(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        no: '',
        status: '',
        page: 1,
        limit: 10
      },
      orderOptions: {
        'group': '拼团',
        'default': '默认',
      },
      statusOptions: {
        'pending': '等待',
        'success': '成功',
        'fail': '失败'
      },
      payMethodOptions: {
        'wechat': '微信',
      },
      multiSelections: [],
      downloadLoading: false,
      tableLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.tableLoading = true
      let res = await fetchOrders(this.listQuery)
      this.tableLoading = false
      this.list = res.data.items
      this.total = res.data.total
    },
    handleSelectionChange(val) {
      this.multiSelections = val
    },
    deleteItem(row) {
      this.$confirm('是否删除此订单记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        removeOrder({ids: [row.id]}).then(res => {
          if (res.code === 20000) {
            this.getList()
            this.$notify({
              type: "success",
              message: '删除成功'
            })
          }
        })
      })
    },
    download() {
      if (this.multiSelections.length <= 0) {
        this.$message.info("请至少选择一项")
        return
      }

      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单号', '商品名称', '订单类型', '订单状态', '原价', '折扣价', '支付方式', '创建时间', '支付时间']
        const filterVal = ['no', 'title', 'type', 'status', 'total_price', 'price', 'pay_method', 'created_time', 'pay_time']
        const list = this.multiSelections
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '1.xlsx',
        })
        this.downloadLoading = false
        this.$refs.multiTable.clearSelection()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        console.log(j)
        if (j === 'type') {
          return this.orderOptions[v[j]]
        } else if (j === 'status') {
          return this.statusOptions[v[j]]
        } else if (j === 'pay_method') {
          return this.payMethodOptions[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>

</style>
