<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary"
                 @click="addStaff">添加员工
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

      <el-table-column label="用户" min-width="250px" align="center">
        <template slot-scope="{row}">
          <div style="display: flex;align-items: center">
            <img :src="row.user.avatar" style="width: 50px;height: 50px;border-radius: 25px;margin-right: 15px">
            {{ row.user.username || row.user.nickname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="300px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.is_creator === 1" style="color: red">
            创建人{{ row.roles && row.roles.length > 0 ? ", " : ""}}
          </span>
          <span>
            {{ row.roles.map(role => role.name).join(', ') }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="300px" align="center">
        <template slot-scope="{row}">
          {{ row.created_time }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="authConfig(row)">
            配置权限
          </el-button>

          <el-button type="danger" size="mini" @click="deleteItem(row)" :disabled="row.status === 0">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      @close='closeStaffDialog'>
      <el-form :model="staffForm" :rules="staffRules" ref="staffForm" label-width="130px">

        <el-form-item label="关键词" required prop="name">
          <el-input v-model="staffForm.name" placeholder="用户名/手机/邮箱"></el-input>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStaff">添 加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="配置权限"
      :visible.sync="authDialogVisible"
      @close='closeAuthDialog'>
      <el-form :model="authForm" :rules="authRules" label-position="center" ref="authForm" label-width="200px">

        <el-form-item label="角色" required prop="roles">
          <el-checkbox-group v-model="authForm.roles"  style="margin-left: 40px">
            <el-checkbox label="超级管理员"></el-checkbox>
            <el-checkbox label="运营"></el-checkbox>
            <el-checkbox label="开发"></el-checkbox>
            <el-checkbox label="产品"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="authDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitAuth">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchStaff, staffDel, staffAdd, setRole} from '@/api/setting'

export default {
  name: "staff",
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
      staffForm: {
        name: undefined
      },
      staffRules: {
        name: [
          {required: true, message: '请输入关键词', trigger: 'blur'},
        ]
      },
      authDialogVisible: false,
      authForm: {
        id: undefined,
        roles: []
      },
      authRules: {
        roles: [
          {type: 'array', required: true, message: '请选择角色', trigger: 'change'},
        ]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loadingShow = true
      const res = await fetchStaff(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    addStaff() {
      this.dialogVisible = true
    },
    authConfig(row) {
      this.authDialogVisible = true
      this.authForm.id = row.id
      row.roles.map(item => {
        this.authForm.roles.push(item.name)
      })
    },
    deleteItem(row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        staffDel({id: row.id}).then(res => {
          console.log(this.list)
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    closeStaffDialog() {
      this.resetStaff()
      this.$nextTick(() => {
        this.$refs.staffForm.clearValidate()
      })
    },
    submitStaff() {
      this.$refs.staffForm.validate(valid => {
        if (!valid) {
          return
        }
        this.commitStaff()
      })
    },
    async commitStaff() {
      const res = await staffAdd(this.staffForm)
      this.dialogVisible = false
      if (res.code === 20000) {
        this.$message.success('添加成功')
        await this.getList()
      } else {
        this.$message.error('添加失败')
      }
    },
    resetStaff() {
      this.staffForm = {
        name: undefined,
      }
    },
    closeAuthDialog(){
      this.resetAuth()
      this.$nextTick(() => {
        this.$refs.authForm.clearValidate()
      })
    },
    resetAuth() {
      this.authForm = {
        id: undefined,
        roles: []
      }
    },
    submitAuth() {
      this.$refs.authForm.validate(valid => {
        if (!valid) {
          return
        }
        this.commitAuth()
      })
    },
    async commitAuth() {
      const res = await setRole(this.authForm)
      this.authDialogVisible = false
      if (res.code === 20000) {
        this.$message.success('提交成功')
        await this.getList()
      } else {
        this.$message.error('提交失败')
      }
    }
  }
}
</script>

<style scoped>

</style>



