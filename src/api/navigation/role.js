/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'
import {
  API_ROLE_BATCH,
  API_ROLE_ID,
  API_ROLE_LIST,
  API_ROLE_REMOVE,
  API_ROLE_SAVE,
  API_ROLE_UPDATE
} from '@/constants/api'
export default {
  /*
  获取角色分页列表(带搜索)
  */
  getPageList(searchObj) {
    return request({
      // 接口路径
      url: API_ROLE_LIST,
      // 提交方式
      method: 'get',
      // 参数
      params: searchObj
    })
  },
  /*
新增角色
*/
  saveRole(role) {
    return request({
      url: API_ROLE_SAVE,
      method: 'post',
      // 传递json格式用 data:对象名字 ,也就是后端加了@RequestBody用data。。。没添加就使用params
      data: role
    })
  },
  /*
  编辑
  */
  getRoleId(id) {
    return request({
      url: API_ROLE_ID + '/' + id,
      method: 'get'
    })
  },
  /*
  更新
  */
  updateById(role) {
    return request({
      url: API_ROLE_UPDATE,
      method: 'put',
      data: role
    })
  },
  /*
  删除角色
  */
  removeById(id) {
    return request({
      url: API_ROLE_REMOVE + '/' + id,
      method: 'delete'
    })
  },
  /*
  批量删除
  */
  batchRemove(idList) {
    return request({
      url: API_ROLE_BATCH,
      method: 'delete',
      data: idList
    })
  }
}
