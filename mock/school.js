const Mock = require('mockjs')

let schoolList = []
const count = 20

for (let i = 0; i < count; i++) {
  let data = Mock.mock({
    id: '@increment',
    name: '@ctitle(1, 10)',
    'created_time': '@now',
    'updated_time': '@now',
  })

  schoolList.push(data)
}

module.exports = [
  {
    url: '/vue-element-admin/school/list',
    type: 'get',
    response: config => {
      const {page = 1, limit = 10} = config.query

      const pageList = schoolList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: schoolList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/school/add',
    type: 'post',
    response: config => {
      const {name} = config.body

      schoolList.splice(0, 0, Mock.mock({
        id: '@increment',
        name
      }))

      return {
        code: 20000,
        data: {
        }
      }
    }
  }
]
