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
            <img :src="row.user.avatar || 'https://img.zcool.cn/community/01e4ea57a6e2550000018c1bfdce56.jpg'" style="width: 50px;height: 50px;border-radius: 25px;margin-right: 15px">
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
            {{ row.roles.map(role => role.name).join(', ') || '暂无角色' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="300px" align="center">
        <template slot-scope="{row}">
          {{ row.created_time | timeFilter }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="authConfig(row)">
            设置角色
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

        <el-form-item label="关键词" required prop="keyword">
          <el-input v-model="staffForm.keyword" placeholder="用户名/手机/邮箱"></el-input>
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

        <el-form-item label="角色" required prop="role_ids">
          <el-checkbox-group v-model="authForm.role_ids"  style="margin-left: 40px">
            <el-checkbox v-for="(item, index) in roles" :key="index" :label="item.id">{{item.name}}</el-checkbox>
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
import {fetchStaff, staffDel, staffAdd, setRole, fetchRole} from '@/api/setting'
import {parseTime} from "@/utils";

export default {
  name: "staff",
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
        page: 1,
        limit: 10
      },
      loadingShow: false,
      dialogVisible: false,
      staffForm: {
        keyword: undefined
      },
      staffRules: {
        keyword: [
          {required: true, message: '请输入关键词', trigger: 'blur'},
        ]
      },
      authDialogVisible: false,
      authForm: {
        id: undefined,
        role_ids: []
      },
      authRules: {
        role_ids: [
          {type: 'array', required: true, message: '请选择角色', trigger: 'change'},
        ]
      },
      roles: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loadingShow = true
      let res = await fetchStaff(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }

      res = await fetchRole({page: 1})
      this.roles = res.data.items
    },
    addStaff() {
      this.dialogVisible = true
    },
    authConfig(row) {
      this.authDialogVisible = true
      this.authForm.id = row.id
      row.roles.map(item => {
        this.authForm.role_ids.push(item.id)
      })
    },
    deleteItem(row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        staffDel({staff_id: row.id}).then(res => {
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
        keyword: undefined,
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
        role_ids: []
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



