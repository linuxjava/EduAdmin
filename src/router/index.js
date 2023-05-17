import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/school/index'),
    hidden: true
  },
  {
    path: '/platform/role',
    component: () => import('@/views/platform/index'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        //动态路由,将匹配所有内容并将其放在 `$route.params.path` 下
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index'),
        name: '概览',
        meta: { title: '概览', icon: 'dashboard', affix: true }
      }
    ]
  },
]

export const asyncRoutes = [
  {
    path: '/course',
    component: Layout,
    redirect: '/course/media',
    alwaysShow: true,
    name: 'Course',
    meta: {
      title: '课程', icon: 'excel', roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'media',
        component: () => import('@/views/course/media'),
        name: 'Media',
        meta: { title: '图文' }
      },
      {
        path: 'audio',
        component: () => import('@/views/course/audio'),
        name: 'Audio',
        meta: { title: '音频' }
      },
      {
        path: 'video',
        component: () => import('@/views/course/video'),
        name: 'Video',
        meta: { title: '视频' }
      },
      {
        path: 'column',
        component: () => import('@/views/course/column'),
        name: 'Column',
        meta: { title: '专栏' }
      },
      {
        path: 'column_detail',
        component: () => import('@/views/course/column_detail'),
        name: 'ColumnDetail',
        hidden: true,
        meta: { title: '专栏详情' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    alwaysShow: true,
    name: 'User',
    meta: {
      title: '用户', icon: 'user', roles: ['admin', 'editor']
    },
    redirect: '/user',
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'User1',
        meta: { title: '用户' }
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '交易', icon: 'education', roles: ['admin', 'editor']
    },
    redirect: '/order',
    children: [
      {
        path: 'order',
        component: () => import('@/views/my-pay/order'),
        name: 'Order',
        meta: { title: '订单管理' }
      },
      {
        path: 'asset',
        component: () => import('@/views/my-pay/asset'),
        name: 'Asset',
        meta: { title: '资产管理' }
      },
      {
        path: 'payment',
        component: () => import('@/views/my-pay/payment'),
        name: 'Payment',
        meta: { title: '支付设置' }
      }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '营销', icon: 'shopping', roles: ['admin', 'editor']
    },
    redirect: '/group',
    children: [
      {
        path: 'group',
        component: () => import('@/views/marketing/group'),
        name: 'Group',
        meta: { title: '拼团' }
      },
      {
        path: 'splashsale',
        component: () => import('@/views/marketing/splashsale'),
        name: 'Splashsale',
        meta: { title: '秒杀' }
      },
      {
        path: 'coupon',
        component: () => import('@/views/marketing/coupon'),
        name: 'Coupon',
        meta: { title: '优惠券' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '设置', icon: 'el-icon-setting', roles: ['admin', 'editor']
    },
    redirect: '/shop',
    children: [
      {
        path: 'shop',
        component: () => import('@/views/setting/shop'),
        name: 'Shop',
        meta: { title: '店铺设置' }
      },
      {
        path: 'staff',
        component: () => import('@/views/setting/staff'),
        name: 'Staff',
        meta: { title: '员工管理' }
      },
      {
        path: 'role',
        component: () => import('@/views/setting/role'),
        name: 'Role',
        meta: { title: '角色管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

//是否使用手动补齐User子菜单的方式
export const isUsePaddingMethod = false

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const routesMenus = [
  {
    path: 'media',
    component: () => import('@/views/course/media'),
    name: 'Media',
    meta: { title: '图文' }
  },
  {
    path: 'audio',
    component: () => import('@/views/course/audio'),
    name: 'Audio',
    meta: { title: '音频' }
  },
  {
    path: 'video',
    component: () => import('@/views/course/video'),
    name: 'Video',
    meta: { title: '视频' }
  },
  {
    path: 'column',
    component: () => import('@/views/course/column'),
    name: 'Column',
    meta: { title: '专栏' }
  },
  {
    path: 'column_detail',
    component: () => import('@/views/course/column_detail'),
    name: 'ColumnDetail',
    hidden: true,
    meta: { title: '专栏详情' }
  },
  {
    path: 'order',
    component: () => import('@/views/my-pay/order'),
    name: 'Order',
    meta: { title: '订单管理' }
  },
  {
    path: 'asset',
    component: () => import('@/views/my-pay/asset'),
    name: 'Assets',
    meta: { title: '资产管理' }
  },
  {
    path: 'payment',
    component: () => import('@/views/my-pay/payment'),
    name: 'Payment',
    meta: { title: '支付设置' }
  },
  {
    path: 'group',
    component: () => import('@/views/marketing/group'),
    name: 'Group',
    meta: { title: '拼团' }
  },
  {
    path: 'splashsale',
    component: () => import('@/views/marketing/splashsale'),
    name: 'Flashsale',
    meta: { title: '秒杀' }
  },
  {
    path: 'coupon',
    component: () => import('@/views/marketing/coupon'),
    name: 'Coupon',
    meta: { title: '优惠券' }
  },
  {
    path: 'shop',
    component: () => import('@/views/setting/shop'),
    name: 'SettingIndex',
    meta: { title: '店铺设置' }
  },
  {
    path: 'staff',
    component: () => import('@/views/setting/staff'),
    name: 'Staffs',
    meta: { title: '员工管理' }
  },
  {
    path: 'role',
    component: () => import('@/views/setting/role'),
    name: 'Role',
    meta: { title: '角色管理' }
  }
]

if(isUsePaddingMethod) {
  routesMenus.push({
    path: 'my_user',
    component: () => import('@/views/user/user'),
    name: 'MyUser',
    meta: { title: '用户' }
  })
}else {
  routesMenus.push({
    path: 'user',
    component: () => import('@/views/user/user'),
    name: 'User',
    meta: { title: '用户' }
  })
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
