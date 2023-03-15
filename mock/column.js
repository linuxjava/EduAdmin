const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    cover: '@image(200x100)',
    title: '@ctitle(5, 10)',
    introduce: '@cparagraph', //课程介绍
    content: '@cparagraph',
    price: '@integer(1, 100)',
    'updateStatus|1': ['0', '1'],
    'status|1': ['0', '1'],
    'created_time': '@now',
    'updated_time': '@now',
    subscription: '@integer(1, 1000)'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/column/list',
    type: 'get',
    response: config => {
      const {status, title, page = 1, limit = 10, sort} = config.query
      let mockList = List.filter(item => {
        if (status && item.status !== status) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

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
    url: '/vue-element-admin/column/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/column/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/column/detail',
    type: 'get',
    response: config => {
      const {id} = config.query
      //这里不能写===，会找不到
      const data = List.find(item => item.id == id)

      return {
        code: 20000,
        data
      }
    }
  }
]

