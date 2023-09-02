/*
用户管理相关的API请求函数
*/
import request from '@/utils/request'
import {
  API_TAG_ICOUPLOAD,
  API_TAG_ICOUPREMOVE,
  API_USER_AVATAR,
  API_USER_DO_ASSIGN,
  API_USER_ID, API_USER_INFO,
  API_USER_LIST,
  API_USER_REMOVE,
  API_USER_SAVE,
  API_USER_STATUS, API_USER_TO_ASSIGN,
  API_USER_UPDATE, API_USER_UPDATE_INFO
} from '@/constants/api'

export default {
  /*
  获取用户分页列表(带搜索)
  */
  getPageList(searchObj) {
    return request({
      url: API_USER_LIST,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  /*
  根据id获取用户
  */
  getById(id) {
    return request({
      url: API_USER_ID + '/' + id,
      method: 'get'
    })
  },
  /*
  保存用户
  */
  saveUser(user) {
    return request({
      url: API_USER_SAVE,
      method: 'post',
      data: user
    })
  },
  /*
  根据id修改用户
  */
  updateById(user) {
    return request({
      url: API_USER_UPDATE,
      method: 'put',
      data: user
    })
  },
  /*
  删除用户
  */
  removeById(id) {
    return request({
      url: API_USER_REMOVE + '/' + id,
      method: 'delete'
    })
  },
  // 更新用户状态
  updateStatus(id, status) {
    return request({
      url: API_USER_STATUS + '/' + id + '/' + status,
      method: 'get'
    })
  },
  /*
  修改资料
  */
  updateInfo(userInfo) {
    return request({
      url: API_USER_UPDATE_INFO,
      method: 'patch',
      data: userInfo
    })
  },
  /*
 根据用户id查询用户已分配的角色
 */
  getRolesByUserId(userId) {
    return request({
      url: API_USER_TO_ASSIGN + '/' + userId,
      method: 'get'
    })
  },
  /*
  分配角色
  */
  assignRoles(assignRoleVo) {
    return request({
      url: API_USER_DO_ASSIGN,
      method: 'post',
      data: assignRoleVo
    })
  },

  /*
 上传图片
  */
  uploadUserAvatar(file) {
    return request({
      url: API_TAG_ICOUPLOAD,
      method: 'post',
      data: file
    })
  },
  /*
  删除图片
  */
  removeUserAvatarById(id) {
    return request({
      url: API_TAG_ICOUPREMOVE + id,
      method: 'get'
    })
  },
  /*
  单独修改图片
  */
  updateAvatar(id, userAvatar) {
    return request({
      url: API_USER_AVATAR + '/' + id + '/' + userAvatar,
      method: 'get'
    })
  }
}
