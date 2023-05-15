<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div>
        <el-table
          ref="multiTable"
          :data="list"
          fit
          v-loading="tableLoading"
          highlight-current-row
          style="width: 100%;height: 100%;overflow: auto">

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

          <el-table-column label="订单状态" width="110px" align="center">
            <template slot-scope="{row}">
              {{ statusOptions[row.status] }}
            </template>
          </el-table-column>

          <el-table-column label="创建时间/支付时间" width="200px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.created_time | timeFilter }}</span><br/>
              <span>{{ row.pay_time | timeFilter }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {fetchOrders} from '@/api/pay'
import {parseTime} from "@/utils";

export default {
  name: "Order",
  props: {
    title: String,
  },
  filters: {
    timeFilter(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  data() {
    return {
      statusOptions: {
        'pending': '等待',
        'success': '成功',
        'fail': '失败'
      },
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
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
  }
}
</script>

<style scoped>

</style>
