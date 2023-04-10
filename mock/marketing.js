const Mock = require('mockjs')

let List = []
const count = 20

for (let i = 0; i < count; i++) {
  let data = Mock.mock({
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
    'status|1': [0, 1],//是否已下架
    expire: '@integer(1, 24)',
    'start_time': '@now',
    'end_time': '@now',
    'created_time': '@now',
    'updated_time': '@now',
  })

  if(i < 2) {
    data.start_time = '2022-01-01 10:00:00'
    data.end_time = '2022-11-01 10:00:00'
  }else if(i < 5) {
    data.start_time = '2022-11-01 10:00:00'
    data.end_time = '2023-11-01 10:00:00'
  }else {
    data.start_time = '2023-11-01 10:00:00'
    data.end_time = '2024-11-01 10:00:00'
  }

  List.push(data)
}

module.exports = [
  {
    url: '/vue-element-admin/marketing/group-list',
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
    url: '/vue-element-admin/marketing/group-take-off',
    type: 'get',
    response: config => {
      const {id} = config.query

      const item = List.find(item => item.id == id)

      item.status = 0

      return {
        code: 20000,
        data: {
        }
      }
    }
  }
]

