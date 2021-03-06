import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'ProductType/index',
    method: 'get',
    params: params
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'ProductType/del',
    method: 'get',
    params: {
      hash: hash
    }
  })
}

/**
 * 显示/隐藏应用组
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'ProductType/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'ProductType/add',
    method: 'post',
    data
  })
}

/**
 * 编辑应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'ProductType/edit',
    method: 'post',
    data
  })
}

export const getAll = () => {
  return axios.request({
    url: 'ProductType/getAll',
    method: 'get'
  })
}
