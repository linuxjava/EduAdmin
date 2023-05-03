import { getToken, getSchoolId } from '@/utils/auth'

export let uploadOptions = {
  action: process.env.VUE_APP_BASE_API + '/admin/s/upload',
  header: {
    token: getToken(),
    schoolid: getSchoolId()
  }
}
