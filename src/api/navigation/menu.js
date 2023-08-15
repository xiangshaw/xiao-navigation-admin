/*
菜单管理相关的API请求函数
*/
import request from '@/utils/request'
import {
  API_MENU_DO_ASSIGN,
  API_MENU_LIST,
  API_MENU_REMOVE,
  API_MENU_SAVE, API_MENU_STATUS,
  API_MENU_TO_ASSIGN,
  API_MENU_UPDATE
} from '@/constants/api'

export default {

  /*
  获取权限(菜单/功能)列表
  */
  findNodes() {
    return request({
      url: API_MENU_LIST,
      method: 'get'
    })
  },

  /*
 保存
 */
  saveMenu(menu) {
    return request({
      url: API_MENU_SAVE,
      method: 'post',
      data: menu
    })
  },
  /*
 更新
 */
  updateById(menu) {
    return request({
      url: API_MENU_UPDATE,
      method: 'put',
      data: menu
    })
  },

  /*
  删除
  */
  removeById(id) {
    return request({
      url: API_MENU_REMOVE + '/' + id,
      method: 'delete'
    })
  },
  /*
  查看某个角色的权限列表
  */
  toAssign(roleId) {
    return request({
      url: API_MENU_TO_ASSIGN + '/' + roleId,
      method: 'get'
    })
  },
  /*
  给某个角色授权
  */
  doAssign(assginMenuVo) {
    return request({
      url: API_MENU_DO_ASSIGN,
      method: 'post',
      data: assginMenuVo
    })
  },
  // 更新菜单状态
  updateStatus(id, status) {
    return request({
      url: API_MENU_STATUS + '/' + id + '/' + status,
      method: 'get'
    })
  }
}
