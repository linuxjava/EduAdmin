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
          {{ row.role_id }}
        </template>
      </el-table-column>

      <el-table-column label="角色名称" width="300px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="角色描述" min-width="200px" align="center">
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button v-if="row.id === 2 || row.id === 4" type="info" size="mini" @click="checkAuth(row)">
            查看权限
          </el-button>
          <div v-else>
            <el-button type="success" size="mini" @click="updateRole(row)">
              修改
            </el-button>

            <el-button type="primary" size="mini" @click="checkAuth(row)">
              配置权限
            </el-button>

            <el-button type="danger" size="mini" @click="delRole(row)">
              删除
            </el-button>
          </div>
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
        <el-button type="primary" @click="submitRole">{{ roleDialogType === 'create' ? '创 建' : '更 新' }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="showCheckbox ? '配置权限' : '查看权限'"
      :visible.sync="dialogVisible"
      @close='closeCheckAuthDialog'>
      <el-form :model="roleForm" label-width="130px" v-loading="dialogLoadingShow">
        <el-form-item label="角色名称">
          {{ roleForm.name }}
        </el-form-item>

        <el-form-item label="菜单">
<!--          因为el-tree设置默认选中项有缓存不会重新加载数据，因此使用v-if的方式让其重新渲染-->
          <el-tree ref="menuRef" v-if="loadTree" :data="showCheckbox ? all.menus : role.menus" :props="treeProps" :show-checkbox="showCheckbox"
                   node-key="id" :default-checked-keys="role.menuId"/>
        </el-form-item>

        <el-form-item label="权限">
          <el-tree ref="accessRef" v-if="loadTree" :data="showCheckbox ? all.accesses : role.accesses" :props="treeProps" :show-checkbox="showCheckbox"
                   node-key="id"  :default-checked-keys="role.accessId"/>
        </el-form-item>
      </el-form>

      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateMenuAndAccess" v-loading="btnLoading">{{btnLoading ? '提交中...' : '提 交'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchRoles, createRole, updateRole, removeRole, fetchRoleAuth, fetchAllMenu, fetchAllAccess
 ,setMenuAccess} from '@/api/platform'
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
      showCheckbox: true,
      all: {
        menus: [],
        accesses: []
      },
      role: {
        id: undefined,
        menus: [],
        accesses: [],
        menuId: [],
        accessId: [],
      },
      treeProps: {
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
      dialogLoadingShow: false,
      loadTree: false,
      btnLoading: false
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
      this.list = res.data.items
      this.total = res.data.total
    },
    async getAllMenuAndAccesses(){
      //加载所有menu和access
      if(this.all.menus.length === 0){
        const res = await fetchAllMenu()
        this.all.menus = res.data.items
      }
      if(this.all.accesses.length === 0) {
        const res = await fetchAllAccess()
        this.all.accesses = res.data.items
      }
    },
    async checkAuth(row) {
      this.showCheckbox = !(row.id === 2 || row.id === 4)
      this.loadTree = false
      this.dialogVisible = true

      //加载所有menu和access
      this.dialogLoadingShow = true
      await this.getAllMenuAndAccesses()

      //加载该角色对应的menu和access
      this.roleForm.name = row.name
      const res = await fetchRoleAuth({id: row.id})
      this.role.id = row.id
      this.role.menus = res.data.menus
      this.role.menuId = res.data.menusId
      this.role.accesses = res.data.accesses
      this.role.accessId = res.data.accessesId
      this.loadTree = true//开始让tree渲染新的选中项
      this.dialogLoadingShow = false
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
      if (this.roleDialogType === 'update') {
        await updateRole(this.createRoleForm)
        this.$message.success('更新成功')
      } else {
        await createRole(this.createRoleForm)
        this.$message.success('创建成功')
      }
      this.createRoleDialogVisible = false
      await this.getList()
    },
    async updateRole(row) {
      this.roleDialogType = 'update'
      this.createRoleForm = row
      this.createRoleDialogVisible = true
    },
    delRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeRole({ids: [row.id]})
        this.$message.success('删除成功!');
        await this.getList()
      })
    },
    async updateMenuAndAccess(){
      this.btnLoading = true
      await setMenuAccess({role_id: this.role.id, access_ids: [...this.$refs.menuRef.getCheckedKeys(),
        ...this.$refs.accessRef.getCheckedKeys()]})
      this.btnLoading = false
      this.dialogVisible = false
      this.$message.success('更新成功');
      await this.getList()
    }
  }
}
</script>

<style scoped>

</style>



