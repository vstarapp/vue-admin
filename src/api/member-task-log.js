import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'MemberTaskLog/index',
    method: 'get',
    params: params
  })
}

export const del = (id) => {
  return axios.request({
    url: 'MemberTaskLog/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
