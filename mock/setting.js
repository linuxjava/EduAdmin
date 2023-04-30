const Mock = require('mockjs')

let staffList = []
let roleList = []
const count = 20

for (let i = 0; i < count; i++) {
  let data = Mock.mock({
    id: '@increment',
    'is_creator|1': [0, 1],
    roles: [{
      id: '@increment',
      'name|1': ['超级管理员', '运营', '开发', '产品']
    }],
    user: {
      avatar: '@image(100x100)',
      username: '@ctitle(5, 10)',
      nickname: '@ctitle(5, 10)'
    },
    'created_time': '@now',
    'updated_time': '@now',
  })

  staffList.push(data)
}

for (let i = 0; i < count; i++) {
  let data = Mock.mock({
    id: '@increment',
    'name|1': ['超级管理员', '运营', '开发', '产品'],
    'role_id|1': ['admin', 'product', 'editor'],
    desc: '@csentence(10, 20)',
    'created_time': '@now',
    'updated_time': '@now',
  })

  roleList.push(data)
}

module.exports = [
  {
    url: '/vue-element-admin/setting/staff/list',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      const pageList = staffList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: staffList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/setting/staff/del',
    type: 'post',
    response: config => {
      const {id} = config.body

      const index = staffList.findIndex(item => item.id == id)
      staffList.splice(index, 1)

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/setting/staff/add',
    type: 'post',
    response: config => {
      const {name} = config.body

      let data = Mock.mock({
        id: '@increment',
        is_creator: 0,
        roles: [{
          id: '@increment',
          'name|1': ['运营', '开发', '产品']
        }],
        user: {
          avatar: '@image(100x100)',
          'username': name,
          'nickname': name
        },
        'created_time': '@now',
        'updated_time': '@now',
      })

      staffList.splice(0, 0, data)

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/setting/staff/setRole',
    type: 'post',
    response: config => {
      const {id, roles} = config.body

      const item = staffList.find(item => item.id == id)
      item.roles = []
      roles.forEach(r => {
        item.roles.push(Mock.mock({
          id: '@increment',
          name: r
        }))
      })

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/setting/role/list',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      const pageList = roleList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: roleList.length,
          items: pageList
        }
      }
    }
  },
]
