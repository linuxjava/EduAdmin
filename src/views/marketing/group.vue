<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary"
                 @click="addAccount">创建拼团
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

      <el-table-column label="拼团课程" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.account }}
        </template>
      </el-table-column>

      <el-table-column label="成团人数" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="拼团价" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.address }}
        </template>
      </el-table-column>

      <el-table-column label="拼团时限(小时)" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.address }}
        </template>
      </el-table-column>

      <el-table-column label="拼团状态" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.address }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="editItem(row)">
            修改
          </el-button>

          <el-button type="danger" size="mini" @click="deleteItem(row)">
            下架
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
import {fetchGroup} from '@/api/marketing'

export default {
  name: "group",
  components: {Pagination},
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(){
      this.loadingShow = true
      const res = await fetchGroup(this.listQuery)
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
    }
  }
}
</script>

<style scoped>

</style>

