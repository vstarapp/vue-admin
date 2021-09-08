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
                <Option :value="1">主题</Option>
                <Option :value="2">发件人</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
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
    <Modal v-model="modalDetail.show" width="668" :styles="{top: '30px'}" >
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItemDetail.subject}}</span>
      </p>
      <div class="view-mail-header clearfix">
        <div class="mail-address pull-left">
          <span class="view-mail-label">收件人:</span><span id="sender">{{formItemDetail.from}}</span><br>

        </div>
        <div class="btn-toolbar pull-right">
          <!--回复-->
          <a id="replymodal" data-target="#compose-mail" data-toggle="modal" class="btn btn-mini" aid="202"><i class="icon-reply"></i></a>
          <!--删除-->
          <a id="mdelete" class="btn btn-mini" aid="202"><i class="icon-trash"></i></a>
        </div>
      </div>

      <p id="msgcontent">{{formItemDetail.content}}</p>
      <div slot="footer">
        <Button type="text" @click="detailCancel" style="margin-right: 8px">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getMsgSend, del } from '@/api/message'
const detailButton = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        vm.formItemDetail.id = currentRow.id
        vm.formItemDetail.from = currentRow.from
        vm.formItemDetail.subject = currentRow.subject
        vm.formItemDetail.content = currentRow.reply
        vm.modalDetail.show = true
        vm.modalDetail.index = index
      }
    }
  }, currentRow.subject)
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
        del(currentRow.id).then(response => {
          currentRow.loading = false
          vm.tableData.splice(index, 1)
          vm.$Message.success(response.data.msg)
        })
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
  name: 'message_send',
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
          title: '收件人',
          align: 'center',
          minWidth: 190,
          key: 'from'
        },
        {
          title: '主题',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              detailButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '时间',
          align: 'center',
          key: 'write_time',
          width: 180
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 180,
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
        type: '',
        keywords: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      modalDetail: {
        show: false,
        loading: false,
        index: 0
      },
      formItemDetail: {
        from: '',
        subject: '',
        content: '',
        id: 0
      },
      ruleValidate: {
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    cancel () {
      this.modalSetting.show = false
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
      getMsgSend({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords
      }).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    detailCancel () {
      this.modalDetail.show = false
    }
  }
}
</script>
