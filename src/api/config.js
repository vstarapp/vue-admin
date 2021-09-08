import axios from '@/libs/api.request'

/**
 * 获取权限列表数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'Config/index',
    method: 'get',
    params: params
  })
}

/**
 * 获取权限列表数据
 * @returns {wx.RequestTask | never}
 */
export const getAllGroups = () => {
  return axios.request({
    url: 'Config/getAllGroups',
    method: 'get',
    params: []
  })
}

/**
 * 获取权限列表数据
 * @returns {wx.RequestTask | never}
 */
export const getFormItemType = () => {
  return axios.request({
    url: 'Config/getFormItemType',
    method: 'get',
    params: []
  })
}
/**
 * 修改用户状态
 * @param status
 * @param id
 * @returns {never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'Config/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'Config/add',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Config/edit',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const del = (id) => {
  return axios.request({
    url: 'Config/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
