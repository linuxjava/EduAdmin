<template>
  <div class="app-container">
    <el-card class="box-card">
      <div style="display: flex">
        <img :src="detail.cover">
        <div style="flex:1;margin-left: 16px">
          <div style="display: flex;justify-content: space-between">
            <h5 style="margin: 0px">{{detail.title}}</h5>
            <small style="color: #bbbbbb">{{detail.updateStatus === 1 ? '已完结' : '连载中'}}</small>
          </div>
          <p style="color: #bbbbbb;margin: 4px 0"><small>{{detail.introduce}}</small></p>
          <p style="margin: 4px 0"><small style="color: red">$</small><small>{{detail.price}}</small></p>

          <el-button-group>
            <el-button size="mini" :type="detail.status === 1 ? 'info' : 'success'" @click="updateStatus(detail.status)">{{detail.status === 1 ? '下架' : "上架"}}</el-button>
            <el-button size="mini" @click="updateIsEnd(detail.updateStatus)">{{detail.updateStatus === 1 ? '设置为连载中' : "设置为已完结"}}</el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {fetchDetail, updateStatus, updateIsEnd} from '@/api/column'
let id
export default {
  name: "ColumnDetail",
  beforeRouteEnter(to, from, next) {
    id = to.query.id
    next()
  },
  created() {
    this.getDetail()
  },
  data() {
    return {
      detail: {
        id: undefined,
        cover: '',
        title: '',
        introduce: '',
        content: '',
        price: undefined,
        updateStatus: undefined,
        status: undefined
      }
    }
  },
  methods: {
    getDetail() {
      fetchDetail({id}).then(res => {
        console.log(res.data)
        this.detail = res.data
      })
    },
    updateStatus(curStatus){
      const newStatus = curStatus == 1 ? 0 : 1
      updateStatus({
        id,
        status: newStatus
      }).then(res => {
        console.log(res)
        if(res.code === 20000) {
          this.detail.status = newStatus
        }
      })
    },
    updateIsEnd(isEnd){
      const newStatus = isEnd === 1 ? 0 : 1
      updateIsEnd({
        id,
        status: newStatus
      }).then(res => {
        console.log(res)
        if(res.code === 20000) {
          this.detail.updateStatus = newStatus
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
