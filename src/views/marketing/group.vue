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
          <div style="display: flex">
            <img
              :src="row.value.cover"
              style="width: 100px;height: 50px">
            <div
              style="display: flex;flex-direction: column;justify-content: space-between;align-items:flex-start;margin-left: 10px">
              <span style="color:#0485fd;">{{ row.value.title }}</span>
              <span style="color: red;font-size: 12px">原始价格：{{ row.value.price }}</span>
              <span style="color: red;font-size: 12px">拼团价格：{{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="成团人数" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.p_num }}
        </template>
      </el-table-column>

      <el-table-column label="拼团时限(小时)" width="250px" align="center">
        <template slot-scope="{row}">
          {{ row.expire }}
        </template>
      </el-table-column>

      <el-table-column label="拼团状态" width="250px" align="center">
        <template slot-scope="{row}">
          <span :style="row.time_status === '拼团中' ? 'color:red' : 'color:#bbbbbb'">{{ row.time_status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="editItem(row)">
            修改
          </el-button>

          <el-button type="danger" size="mini" @click="deleteItem(row)" :disabled="row.status === 0">
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-left: 0;text-align: center;margin-top: 0px"/>

    <el-dialog
      :title="this.dialogType === 'add' ? '新增' : '更新'"
      :visible.sync="dialogVisible"
      @close='closeDialog'>
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="类型" required prop="type">
          <el-select v-model="form.type" placeholder="请选择课程类型" style="width: 270px">
            <el-option
              v-for="(val, key, index) in courseType"
              :key="index"
              :label="val"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关联课程" required prop="associateCourse">
          <el-button type="primary" @click="associateCourse">关联</el-button>
          <el-card style="display: flex;margin-top: 10px;width: 342px;display: flex;flex-direction: column" v-if="form.associateCourse">
            <img :src="form.associateCourse.cover" style="width: 300px;height: 150px">
            <span>{{form.associateCourse.title}}</span><br>
            <span style="color: red">${{form.associateCourse.price}}</span>
          </el-card>
        </el-form-item>

        <el-form-item label="拼团价" required prop="groupPrice">
          <el-input-number v-model="form.groupPrice" :min="0" label="拼团价"></el-input-number>
        </el-form-item>

        <el-form-item label="拼团人数" required prop="groupPeople">
          <el-input-number v-model="form.groupPeople" :min="0" label="拼团人数"></el-input-number>
        </el-form-item>

        <el-form-item label="是否开启凑团" prop="isCouTuan">
          <template>
            <el-radio-group v-model="form.isCouTuan">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

        <el-form-item label="拼团时限" required prop="expire">
          <template>
            <el-radio-group v-model="form.expire">
              <el-radio :label="0">24小时</el-radio>
              <el-radio :label="1">48小时</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

        <el-form-item label="拼团活动时间" required prop="startEndTime">
          <template>
            <el-date-picker
              v-model="form.startEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </template>
        </el-form-item>

      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">{{this.dialogType === 'add' ? '提 交' : '更 新'}}</el-button>
      </span>
    </el-dialog>

    <choose-course ref="chooseCourse"></choose-course>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchGroup, groupTakeOff, groupAdd, groupEdit} from '@/api/marketing'
import ChooseCourse from "@/components/ChooseCourse";

export default {
  name: "group",
  components: {Pagination, ChooseCourse},
  directives: {waves},
  data() {
    const validateAssociateCourse = (rule, value, callback) => {
      if (!this.form.associateCourse) {
        callback(new Error('请关联课程'));
      }else {
        callback();
      }
    }
    return {
      timeStatus: {
        0: '已结束',
        1: '拼团中',
        2: '未开始',
        3: '已下架',
      },
      courseType: {
        course: '课程',
        column: '专栏'
      },
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      loadingShow: false,
      dialogVisible: false,
      dialogType: undefined,
      form: {
        id: undefined,
        type: '',
        associateCourse: undefined,
        groupPrice: undefined,
        groupPeople: undefined,
        isCouTuan: undefined,
        expire: undefined,
        startEndTime: undefined,
      },
      rules: {
        type: [
          {required: true, message: '请选择课程类型', trigger: 'change'},
        ],
        associateCourse: [
          {required: true, validator: validateAssociateCourse, trigger: 'blur'},
        ],
        groupPrice: [
          {required: true, message: '请设置拼团价格', trigger: 'change'},
        ],
        groupPeople: [
          {required: true, message: '请设置拼团人数', trigger: 'change'},
        ],
        isCouTuan: [
          {required: true, message: '请选择是否开启凑团', trigger: 'change'},
        ],
        expire: [
          {required: true, message: '请选择拼团时限', trigger: 'change'},
        ],
        startEndTime: [
          {required: true, message: '请选择拼团开始和结束时间', trigger: 'change'},
        ]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getTimeStatus(item) {
      if(item.status === 0) {
        return this.timeStatus[3]
      }
      let startTime = new Date(item.start_time).getTime()
      let endTime = new Date(item.end_time).getTime()
      let nowTime = new Date().getTime()

      if (nowTime > endTime) {
        return this.timeStatus[0]
      } else if (nowTime <= endTime && nowTime >= startTime) {
        return this.timeStatus[1]
      } else {
        return this.timeStatus[2]
      }
    },
    async getList() {
      this.loadingShow = true
      const res = await fetchGroup(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items.map(item => {
          item.time_status = this.getTimeStatus(item)
          return item
        })
        this.total = res.data.total
      }
    },
    addAccount() {
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    editItem(row) {
      this.dialogType = 'edit'
      console.log(row)
      this.form.id = row.id
      this.form.type = row.type
      this.form.associateCourse = {},
      this.form.associateCourse.cover = row.value.cover
      this.form.associateCourse.title = row.value.title
      this.form.associateCourse.price = row.value.price
      this.form.groupPrice = row.price
      this.form.groupPeople = row.p_num
      this.form.isCouTuan = row.auto
      this.form.expire = row.expire
      this.form.startEndTime = [row.start_time, row.end_time]
      console.log(this.form)
      this.dialogVisible = true
    },
    deleteItem(row) {
      this.$confirm('是否下架', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        groupTakeOff({id: row.id}).then(res => {
          console.log(this.list)
          this.$message.success('下架成功')
          this.getList()
        })
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
        if (!valid) {
          return
        }
        this.commit()
      })
    },
    async commit(){
      console.log(this.form)
      if(this.dialogType === 'add') {
        const res = await groupAdd(this.form)
        this.dialogVisible = false
        if(res.code === 20000) {
          this.$message.success('添加成功')
          await this.getList()
        }else {
          this.$message.error('添加失败')
        }
      }else {
        const res = await groupEdit(this.form)
        this.dialogVisible = false
        if(res.code === 20000) {
          this.$message.success('更新成功')
          await this.getList()
        }else {
          this.$message.error('更新失败')
        }
      }
    },
    reset() {
      this.form = {
        id: undefined,
        type: '',
        associateCourse: undefined,
        groupPrice: undefined,
        groupPeople: undefined,
        isCouTuan: undefined,
        startEndTime: undefined,
        expire: undefined,
      }
    },
    associateCourse(){
      this.$refs.chooseCourse.open(data => {
        this.form.associateCourse = {}
        this.form.associateCourse.cover = data[0].cover
        this.form.associateCourse.title = data[0].title
        this.form.associateCourse.price = data[0].price
      })
    }
  }
}
</script>

<style scoped>

</style>

