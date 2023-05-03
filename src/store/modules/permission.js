import { asyncRoutes, constantRoutes, routesMenus, isUsePaddingMethod } from '@/router'
import Layout from "@/layout";

let paddingUser = false
let alwaysShow = true

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function filterAsyncRoutesByMenus(routes, menus) {
  const res = []

  for (let i =0; i<menus.length; i++) {
    let menu = menus[i]
    let route = undefined
    const index = routes.findIndex(r => r.name === menu.name)
    let tmp = {}

    if(index === -1) {
      //在routes中没有找到对应的路由, 这种情况与2种
      //1.一级菜单
      //2.服务器返回的子菜单在本地路由中没有对应数据
      tmp = {
        path: (menu.access_id === 0 ? '/' : '') + menu.name.toLowerCase(),
        component: Layout,
        name: menu.name,
        hidden: menu.hidden,
        meta: {
          title: menu.title
        }
      }
    }else {//子菜单
      //这里有个特殊场景：name=User的一级菜单会走到这里(因为本地的routes本来是没有一级菜单的，但是User下面的子菜单的name正好也是User，所以会走到这里)
      route = routes[index]
      tmp = {
        path: (menu.access_id === 0 ? '/' : '') + menu.name.toLowerCase(),
        component: menu.access_id === 0 ? Layout : route.component,
        name: menu.name || route.name,
        meta: route.meta || {},
        hidden: menu.hidden
      }
      tmp.meta.title = menu.title
    }

    if(menu.children && menu.children.length > 0) {//如果有子菜单则递归
      tmp.children = filterAsyncRoutesByMenus(routesMenus, menu.children)
      tmp.redirect = tmp.path + '/' + tmp.children[0].path

      //这里'可视化'和'工具'菜单未实现，因此它们的子菜单的component会是Layout(有对应实现的子菜单component应该是对应具体的页面)，所以在这里做个检查过滤
      if(tmp.children[0].component === Layout) {
        continue
      }
    } else {
      //User一级菜单没有children，这里需要单独给其添加一个用户页面的子路由
      if(menu.access_id === 0) {
        delete tmp.name
        tmp.children = []
        route = routes[index]
        let child = {
          path: route.path,
          component: route.component,
          name: route.name,
          meta: route.meta || {},
        }
        tmp.meta.title = menu.title
        tmp.children.push(child)
        tmp.redirect = tmp.path + "/" + child.path
      }
    }

    res.push(tmp)
  }

  return res
}

export function filterAsyncRoutesByMenusPadding(routes, menus) {
  const res = []

  if(!paddingUser) {
    //因为服务器返回的menus中User一级菜单没有子菜单，为了让下面的处理逻辑更加简单些，因此手动补上子菜单(这里可以对应没有手动添加子菜单filterAsyncRoutesByMenus
    // 的处理逻辑，更加复杂难以理解)
    paddingUser = true
    const item = menus.find(item => item.name === 'User')
    item.children.push({id: 1000, access_id: 4, name: "MyUser", hidden: false, title: "用户123", children: []})
  }

  for (let i =0; i<menus.length; i++) {
    let menu = menus[i]
    let route = undefined
    const index = routes.findIndex(r => r.name === menu.name)
    let tmp = {}

    if(index === -1) {//一级菜单
      tmp = {
        path: '/' + menu.name.toLowerCase(),
        component: Layout,
        name: menu.name,
        hidden: menu.hidden,
        meta: {
          title: menu.title
        },
        alwaysShow: alwaysShow,//如果只有一个子菜单时，默认采用nested mode，如果想总是显示root menu，需要显示设置其为true
      }
    }else {//子菜单
      route = routes[index]
      tmp = {
        path: route.path,
        component: route.component,
        name: menu.name || route.name,
        meta: route.meta || {},
        hidden: menu.hidden
      }
      tmp.meta.title = menu.title
    }

    if(menu.children && menu.children.length > 0) {//如果有子菜单则递归
      tmp.children = filterAsyncRoutesByMenus(routesMenus, menu.children)
      tmp.redirect = tmp.path + '/' + tmp.children[0].path

      //这里'可视化'和'工具'菜单未实现，因此它们的子菜单的component会是Layout(有对应实现的子菜单component应该是对应具体的页面)，所以在这里做个检查过滤
      if(tmp.children[0].component === Layout) {
        continue
      }
    }

    res.push(tmp)
  }

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateRoutesByMenus({ commit }, menus) {
    return new Promise(resolve => {
      let accessedRoutes = isUsePaddingMethod ? filterAsyncRoutesByMenusPadding(routesMenus, menus) : filterAsyncRoutesByMenus(routesMenus, menus)
      //最后添加404路由
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
