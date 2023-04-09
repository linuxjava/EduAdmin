const Mock = require('mockjs')

let List = []
const count = 5

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'type|1': ['course', 'column'],
    value: {
      id: '@increment',
      cover: '@image(200x100)',
      title: '@ctitle(5, 10)',
      price: '@integer(1, 100)',
    },
    price: '@integer(1, 100)',
    p_num: '@integer(1, 10)',
    'auto|1': [0, 1],
    expire: '@integer(1, 24)',
    'start_time': '@now',
    'end_time': '@now',
    'created_time': '@now',
    'updated_time': '@now',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/marketing/list',
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
  }
]

