<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button v-waves class="filter-item" type="primary"
                 @click="addAccount">创建优惠卷
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

      <el-table-column label="优惠卷ID" width="120px" align="center">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="面值" width="120px" align="center">
        <template slot-scope="{row}">
          {{ row.price }}元
        </template>
      </el-table-column>

      <el-table-column label="试用课程" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.value ? row.value.title : "所有课程" }}
        </template>
      </el-table-column>

      <el-table-column label="使用期限" width="350px" align="center">
        <template slot-scope="{row}">
          {{ row.start_time }} 至 {{ row.end_time }}
        </template>
      </el-table-column>

      <el-table-column label="发行量" width="120px" align="center">
        <template slot-scope="{row}">
          {{ row.c_num }}
        </template>
      </el-table-column>

      <el-table-column label="已领取" width="120px" align="center">
        <template slot-scope="{row}">
          {{ row.received_num }}
        </template>
      </el-table-column>

      <el-table-column label="已使用" width="120px" align="center">
        <template slot-scope="{row}">
          {{ row.used_num }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="{row}">
          <span :style="row.time_status === '抢购中' ? 'color:red' : 'color:#bbbbbb'">{{ row.time_status }}</span>
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

        <el-form-item label="关联课程" required prop="associateCourse" v-if="!(form.type === 'all')">
          <el-button type="primary" @click="associateCourse">关联</el-button>
          <el-card style="display: flex;margin-top: 10px;width: 342px;display: flex;flex-direction: column" v-if="form.associateCourse">
            <img :src="form.associateCourse.cover" style="width: 300px;height: 150px">
            <span>{{form.associateCourse.title}}</span><br>
            <span style="color: red">${{form.associateCourse.price}}</span>
          </el-card>
        </el-form-item>

        <el-form-item label="面值" required prop="price">
          <el-input-number v-model="form.price" :min="0" label="面值"></el-input-number>
        </el-form-item>

        <el-form-item label="发行量" required prop="c_num">
          <el-input-number v-model="form.c_num" :min="0" label="发行量"></el-input-number>
        </el-form-item>

        <el-form-item label="使用条件" required prop="condition">
          <el-input-number v-model="form.condition" :min="0" label="使用条件"></el-input-number>
        </el-form-item>

        <el-form-item label="使用期限" required prop="startEndTime">
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
import {fetchCoupon, couponTakeOff, couponAdd, couponEdit} from '@/api/marketing'
import ChooseCourse from "@/components/ChooseCourse";
import {parseTime} from "@/utils";

export default {
  name: "coupon",
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
        1: '抢购中',
        2: '未开始',
        3: '已下架',
      },
      courseType: {
        course: '课程',
        column: '专栏',
        all: '所有课程',
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
        goods_id: undefined,
        associateCourse: undefined,
        price: undefined,
        c_num: undefined,
        condition: undefined,
        status: 1,
        start_time: undefined,
        end_time: undefined,
        startEndTime: undefined,
      },
      rules: {
        type: [
          {required: true, message: '请选择课程类型', trigger: 'change'},
        ],
        associateCourse: [
          {required: true, validator: validateAssociateCourse, trigger: 'blur'},
        ],
        price: [
          {required: true, message: '请设置面值', trigger: 'change'},
        ],
        c_num: [
          {required: true, message: '请设置发行量', trigger: 'change'},
        ],
        condition: [
          {required: true, message: '请设置满多少元可用', trigger: 'change'},
        ],
        startEndTime: [
          {required: true, message: '请选择使用期限', trigger: 'change'},
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
      const res = await fetchCoupon(this.listQuery)
      this.loadingShow = false
      if (res.code === 20000) {
        this.list = res.data.items.map(item => {
          item.time_status = this.getTimeStatus(item)
          item.start_time = this.timeFormat(item.start_time)
          item.end_time = this.timeFormat(item.end_time)
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
      this.form.id = row.id
      this.form.type = row.type
      this.form.goods_id = row.goods_id
      this.form.associateCourse = {}
      this.form.associateCourse.cover = row.value.cover
      this.form.associateCourse.title = row.value.title
      this.form.associateCourse.price = row.value.price
      this.form.price = row.price
      this.form.c_num = row.c_num
      this.form.condition = row.condition
      this.form.startEndTime = [row.start_time, row.end_time]
      this.dialogVisible = true
    },
    deleteItem(row) {
      this.$confirm('是否下架', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        couponTakeOff({id: row.id}).then(res => {
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
      this.form.start_time = this.form.startEndTime[0]
      this.form.end_time = this.form.startEndTime[1]
      if(this.dialogType === 'add') {
        const res = await couponAdd(this.form)
        this.dialogVisible = false
        if(res.code === 20000) {
          this.$message.success('添加成功')
          await this.getList()
        }else {
          this.$message.error('添加失败')
        }
      }else {
        const res = await couponEdit(this.form)
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
        goods_id: undefined,
        associateCourse: undefined,
        price: undefined,
        c_num: undefined,
        condition: undefined,
        status: 1,
        start_time: undefined,
        end_time: undefined,
        startEndTime: undefined,
      }
    },
    associateCourse(){
      this.$refs.chooseCourse.open(data => {
        this.form.associateCourse = {}
        this.form.goods_id = data[0].id
        this.form.associateCourse.cover = data[0].cover
        this.form.associateCourse.title = data[0].title
        this.form.associateCourse.price = data[0].price
      })
    },
    timeFormat(time) {
      let date = new Date(time)
      return parseTime(date.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  }
}
</script>

<style scoped>

</style>



