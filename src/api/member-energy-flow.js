import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'MemberEnergyFlow/index',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getTeamList = (params) => {
  return axios.request({
    url: 'MemberEnergyFlow/team',
    method: 'get',
    params: params
  })
}
