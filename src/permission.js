import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeSchoolId, getIsPlatform } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {//已登录
    if (to.path === '/login') {//如果访问的是登录页，跳转到首页
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else if(to.path === '/') { //如果访问的是首页, 则获取用户信息
      removeSchoolId() //回到首页后要清除schoolId
      await store.dispatch('user/getInfo')
      next()
      NProgress.done()
      return
    } else if(getIsPlatform() && to.path === '/platform/role') { //如果访问的是平台页面
      await store.dispatch('user/getInfo')
      next()
      NProgress.done()
      return
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {//有角色说明已经获取到用户信息, 直接放行
        next()
      } else { //还未获取到用户信息
        try {
          //保留原始的逻辑
          if(false) {
            const {roles, menus} = await store.dispatch('user/getInfo')
            if (roles.length === 0) {
              Message.error('没有访问权限')
              next({
                ...from
              })
              NProgress.done()
              return
            }
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } else {
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            const { roles, menus } = await store.dispatch('user/getInfo')
            if(menus.length === 0) {
              Message.error('没有访问权限')
              next({
                ...from
              })
              NProgress.done()
              return
            }

            // generate accessible routes map based on roles
            // const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
            const accessRoutes = await store.dispatch('permission/generateRoutesByMenus', menus)

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({...to, replace: true})
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {//未登录
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {//白名单直接放行
      // in the free login whitelist, go directly
      next()
    } else { //跳转到登录页面，并带上登陆成功后需要redirect的地址
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
