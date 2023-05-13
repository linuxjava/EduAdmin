<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>店铺设置</span>
      </div>
      <el-form ref="form" label-position="left" label-width="120px">
        <el-form-item label="店铺名称">
          <!--          <el-row :gutter="20" type="flex" style="border-bottom: #dddddd solid 1px;">-->
          <!--           <el-col :span="12">笛莎学院</el-col>-->
          <!--           <el-col :span="12">设置</el-col>-->
          <!--          </el-row>-->

          <div
            style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>{{ schoolInfo.name }}</span>
            <el-button type="text" @click="dialogVisible = true">设置</el-button>
          </div>
        </el-form-item>

        <el-form-item label="店铺地址">
          <div
            style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>{{ schoolInfo.webUrl }}</span>
            <el-button type="text" v-clipboard:copy="schoolInfo.webUrl"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">复制地址</el-button>
          </div>
        </el-form-item>

        <el-form-item label="店铺管理员">
          <div
            style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>{{ schoolInfo.username }}</span>
          </div>
        </el-form-item>

        <el-form-item label="店铺AppId">
          <div
            style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>{{ schoolInfo.appid }}</span>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="修改店铺"
      :visible.sync="dialogVisible"
      @close='closeStaffDialog'>
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">

        <el-form-item label="店铺名称" required prop="name">
          <el-input v-model="form.name" placeholder="新店铺名称"></el-input>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {fetchSchoolDetail, updateSchool} from '@/api/school'
import {getSchoolId} from '@/utils/auth'

export default {
  name: "shop",
  data() {
    return {
      schoolInfo: {
        webUrl: '',
        name: '',
        appid: '',
        username: ''
      },
      loading: false,
      dialogVisible: false,
      form: {
        id: getSchoolId(),
        name: undefined
      },
      rules: {
        name: [
          {required: true, message: '请输入新的店铺名称', trigger: 'blur'},
        ]
      },
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      this.loading = true
      const res = await fetchSchoolDetail({id: getSchoolId()})
      this.loading = false
      this.schoolInfo.webUrl = res.data.weburl
      this.schoolInfo.appid = res.data.appid
      this.schoolInfo.name = res.data.name
      this.schoolInfo.username = res.data.user.username
    },
    closeStaffDialog() {
      this.reset()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    reset() {
      this.form = {
        name: undefined,
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.commit()
      })
    },
    async commit() {
      await updateSchool(this.form)
      this.dialogVisible = false
      this.schoolInfo.name = this.form.name
      this.$message.success('修改成功')
    },
    onCopy: function (e) {
      this.$message.success('拷贝成功')
    },
    onError: function (e) {
      this.$message.warning('拷贝失败')
    }
  }
}
</script>

<style scoped>

</style>
