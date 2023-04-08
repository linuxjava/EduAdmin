<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-document"
                 @click="addAccount">添加收款账号
      </el-button>
    </div>

    <el-table
      ref="multiTable"
      :data="list"
      border
      fit
      v-loading="loadingShow"
      highlight-current-row
      style="width: 100%;height: 100%;overflow: auto">

      <el-table-column label="账号" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.account }}
        </template>
      </el-table-column>

      <el-table-column label="开户人" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="开户行" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.address }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="editItem(row)">
            编辑
          </el-button>

          <el-button type="danger" size="mini" @click="deleteItem(row)">
            删除
          </el-button>
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
        <el-form-item label="账号" required prop="account">
          <el-input v-model="form.account" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="省市区">
          <v-distpicker :province="form.province" :city="form.city" :area="form.area"
          @province="province($event, 'province')" @city="city($event, 'city')" @area="area($event, 'area')"></v-distpicker>
        </el-form-item>

        <el-form-item label="提现账户" required prop="bank">
          <el-select v-model="form.bank" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in banks"
              :key="item.value"
              :label="item.text"
              :value="item.text">
<!--              <span style="color: #8492a6">{{item.text}}</span>-->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地址" required prop="address">
          <el-input v-model="form.address" style="width: 250px"
                    type="textarea"
                    :rows="2"></el-input>
        </el-form-item>

        <el-form-item label="姓名" required prop="name">
          <el-input v-model="form.name" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="身份证" required prop="cardId">
          <el-input v-model="form.cardId" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="手机号" required prop="phoneNumber">
          <el-input v-model="form.phoneNumber" style="width: 250px"></el-input>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">{{this.form.dialogType === 'add' ? '提 交' : '更 新'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import VDistpicker from 'v-distpicker'
import {getBank} from '@/utils/bank.js'
import {fetchAccounts, delAccount, addAccount} from '@/api/pay'

export default {
  name: "Payment",
  components: {Pagination, VDistpicker},
  directives: {waves},
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      loadingShow: false,
      dialogVisible: false,
      form: {
        dialogType: '',
        id: '',
        account: '',
        name: '',
        cardId: '',
        phoneNumber: '',
        bank: '',
        province: '',
        city: '',
        area: '',
        address: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        cardId: [
          {required: true, message: '请输入身份证', trigger: 'blur'},
        ],
        phoneNumber: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
        ],
        bank: [
          {required: true, message: '请选择银行', trigger: 'change'},
        ],
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'},
        ]
      },
      banks: [],
    }
  },
  created() {
    this.getList()
    this.banks = getBank()
  },
  methods: {
    async getList(){
      this.loadingShow = true
      const res = await fetchAccounts(this.listQuery)
      this.loadingShow = false
      console.log(res)
      if(res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    addAccount(){
      this.form.dialogType = 'add'
      this.dialogVisible = true
    },
    editItem(row){
      this.form.dialogType = 'edit'
      this.form.id = row.id
      this.form.account = row.account
      this.form.name = row.name
      this.form.cardId = row.id_card
      this.form.phoneNumber = row.phoneNumber
      this.form.bank = row.bank
      this.form.province = row.province
      this.form.city = row.city
      this.form.area = row.area
      this.form.address = row.address
      this.dialogVisible = true;
    },
    deleteItem(row){
      this.$confirm('是否删除此账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        delAccount({accountId: row.account}).then(res => {
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
    closeDialog() {
      this.reset()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if(!valid){
          return
        }

        if(this.form.province === '' || this.form.city === '' ||
          this.form.area === '') {
          this.$message.warning('请选择省市区')
          return;
        }

        addAccount(this.form).then(res => {
          this.dialogVisible = false
          if(res.code === 20000) {
            this.getList()
            this.$notify({
              type: 'success',
              message: this.form.dialogType === 'add' ? '添加成功' : '更新成功',
              duration: 2000,
              title: '成功'
            })
          }
        })
      })
    },
    reset() {
      this.form = {
        id: '',
        account: '',
        name: '',
        cardId: '',
        phoneNumber: '',
        bank: '',
        province: '',
        city: '',
        area: '',
        address: ''
      }
    },
    province(e, key){
      this.form.province = e.value
    },
    city(e, key){
      this.form.city = e.value
    },
    area(e, key){
      this.form.area = e.value
    }
  }
}
</script>

<style scoped>

</style>
