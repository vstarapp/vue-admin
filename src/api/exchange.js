import axios from '@/libs/api.request'

/**
 * 获取求购订单数据
 * @returns {wx.RequestTask | never}
 */
export const getBuyList = (params) => {
  return axios.request({
    url: 'Exchange/buy',
    method: 'get',
    params: params
  })
}
/**
 * 获取交易中的订单数据
 * @returns {wx.RequestTask | never}
 */
export const getTradingList = (params) => {
  return axios.request({
    url: 'Exchange/trading',
    method: 'get',
    params: params
  })
}
export const buyCancel = (orderNo) => {
  return axios.request({
    url: 'Exchange/buyCancel',
    method: 'get',
    params: {
      order_no: orderNo
    }
  })
}
export const sellCancel = (orderNo) => {
  return axios.request({
    url: 'Exchange/sellCancel',
    method: 'get',
    params: {
      order_no: orderNo
    }
  })
}
/**
 * 获取交易完成的订单数据
 * @returns {wx.RequestTask | never}
 */
export const getBuyCompleteList = (params) => {
  return axios.request({
    url: 'Exchange/buyComplete',
    method: 'get',
    params: params
  })
}
export const buyCompleteDel = (id) => {
  return axios.request({
    url: 'Exchange/buyCompleteDel',
    method: 'get',
    params: {
      id: id
    }
  })
}
export const cktp = (orderNo) => {
  return axios.request({
    url: 'Exchange/cktp',
    method: 'get',
    params: {
      order_no: orderNo
    }
  })
}
/**
 * 获取投诉单数据
 * @returns {wx.RequestTask | never}
 */
export const getComplaintList = (params) => {
  return axios.request({
    url: 'Exchange/complaint',
    method: 'get',
    params: params
  })
}
/**
 * 撤销投诉
 * @param {*} id
 */
export const complaintCancel = (id) => {
  return axios.request({
    url: 'Exchange/complaintCancel',
    method: 'get',
    params: {
      id: id
    }
  })
}
export const complaintDel = (id) => {
  return axios.request({
    url: 'Exchange/complaintDel',
    method: 'get',
    params: {
      id: id
    }
  })
}
/**
 * 获取已完成投诉单数据
 * @returns {wx.RequestTask | never}
 */
export const getComplaintCompleteList = (params) => {
  return axios.request({
    url: 'Exchange/complaintComplete',
    method: 'get',
    params: params
  })
}
/**
 * 仲裁结果
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const complaintAdd = (data) => {
  return axios.request({
    url: 'Exchange/complaintAdd',
    method: 'post',
    data
  })
}
