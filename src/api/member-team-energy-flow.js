import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'MemberTeamEnergyFlow/index',
    method: 'get',
    params: params
  })
}
