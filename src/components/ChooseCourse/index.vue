<template>
  <div>
    <el-dialog
      title="选择"
      :visible.sync="dialogVisible"
      width="60%">
      <!--搜索-->
      <div class="filter-container" style="display: flex;justify-content: space-between;margin-top: 10px">
        <div></div>
        <div style="margin-right: 30px">
          <el-input
            v-model="query.title"
            placeholder="请输入搜索内容"
            style="width: 200px;margin-right: 10px"
            class="filter-item"
            clearable
            @clear="clearSearchInput"/>

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
      </div>

      <el-container style="height: 450px; border: 1px solid red;margin-left: 30px;margin-right: 30px">
        <el-aside width="200px" style="background-color: black;margin-bottom: 0">

        </el-aside>
        <el-container>
          <el-main style="background-color: blue">

          </el-main>
          <el-footer style="background-color: pink">

          </el-footer>
        </el-container>

      </el-container>

      <span style="display:block;text-align: center;margin-top: 20px">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
  name: "ChooseCourse",
  directives: {waves},
  data() {
    return {
      dialogVisible: false,
      query: {
        title: ''
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    //搜索课程
    searchColumnCourse() {

    },
    //清除搜索内容
    clearSearchInput() {

    }
  }
}
</script>

<style scoped>

</style>
