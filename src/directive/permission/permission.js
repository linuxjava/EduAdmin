import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

function checkPermissionNew(el, binding) {
  const { value } = binding
  const accesses = store.getters && store.getters.accesses
  console.log(el, value)
  if (value && value.length > 0) {
    if(!accesses.includes(value)){
      //如果不具备这个权限，则将el移除
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need permission! Like v-permission="'/admin/s/course/save,POST'"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermissionNew(el, binding)
  },
  update(el, binding) {
    checkPermissionNew(el, binding)
  }
}
