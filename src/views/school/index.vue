<template>

  <div>
    <Navbar :isShowMenu="false"></Navbar>
    <div class="app-container">
      <div class="filter-container" style="display: flex;justify-content: space-between">
        <el-button v-waves class="filter-item" type="primary"
                   @click="showAddSchoolDialog" icon="el-icon-document-add">添加网校
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in list" :key="index">
          <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
            <div style="display: flex;justify-content: space-between;align-items: center;">
              {{item.name}}

              <el-button type="text" style="font-size: 16px" @click="entrySchool(item)">设置</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!--分页-->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

      <el-dialog
        title="添加网校"
        :visible.sync="dialogVisible"
        @close='closeDialog'>
        <el-form ref="form" :model="form" role="roles" label-width="130px">
          <el-form-item label="网校名称" style="margin-right: 30px">
            <el-input v-model="form.name" placeholder="请输入网校名称"></el-input>
          </el-form-item>
        </el-form>

        <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">添 加</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchSchool, addSchool} from '@/api/school'
import {staffAdd} from "@/api/setting";
export default {
  name: "school",
  components: {Navbar, Pagination},
  directives: {waves},
  data() {
    return {
      loadingShow: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      form: {
        name: undefined
      },
      roles: {
        name: {
          required: true, message: '请输入网校名称', trigger: 'blur'
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loadingShow = true
      const res = await fetchSchool(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      }
    },
    showAddSchoolDialog(){
      this.dialogVisible = true
    },
    entrySchool(item){
      this.$router.push({ path: '/dashboard/index' })
    },
    closeDialog() {
      this.form.name = ""
      this.$refs.form.clearValidate()
    },
    submit(){
      this.$refs.form.validate(v => {
        if(!v){
          return
        }

        this.addSchool()
      })
    },
    async addSchool() {
      const res = await addSchool(this.form)
      this.dialogVisible = false
      if (res.code === 20000) {
        this.$message.success('添加成功')
        await this.getList()
      } else {
        this.$message.error('添加失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
