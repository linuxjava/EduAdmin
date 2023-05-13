<template>
  <div class="app-container">
    <Navbar :isShowMenu="false"></Navbar>

    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary"
                 @click="createRole" style="margin-left: 20px">创建角色
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

      <el-table-column label="角色key" width="250px" align="center">
        <template slot-scope="{row}">
          {{row.role_id}}
        </template>
      </el-table-column>

      <el-table-column label="角色名称" width="300px" align="center">
        <template slot-scope="{row}">
          {{row.name}}
        </template>
      </el-table-column>

      <el-table-column label="角色描述" min-width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="checkAuth(row)">
            查看
          </el-button>

          <el-button type="success" size="mini" @click="updateRole(row)">
            修改
          </el-button>

          <el-button type="danger" size="mini" @click="delRole(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

    <el-dialog
      title="创建角色"
      :visible.sync="createRoleDialogVisible"
      @close='closeRoleDialog'>
      <el-form :model="createRoleForm" :rules="createRoleRules" ref="createRoleform" label-width="130px">

        <el-form-item label="角色名称" required prop="name">
          <el-input v-model="createRoleForm.name" placeholder="角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色唯一标识" required prop="role_id">
          <el-input v-model="createRoleForm.role_id" placeholder="角色唯一标识"></el-input>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="createRoleForm.desc" placeholder="角色描述"></el-input>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="createRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitRole">{{roleDialogType === 'create' ? '创 建' : '更 新'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="查看权限"
      :visible.sync="dialogVisible"
      @close='closeCheckAuthDialog'>
      <el-form :model="roleForm" label-width="130px">
        <el-form-item label="角色名称">
          {{roleForm.name}}
        </el-form-item>

        <el-form-item label="菜单">
          <el-tree :data="menuData" :props="menuProps"/>
        </el-form-item>

        <el-form-item label="权限">
          <el-tree :data="authData" :props="authProps"/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchRoleAuth} from '@/api/setting'
import {fetchRoles, createRole, updateRole, removeRole} from '@/api/platform'
import Navbar from "@/layout/components/Navbar";

export default {
  name: "role",
  components: {Navbar, Pagination},
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
      roleForm: {
        name: undefined
      },
      menuData: [],
      menuProps: {
        children: 'children',
        label: 'title'
      },
      authData: [],
      authProps: {
        children: 'children',
        label: 'title'
      },
      roleDialogType: '',
      createRoleDialogVisible: false,
      createRoleForm: {
        id: undefined,
        name: undefined,
        role_id: undefined,
        status: 1,
        desc: undefined
      },
      createRoleRules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        role_id: [
          {required: true, message: '请输入角色唯一标识', trigger: 'blur'},
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
      const res = await fetchRoles(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    async checkAuth(row) {
      this.dialogVisible = true
      this.roleForm.name = row.name
      const res = await fetchRoleAuth({id: row.id})
      this.menuData= res.data.menus
      this.authData= res.data.accesses
    },
    closeCheckAuthDialog() {

    },
    createRole() {
      this.roleDialogType = 'create'
      this.createRoleDialogVisible = this
    },
    closeRoleDialog() {
      this.reset()
      this.$nextTick(() => {
        this.$refs.createRoleform.clearValidate()
      })
    },
    reset() {
      this.createRoleForm = {
        name: undefined,
      }
    },
    submitRole() {
      this.$refs.createRoleform.validate(valid => {
        if (!valid) {
          return
        }
        this.commit()
      })
    },
    async commit() {
      if(this.roleDialogType === 'update') {
        await updateRole(this.createRoleForm)
        this.$message.success('更新成功')
      }else {
        await createRole(this.createRoleForm)
        this.$message.success('创建成功')
      }
      this.createRoleDialogVisible = false
      await this.getList()
    },
    async updateRole(row){
      this.roleDialogType = 'update'
      this.createRoleForm = row
      this.createRoleDialogVisible = true
    },
    delRole(row){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeRole({ids: [row.id]})
        this.$message.success('删除成功!');
        await this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>



