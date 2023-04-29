<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>店铺设置</span>
      </div>
      <el-form ref="form" label-position="left" label-width="120px">
        <el-form-item label="店铺名称">
<!--          <el-row :gutter="20" type="flex" style="border-bottom: #dddddd solid 1px;">-->
<!--           <el-col :span="12">笛莎学院</el-col>-->
<!--           <el-col :span="12">设置</el-col>-->
<!--          </el-row>-->

          <div style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>笛莎学院</span>
            <el-button type="text">设置</el-button>
          </div>
        </el-form-item>

        <el-form-item label="店铺地址">
          <div style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>https://www.qq.com</span>
            <el-button type="text">复制地址</el-button>
          </div>
        </el-form-item>

        <el-form-item label="店铺管理员">
          <div style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>138****5678</span>
          </div>
        </el-form-item>

        <el-form-item label="店铺AppId">
          <div style="display: flex;justify-content: space-between;border-bottom: #dddddd solid 1px;margin-left: 5px;padding-left:15px;padding-right: 30px">
            <span>abcdefg</span>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "shop"
}
</script>

<style scoped>

</style>
