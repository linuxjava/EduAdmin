<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" style="font-size: 16px;display: flex;justify-content: space-between;align-items: center;height: 18.4px">
              <span>可用余额（元）</span>
              <el-button type="primary" @click="cashOut">申请提现</el-button>
            </div>
            <span style="font-size: 40px;font-weight: bold">{{ availableAmount }}</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="font-size: 16px">
              <span>累计收入（元）</span>
            </div>
            <span style="font-size: 40px;font-weight: bold">20.00</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="font-size: 16px">
              <span>待结算金额（元）</span>
            </div>
            <span style="font-size: 40px;font-weight: bold">20.00</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="font-size: 16px">
              <span>冻结金额（元）</span>
            </div>
            <span style="font-size: 40px;font-weight: bold">10.00</span>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-table
      ref="multiTable"
      :data="list"
      border
      fit
      :loading="showLoading"
      highlight-current-row
      :row-class-name="tableRowClassName"
      style="width: 100%;height: 100%;overflow: auto;margin-top: 40px">

      <el-table-column label="交易日期" width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.created_time }}
        </template>
      </el-table-column>

      <el-table-column label="提款账号" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.account }}
        </template>
      </el-table-column>

      <el-table-column label="开户人" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="提款金额" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.price }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.status === 1 ? '提现成功' : '提现失败' }}
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

    <el-dialog
      title="提现申请"
      :visible.sync="dialogVisible"
      @close='closeDialog'>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="提现金额" required prop="price">
          <el-input-number v-model="form.price" :min="0" label="提现金额"></el-input-number>
        </el-form-item>

        <el-form-item label="提现账户" required prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in accounts"
              :key="item.id"
              :label="item.bank"
              :value="item.id">
              <span>{{item.bank}}</span>
              <span style="float: right;color: #8492a6">{{item.account}}</span>
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchCashOut, fetchAccounts, cashOut} from '@/api/pay'
export default {
  name: "Asset",
  components: {Pagination},
  directives: {waves},
  data(){
    const validatePrice = (rule, value, callback) => {
      if (value > this.availableAmount) {
        callback(new Error('提现金额不能超过' + this.availableAmount));
      }else if (value <= 0) {
        callback(new Error('请输入提现金额'));
      }else {
        callback();
      }
    }
    return {
      availableAmount: 20.00,
      showLoading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 0,
        limit: 10
      },
      dialogVisible: false,
      form: {
        price: 0,
        accountId: ''
      },
      rules: {
        price: [
          {validator: validatePrice, trigger: 'blur'},
        ],
        accountId: [
          {required: true, message: '请输入提现账户', trigger: 'change'},
        ]
      },
      accounts: [],
    }
  },
  created(){
    this.getList()
  },
  methods: {
    async getList() {
      this.showLoading = true
      const res = await fetchCashOut(this.listQuery)
      this.showLoading = false
      if(res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    cashOut(){
      this.dialogVisible = true
      fetchAccounts({}).then(res => {
        if(res.code === 20000) {
          this.accounts = res.data.items
        }
      })
    },
    submit(){
      this.$refs['form'].validate(valid => {
        if(!valid) {
          return
        }

        cashOut(this.form).then(res => {
          this.dialogVisible = false;
          this.form = {
            price: 0,
            accountId: ''
          }
          if(res.code === 20000) {
            this.$message.success('提现成功')
            this.getList()
          }
        })
      })

    },
    closeDialog() {
      this.form = {
        price: 0,
        accountId: ''
      }
    }
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
