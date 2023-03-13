const Mock = require('mockjs')

const List = []
const count = 100

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    cover: '@image(200x100)',
    title: '@title(5, 10)',
    try: '@cparagraph', //试看内容(免费)
    content: '@cparagraph', //课程内容(收费)
    price: '@integer(1, 100)',
    'status|1': ['0', '1'],
    'created_time': '@now',
    'updated_time': '@now',
    subscription: '@integer(1, 1000)'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/course/list',
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
  }
]

