import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'MemberFruitFlow/index',
    method: 'get',
    params: params
  })
}

export const getBonusList = (params) => {
  return axios.request({
    url: 'MemberFruitFlow/bonus',
    method: 'get',
    params: params
  })
}
/**
 * 添加奖励
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const changeAmount = (data) => {
  return axios.request({
    url: 'MemberFruitFlow/changeAmount',
    method: 'post',
    data
  })
}
