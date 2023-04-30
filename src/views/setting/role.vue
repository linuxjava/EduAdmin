<template>
  <div class="app-container">
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
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

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
import {fetchRole, staffDel, staffAdd, setRole} from '@/api/setting'

export default {
  name: "role",
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
      roleForm: {
        name: undefined
      },
      menuData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      menuProps: {
        children: 'children',
        label: 'label'
      },
      authData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      authProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loadingShow = true
      const res = await fetchRole(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    checkAuth(row) {
      this.dialogVisible = true
      this.roleForm.name = row.name
    },
    closeCheckAuthDialog() {

    }
  }
}
</script>

<style scoped>

</style>



