/*
登录日志相关的API请求函数
*/
import request from '@/utils/request'
import { API_LOGIN_LOG_BATCH, API_LOGIN_LOG_GET, API_LOGIN_LOG_LIST, API_LOGIN_LOG_REMOVE } from '@/constants/api'

export default {
  /*
  条件分页查询登录日志(带搜索)
  */
  getPageList(searchObj) {
    return request({
      // 接口路径
      url: API_LOGIN_LOG_LIST,
      // 提交方式
      method: 'get',
      // 参数
      params: searchObj
    })
  },
  /*
 根据id查询登录日志
 */
  getById(id) {
    return request({
      url: API_LOGIN_LOG_GET + '/' + id,
      method: 'get'
    })
  },
  /*
  删除登录日志
  */
  removeById(id) {
    return request({
      url: API_LOGIN_LOG_REMOVE + '/' + id,
      method: 'delete'
    })
  },
  /*
  批量删除登录日志
  */
  batchRemove(idList) {
    return request({
      url: API_LOGIN_LOG_BATCH,
      method: 'delete',
      data: idList
    })
  }
}
