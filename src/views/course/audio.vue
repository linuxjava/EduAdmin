<!--问题
1.封面上传问题
-->
<template>
  <div class="app-container">
    <!--搜索和新增-->
    <div class="filter-container" style="display: flex;justify-content: space-between">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="showDialog">新增音频</el-button>
      <div>
        <el-select
          v-model="listQuery.status"
          placeholder="商品状态"
          clearable
          style="width: 110px;margin-right: 10px"
          class="filter-item"
        >
          <el-option v-for="(item, k) in statusOptions" :key="k" :label="item" :value="k"/>
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="Title"
          style="width: 200px;margin-right: 10px"
          class="filter-item"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
    </div>
    <!--表格-->
    <el-table
      :data="list"
      border
      v-loading="listLoading"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!--      :class-name="getSortClass('id')"对排序视乎没有作用-->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display: flex">
            <img
              :src="row.cover"
              style="width: 100px;height: 50px"
            >
            <div
              style="display: flex;flex-direction: column;justify-content: space-between;align-items:flex-start;margin-left: 10px">
              <span style="color:#0485fd;">{{ row.title }}</span>
              <span style="color: red">${{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="订阅量" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subscription }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updated_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="editAudio(row)">
            编辑
          </el-button>
          <el-button v-if="row.status == 0" size="mini" type="success" @click="changeProductStatus(row, 1)">
            上架
          </el-button>
          <el-button v-if="row.status == 1" size="mini" @click="changeProductStatus(row, 0)">
            下架
          </el-button>
          <el-popconfirm title="是否要删除该记录?" @onConfirm="handleDelete(row, $index)" style="margin-left: 10px;">
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
    <!--新增文章-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      fullscreen
      @opened="openedDialog">
      <el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" required prop="title">
          <el-input v-model="productForm.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <!--图片上传组件-->
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleCoverRemove"
            :on-success="handleUploadSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--图片预览Dialog-->
          <el-dialog :visible.sync="preDialogVisible">
            <img width="100%" :src="preDialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="课程介绍" required prop="introduce">
          <template>
            <tinymce ref="introduceTinymce" v-model="productForm.introduce" :height="300" :width="600"/>
          </template>
        </el-form-item>

        <el-form-item label="课程内容" required prop="content">
          <template>
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-remove="handleAudioRemove"
              :limit="1"
              style="width: 600px"
              accept=".mp3,.m4a"
              :file-list="productForm.fileList">
              <el-button size="small" type="primary">上传音频</el-button>
              <div slot="tip" class="el-upload__tip">格式支持mp3、m4a文件，且不超过100M</div>
            </el-upload>
          </template>
        </el-form-item>

        <el-form-item label="商品状态" required prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="1">上架</el-radio>
            <el-radio label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品价格" required prop="price">
          <el-input-number v-model="productForm.price" :min="0" label="商品价格"></el-input-number>
        </el-form-item>
      </el-form>
      <span style="display:block;text-align: center">
        <el-button @click="cancelForm('productForm')">取 消</el-button>
        <el-button type="primary"
                   @click="dialogStatus === 'create' ? createAudio('productForm') : updateAudio('productForm')">提 交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchList, createAudio, updateAudio} from '@/api/audio'
import Tinymce from '@/components/Tinymce'
import {getYmdHmsTimeStr} from '@/utils'

export default {
  name: 'Audio',
  components: {Pagination, Tinymce},
  directives: {waves},
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: undefined,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        status: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      listLoading: true,
      statusOptions: ['未上架', '已上架'],
      dialogVisible: false,
      dialogStatus: undefined,
      //添加和修改商品表单数据
      productForm: {
        id: undefined,
        cover: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
        title: '',
        introduce: '',
        fileList: [],
        price: undefined,
        //status初始值设置为undefined才能进行校验
        status: undefined
      },
      //添加和修改商品校验规则
      productRules: {
        title: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        introduce: [
          {required: true, message: '请输入课程介绍', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请上传课程音频', trigger: 'blur'},
        ],
        status: [
          {required: true, message: '请选择商品状态', trigger: 'change'},
        ],
        price: [
          {required: true, message: '请输入商品价格', trigger: 'change'},
        ]
      },
      newCoverUrl: '',
      preDialogImageUrl: '',
      preDialogVisible: false,
    }
  },
  mounted() {
    //1解决全屏dialog时，浏览器返回问题
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
  },
  created() {
    this.getList()
  },
  destroyed() {
    //2解决全屏dialog时，浏览器返回问题
    window.removeEventListener('popstate', this.goBack, false);//false阻止默认事件
  },
  methods: {
    goBack() {
      //3解决全屏dialog时，浏览器返回问题
      if (this.dialogVisible) {
        this.dialogVisible = false;
      } else {
        this.$router.replace({path: '/'})
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //Id排序start
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    sortChange(data) {
      const {prop, order} = data
      console.log('order', order)
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },//Id排序end
    //搜索
    search() {
      this.getList()
    },
    //改变商品状态
    changeProductStatus(row, status) {
      row.status = status
      this.$message({
        message: '操作成功',
        type: "success"
      })
    },
    //删除封面
    handleCoverRemove(file, fileList) {
      console.log(file, fileList);
    },
    //预览封面
    handlePictureCardPreview(file) {
      this.preDialogImageUrl = file.url;
      this.preDialogVisible = true;
    },
    //封面上传成功
    handleUploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },
    //音频删除
    handleAudioRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //删除记录
    handleDelete(row, index) {
      this.$notify({
        title: '提示',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    //新增
    showDialog() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    //删除音频
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //打开新增文章对话框
    openedDialog() {
      //需要使用opened事件，不能是open事件，因为open事件时$refs还未创建
      if (this.dialogStatus === 'create') {
        //如果是创建则清空上次数据
        //清除表单内容
        this.$refs['productForm'].resetFields();
        //清空富文本内容
        this.$refs.introduceTinymce.setContent('')
      }
    },
    //新增文章
    createAudio(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productForm.id = parseInt(Math.random() * 100) + 1024
          this.productForm.created_time = getYmdHmsTimeStr()
          this.productForm.updated_time = getYmdHmsTimeStr()
          this.productForm.subscription = 0
          createAudio(this.productForm).then(() => {
            this.list.unshift(this.productForm)
            this.dialogVisible = false;
            this.$notify({
              message: '',
              type: "success",
              title: '成功',
              duration: 2000
            })
          })
        }
      })
    },
    //取消对话框
    cancelForm(formName) {
      this.dialogVisible = false;
    },
    //编辑
    editAudio(row) {
      this.dialogStatus = 'edit'
      this.productForm = Object.assign({}, row)
      this.dialogVisible = true;
    },
    //更新
    updateAudio(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let temp = Object.assign({}, this.productForm)
          temp.updated_time = getYmdHmsTimeStr()
          updateAudio(temp).then(() => {
            let index = this.list.findIndex(item => item.id === temp.id)
            this.list.splice(index, 1, temp)
            this.dialogVisible = false
            this.$notify({
              type: "success",
              title: '成功',
              message: '更新成功',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

