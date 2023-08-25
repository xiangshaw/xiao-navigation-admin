/*
菜单管理相关的API请求函数
*/
import request from '@/utils/request'
import {
  API_SORT_STATUS,
  API_SORT_ID,
  API_SORT_LIST,
  API_SORT_REMOVE,
  API_SORT_BATCH,
  API_SORT_SAVE,
  API_SORT_UPDATE,
  API_SORTTAG_VIEW
} from '@/constants/api'

export default {
  /*
  根据ID获取类别
   */
  findIdBySort(id) {
    return request({
      url: API_SORT_ID + '/' + id,
      method: 'get'
    })
  },
  /*
  获取类别列表（带搜索）
  */
  getPageList(searchObj) {
    return request({
      url: API_SORT_LIST,
      method: 'get',
      params: searchObj
    })
  },

  /*
  删除类别
  */
  removeById(id) {
    return request({
      url: API_SORT_REMOVE + '/' + id,
      method: 'delete'
    })
  },

  /*
批量删除
*/
  batchRemove(idList) {
    return request({
      url: API_SORT_BATCH,
      method: 'delete',
      data: idList
    })
  },

  /*
  保存类别
  */
  saveSort(sort) {
    return request({
      url: API_SORT_SAVE,
      method: 'post',
      data: sort
    })
  },

  /*
  更新类别
  */
  updateById(sort) {
    return request({
      url: API_SORT_UPDATE,
      method: 'patch',
      data: sort
    })
  },
  /*
  更新类别状态
   */
  updateStatus(id, status) {
    return request({
      url: API_SORT_STATUS + '/' + id + '/' + status,
      method: 'get'
    })
  },
  /*
  首页展示类别和标签
   */
  sortTagView() {
    return request({
      url: API_SORTTAG_VIEW,
      method: 'get'
    })
  }
}
