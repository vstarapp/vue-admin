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
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:100px">
                <Option :value="1">投诉人</Option>
                <Option :value="2">被投诉人</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <DatePicker type="datetimerange" v-model="searchConf.date" format="yyyy-MM-dd HH:mm" placeholder="投诉时间" style="width: 300px"></DatePicker>
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
    <Modal v-model="modalImg.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancelShowImg">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>查看图片</span>
      </p>
      <img :src="formItem.imagepath" width="100%"/>
      <div slot="footer">
        <Button type="text" @click="cancelShowImg" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="cancelShowImg" :loading="modalImg.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getComplaintCompleteList, complaintDel, cktp } from '@/api/exchange'
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
        complaintDel(currentRow.id).then(response => {
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
  name: 'exchange_sell_complete',
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
          title: '投诉人',
          align: 'center',
          key: 'complain_user',
          minWidth: 100
        },
        {
          title: '被投诉人',
          align: 'center',
          key: 'respond_user',
          width: 100
        },
        {
          title: '投诉时间',
          align: 'center',
          key: 'create_time',
          minWidth: 100
        },
        {
          title: '投诉订单号',
          align: 'center',
          key: 'order_no',
          minWidth: 100
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
          title: '投诉内容',
          align: 'center',
          key: 'complain_content',
          width: 180
        },
        {
          title: '仲裁判决',
          align: 'center',
          key: 'winner',
          width: 100
        },
        {
          title: '仲裁结果',
          align: 'center',
          key: 'final_result',
          width: 180
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
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
      getComplaintCompleteList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    cancelShowImg () {
      this.modalImg.show = false
    },
    doCancelShowImg () {
      this.modalImg.loading = false
      this.modalImg.index = 0
    }
  }
}
</script>
