const Mock = require('mockjs')
const Random = require("mockjs/src/mock/random");

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    user_id: '@increment',
    cover: '@image(100x100)',
    title: '@ctitle(5, 10)',
    totalConsumption: '@integer(1, 100)',
    'created_time': '@now',
    'comment|1': [0, 1],
    'access|1': [0, 1],
    user: {
      id: '@increment',
      username: '@ctitle(5, 10)',
      avatar: '@image(100x100)',
      nickname: '@ctitle(5, 10)',
      phone: '@integer(1, 100)',
      'status|1': [0, 1],
      'created_time': '@now',
      user_level: '年度会员',
      user_level_expire: '@now'
    }
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
  },
  {
    url: '/vue-element-admin/user_detail',
    type: 'get',
    response: config => {
      const {id} = config.query
      let item = List.find(item => item.user_id == id)

      return {
        code: 20000,
        data: {...item.user, user_id: item.user_id}
      }
    }
  },
  {
    url: '/vue-element-admin/user/course-subscription',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      let mockList = []

      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment',
          title: '@ctitle(5, 10)',
          price: '@integer(1, 100)',
          'created_time': '@now',
        }))
      }


      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/user/column-subscription',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      let mockList = []

      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment',
          title: '@ctitle(5, 10)',
          price: '@integer(1, 100)',
          'created_time': '@now',
        }))
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/user/order-record',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      let mockList = []

      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment',
          no: '@integer(100000, 900000)',
          price: '@integer(1, 100)',
          'status|1': ['succ', 'fail', 'pendding'],
          title: '@ctitle(5, 10)',
          'created_time': '@now',
        }))
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/user/history',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      let mockList = []

      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment',
          'type|1': ['media', 'video', 'audio', 'column'],
          title: '@ctitle(5, 10)',
          'created_time': '@now',
        }))
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/user/comment',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      let mockList = []

      for (let i = 0; i < count; i++) {
        mockList.push(Mock.mock({
          id: '@increment',
          'type|1': ['media', 'video', 'audio', 'column'],
          title: '@ctitle(5, 10)',
          content: '@ctitle(5, 20)',
          'created_time': '@now',
        }))
      }

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

