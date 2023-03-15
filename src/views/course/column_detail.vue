<template>

</template>

<script>
import {fetchDetail} from '@/api/column'
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
    }
  }
}
</script>

<style scoped>

</style>
