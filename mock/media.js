const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    cover: '@image(200x100)',
    title: '@ctitle(5, 10)',
    try: '@cparagraph', //试看内容(免费)
    content: '@cparagraph', //课程内容(收费)
    price: '@integer(1, 100)',
    'status|1': ['0', '1'],
    'created_time': '@now',
    'updated_time': '@now',
    subscription: '@integer(1, 1000)',
    courseType: 0
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/media/list',
    type: 'get',
    response: config => {
      const {status, title, page = 1, limit = 10, sort} = config.query
      console.log(config.query)
      let mockList = List.filter(item => {
        if (status && item.status !== status) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      // let mockList = List
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

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
    url: '/vue-element-admin/media/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/media/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

