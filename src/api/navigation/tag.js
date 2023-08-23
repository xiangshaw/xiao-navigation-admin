/*
菜单管理相关的API请求函数
*/
import request from '@/utils/request'
import {
  API_TAG_STATUS,
  API_TAG_ID,
  API_TAG_LIST,
  API_TAG_REMOVE,
  API_TAG_BATCH,
  API_TAG_SAVE,
  API_TAG_UPDATE,
  API_TAG_TO_ASSIGN,
  API_TAG_DO_ASSIGN, API_TAG_ICOUPLOAD, API_TAG_ICOUPREMOVE, API_TAG_ICON
} from '@/constants/api'

export default {
  /*
  上传标签图标
   */
  uploadTagIcon(file) {
    return request({
      url: API_TAG_ICOUPLOAD,
      method: 'post',
      data: file
    })
  },
  /*
  删除图标
  */
  removeTagIconById(id) {
    return request({
      url: API_TAG_ICOUPREMOVE + id,
      method: 'get'
    })
  },
  /*
  单独修改图标
  */
  updateTagIcon(tagId, tagIcon) {
    return request({
      url: API_TAG_ICON + '/' + tagId + '/' + tagIcon,
      method: 'get'
    })
  },
  /*
  根据ID获取标签
   */
  findIdBySort(id) {
    return request({
      url: API_TAG_ID + '/' + id,
      method: 'get'
    })
  },
  /*
  获取标签列表（带搜索）
  */
  getPageList(searchObj) {
    return request({
      url: API_TAG_LIST,
      method: 'get',
      params: searchObj
    })
  },

  /*
  删除标签
  */
  removeById(id) {
    return request({
      url: API_TAG_REMOVE + '/' + id,
      method: 'delete'
    })
  },

  /*
  批量删除
  */
  batchRemove(idList) {
    return request({
      url: API_TAG_BATCH,
      method: 'delete',
      data: idList
    })
  },

  /*
  保存标签
  */
  saveSort(sort) {
    return request({
      url: API_TAG_SAVE,
      method: 'post',
      data: sort
    })
  },

  /*
  更新标签
  */
  updateById(sort) {
    return request({
      url: API_TAG_UPDATE,
      method: 'patch',
      data: sort
    })
  },
  /*
  更新标签状态
   */
  updateStatus(id, status) {
    return request({
      url: API_TAG_STATUS + '/' + id + '/' + status,
      method: 'get'
    })
  },
  /*
 根据标签id获取类别信息数据
  */
  getSortsByTagId(tagId) {
    return request({
      url: API_TAG_TO_ASSIGN + '/' + tagId,
      method: 'get'
    })
  },
  /*
  给标签分配类别
  */
  assignSorts(assignSortVo) {
    return request({
      url: API_TAG_DO_ASSIGN,
      method: 'post',
      data: assignSortVo
    })
  }
}
