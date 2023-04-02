const Mock = require('mockjs')

let List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    no: '@increment',
    total_price: '@integer(100, 200)',
    price: '@integer(1, 100)',
    'type|1': ['group', 'default'],
    'status|1': ['pending', 'success', 'fail'],
    created_time: '@now',
    updated_time: '@now',
    goods: [{
      title: '@ctitle(5, 10)',
    }],
    title: '@ctitle(5, 10)',
    pay_method: 'wechat',
    pay_time: '@now',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/pay/order',
    type: 'get',
    response: config => {
      const {status, no, page = 1, limit = 10} = config.query

      let mockList = List.filter(item => {
        if (status && item.status !== status) return false
        if (no && item.no != no) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/pay/del-order',
    type: 'get',
    response: config => {
      const {no} = config.query

      let index = List.findIndex(item => no == item.no)
      List.splice(index, 1)

      return {
        code: 20000,
        data: {
        }
      }
    }
  }
]

