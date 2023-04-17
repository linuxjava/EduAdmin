const Mock = require('mockjs')

let List = []
let splashList = []
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
    'auto|1': [0, 1],//是否开启凑团
    'status|1': [0, 1],//是否已下架
    'expire|1': [0, 1],//拼团时限
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
//做一下数据限制处理
List.map(item => {
  item.price = getRndInteger(1, item.value.price)
  return item
})

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
    price: '@integer(1, 100)',//秒杀价
    limit_num: '@integer(1, 100)',//秒杀人数
    used_num: '@integer(1, 100)',
    'status|1': [0, 1],//是否已下架
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

  splashList.push(data)
}

//做一下数据限制处理
splashList.map(item => {
  item.used_num = getRndInteger(0, item.limit_num)
  item.price = getRndInteger(1, item.value.price)
  return item
})

//以下函数返回 min（包含）～ max（包含）之间的数字：
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//以下函数返回 min（包含）～ max（不包含）之间的数字：
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

module.exports = [
  {
    url: '/vue-element-admin/marketing/group/list',
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
    url: '/vue-element-admin/marketing/group/takeoff',
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
  },
  {
    url: '/vue-element-admin/marketing/group/add',
    type: 'post',
    response: config => {
      const {type,
        associateCourse,
        groupPrice,
        groupPeople,
        isCouTuan,
        groupTime,
        startEndTime} = config.body


      let data = Mock.mock({
        id: '@increment',
        type,
        value: {
          id: '@increment',
          cover: associateCourse.cover,
          title: associateCourse.title,
          price: associateCourse.price,
        },
        price: groupPrice,
        p_num: groupPeople,
        auto: isCouTuan,
        status: 0,//是否已下架
        expire: groupTime,
        start_time: startEndTime[0],
        end_time: startEndTime[1],
        'created_time': '@now',
        'updated_time': '@now',
      })

      List.unshift(data)

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/marketing/group/edit',
    type: 'post',
    response: config => {
      const {id, type,
        associateCourse,
        groupPrice,
        groupPeople,
        isCouTuan,
        expire,
        startEndTime} = config.body

      const item = List.find(item => item.id === id)
      item.type = type
      item.value.cover = associateCourse.cover
      item.value.title = associateCourse.title
      item.value.price = associateCourse.price
      item.price = groupPrice
      item.p_num = groupPeople
      item.auto = isCouTuan
      item.expire = expire
      item.start_time = startEndTime[0]
      item.end_time = startEndTime[1]

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/marketing/splash/list',
    type: 'get',
    response: config => {
      const {status, no, page = 1, limit = 10} = config.query

      let mockList = splashList.filter(item => {
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
    url: '/vue-element-admin/marketing/splash/takeoff',
    type: 'get',
    response: config => {
      const {id} = config.query

      const item = splashList.find(item => item.id == id)

      item.status = 0

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/marketing/splash/add',
    type: 'post',
    response: config => {
      const {type,
        associateCourse,
        groupPrice,
        groupPeople,
        startEndTime} = config.body


      let data = Mock.mock({
        id: '@increment',
        type,
        value: {
          id: '@increment',
          cover: associateCourse.cover,
          title: associateCourse.title,
          price: associateCourse.price,
        },
        price: groupPrice,
        limit_num: groupPeople,
        status: 0,//是否已下架
        start_time: startEndTime[0],
        end_time: startEndTime[1],
        'created_time': '@now',
        'updated_time': '@now',
      })

      splashList.unshift(data)

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
  {
    url: '/vue-element-admin/marketing/splash/edit',
    type: 'post',
    response: config => {
      const {id, type,
        associateCourse,
        groupPrice,
        groupPeople,
        startEndTime} = config.body

      const item = splashList.find(item => item.id === id)
      item.type = type
      item.value.cover = associateCourse.cover
      item.value.title = associateCourse.title
      item.value.price = associateCourse.price
      item.price = groupPrice
      item.limit_num = groupPeople
      item.start_time = startEndTime[0]
      item.end_time = startEndTime[1]

      return {
        code: 20000,
        data: {
        }
      }
    }
  },
]

