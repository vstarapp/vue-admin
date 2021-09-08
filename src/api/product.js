import axios from '@/libs/api.request'

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'Product/index',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getFreeList = (params) => {
  return axios.request({
    url: 'Product/free',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用权限信息
 * @returns {wx.RequestTask | never}
 */
export const getAll = (id) => {
  return axios.request({
    url: 'Product/getAll',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const del = (id) => {
  return axios.request({
    url: 'Product/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 显示/隐藏应用
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'Product/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'Product/add',
    method: 'post',
    data
  })
}
/**
 * 新增应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const addFree = (data) => {
  return axios.request({
    url: 'Product/addFree',
    method: 'post',
    data
  })
}
/**
 * 编辑应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Product/edit',
    method: 'post',
    data
  })
}
/**
 * 编辑应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const doProductProfit = () => {
  return axios.request({
    url: 'Product/doProfit',
    method: 'post'
  })
}
