import request from '@/utils/request'
import { API_USER_LOGIN, API_USER_INFO, API_USER_LOGOUT, API_LOGIN_CODE } from '@/constants/api'

export function login(data) {
  return request({
    url: API_USER_LOGIN,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: API_USER_INFO,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: API_USER_LOGOUT,
    method: 'post'
  })
}

export function getCode() {
  return request({
    url: API_LOGIN_CODE,
    method: 'get'
  })
}
