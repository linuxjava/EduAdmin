const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    cover: '@image(100x100)',
    title: '@ctitle(5, 10)',
    totalConsumption: '@integer(1, 100)',
    'created_time': '@now',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/user/list',
    type: 'get',
    response: config => {
      const {title, page = 1, limit = 10} = config.query
      let mockList = List.filter(item => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  }
]

