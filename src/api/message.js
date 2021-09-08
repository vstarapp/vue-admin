import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getMsgReceive = (params) => {
  return axios.request({
    url: 'Message/msgReceive',
    method: 'get',
    params: params
  })
}
/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getMsgSend = (params) => {
  return axios.request({
    url: 'Message/msgSend',
    method: 'get',
    params: params
  })
}
/**
 * 编辑应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const replyMessage = (data) => {
  return axios.request({
    url: 'Message/replyMessage',
    method: 'post',
    data
  })
}
export const ajaxMsgReceive = (id) => {
  return axios.request({
    url: 'Message/ajaxMsgReceive',
    method: 'get',
    params: {
      id: id
    }
  })
}
export const del = (id) => {
  return axios.request({
    url: 'Message/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
