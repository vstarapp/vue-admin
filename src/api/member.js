import axios from '@/libs/api.request'

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getCheckList = (params) => {
  return axios.request({
    url: 'Member/check',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getUnCheckList = (params) => {
  return axios.request({
    url: 'Member/uncheck',
    method: 'get',
    params: params
  })
}
/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getTreeList = (params) => {
  return axios.request({
    url: 'Member/tree',
    method: 'get',
    params: params
  })
}
/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getVerifyApplyList = (params) => {
  return axios.request({
    url: 'Member/verifyApply',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getVerifyRecordList = (params) => {
  return axios.request({
    url: 'Member/verifyRecord',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用权限信息
 * @returns {wx.RequestTask | never}
 */
export const refreshShareCode = () => {
  return axios.request({
    url: 'Member/refreshShareCode',
    method: 'get',
    params: {}
  })
}

export const del = (id) => {
  return axios.request({
    url: 'Member/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const delApply = (id) => {
  return axios.request({
    url: 'Member/delApply',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const cancelVerify = (id) => {
  return axios.request({
    url: 'Member/cancelVerify',
    method: 'post',
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
    url: 'Member/changeStatus',
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
    url: 'Member/add',
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
    url: 'Member/edit',
    method: 'post',
    data
  })
}

/**
 * 新增应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const doApply = (data) => {
  return axios.request({
    url: 'Member/doApply',
    method: 'post',
    data
  })
}

/**
 * 新增应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const addVerify = (data) => {
  return axios.request({
    url: 'Member/addVerify',
    method: 'post',
    data
  })
}

/**
 * 冻结会员
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const doFreeze = (data) => {
  return axios.request({
    url: 'Member/doFreeze',
    method: 'post',
    data
  })
}
/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getFreezeList = (params) => {
  return axios.request({
    url: 'Member/freeze',
    method: 'get',
    params: params
  })
}
/**
 * 冻结会员
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const doUnfreeze = (memberId) => {
  return axios.request({
    url: 'Member/doUnFreeze',
    method: 'get',
    params: {
      id: memberId
    }
  })
}

/**
 * 获取会员详情
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const getMemberDetail = (id) => {
  return axios.request({
    url: 'Member/getMemberDetail',
    method: 'get',
    params: {
      id: id
    }
  })
}
