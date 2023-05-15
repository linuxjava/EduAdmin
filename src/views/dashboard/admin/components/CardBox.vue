<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div style="padding: 30px 0 15px 0">
        <el-row :gutter="20">
         <el-col :span="12" v-for="item in data">
           <div style="display: flex;align-items: center;border: 1px solid #cccccc;padding: 15px;border-radius: 8px;margin-bottom: 15px;cursor: pointer"
                @click="goto(item.path)">
             <i :class="item.icon" style="padding: 20px;background-color: pink;border-radius: 8px;font-size: 30px;color: red"></i>
              <div style="margin-left: 15px">
                <div>{{item.name}}</div>
                <small style="margin-top: 10px">{{item.remark}}</small>
              </div>
           </div>
         </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardBox",
  props: {
    title: String,
    data: Array
  },
  methods: {
    goto(name){
      console.log(name)
      this.$router.push({name})
    }
  }
}
</script>

<style scoped>

</style>
