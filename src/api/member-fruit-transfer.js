import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getGiveList = (params) => {
  return axios.request({
    url: 'MemberFruitTransfer/give',
    method: 'get',
    params: params
  })
}

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getTransferList = (params) => {
  return axios.request({
    url: 'MemberFruitTransfer/transfer',
    method: 'get',
    params: params
  })
}
