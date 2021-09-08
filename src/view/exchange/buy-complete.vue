<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.status" clearable placeholder="请选择订单状态" style="width:100px">
                <Option :value="2">取消交易</Option>
                <Option :value="3">交易成功</Option>
                <Option :value="4">交易关闭</Option>
                <Option :value="5">交易失败</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:100px">
                <Option :value="1">买家编号</Option>
                <Option :value="2">买家</Option>
                <Option :value="3">卖家编号</Option>
                <Option :value="4">卖家</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <DatePicker type="datetimerange" v-model="searchConf.date" format="yyyy-MM-dd HH:mm" placeholder="订单时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <div>
            <Table :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
          <div class="margin-top-15" style="text-align: center">
            <Page :total="tableShow.listCount" :current="tableShow.currentPage"
                  :page-size="tableShow.pageSize" @on-change="changePage"
                  @on-page-size-change="changeSize" show-elevator show-sizer show-total></Page>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalImg.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>查看图片</span>
      </p>
      <img :src="formItem.imagepath" width="100%"/>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="cancel" :loading="modalImg.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getBuyCompleteList, buyCompleteDel, cktp } from '@/api/exchange'
import config from '@/config'
const imageButton = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        cktp(currentRow.order_no).then(response => {
          if (response.data.errCode === 0) {
            vm.formItem.imagepath = config.baseUrl.site + response.data.data.photo
            vm.modalImg.show = true
            vm.modalImg.index = index
          } else {
            alert(response.data.errMsg)
          }
        })
      }
    }
  }, '查看图片')
}
const deleteButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗? ',
      transfer: true
    },
    on: {
      'on-ok': () => {
        buyCompleteDel(currentRow.id).then(response => {
          vm.tableData.splice(index, 1)
          vm.$Message.success(response.data.msg)
        })
        currentRow.loading = false
      }
    }
  }, [
    h('Button', {
      style: {
        margin: '0 5px'
      },
      props: {
        type: 'error',
        placement: 'top',
        loading: currentRow.isDeleting
      }
    }, vm.$t('delete_button'))
  ])
}
export default {
  name: 'exchange_buy_complete',
  data () {
    return {
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '订单状态',
          align: 'center',
          key: 'status_text',
          minWidth: 100
        },
        {
          title: '买家',
          align: 'center',
          key: 'buy_user',
          minWidth: 90
        },
        {
          title: '求购数量',
          align: 'center',
          key: 'quantity',
          width: 100
        },
        {
          title: '报价',
          align: 'center',
          key: 'price',
          width: 90
        },
        {
          title: '卖家',
          align: 'center',
          key: 'sell_user',
          minWidth: 90
        },
        {
          title: '买入时间',
          align: 'center',
          key: 'buy_time',
          width: 120
        },
        {
          title: '卖出时间',
          align: 'center',
          key: 'sell_time',
          width: 120
        },
        {
          title: '图片',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('div', [
              imageButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
              deleteButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      tableData: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      searchConf: {
        status: '',
        type: '',
        keywords: '',
        date: ''
      },
      modalImg: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        formItem: '',
        id: 0
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    cancel () {
      this.modalImg.show = false
    },
    doCancel () {
      this.modalImg.loading = false
      this.modalImg.index = 0
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    search () {
      this.tableShow.currentPage = 1
      this.getList()
    },
    getList () {
      let vm = this
      let params = {
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        date: vm.searchConf.date,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getBuyCompleteList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
