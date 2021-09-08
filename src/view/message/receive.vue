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
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>发送信息</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="90">
        <FormItem label="收件人" prop="title">
          <Input v-model="formItem.from" placeholder="请输入公告标题" disabled></Input>
        </FormItem>
        <FormItem label="主题" prop="subject">
          <Input v-model="formItem.subject" placeholder="" ></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input v-model="formItem.content" type="textarea" :rows="6"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">发送</Button>
      </div>
    </Modal>
    <Modal v-model="modalDetail.show" width="668" :styles="{top: '30px'}" >
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItemDetail.subject}}</span>
      </p>
      <div class="view-mail-header clearfix">
        <div class="mail-address pull-left">
          <span class="view-mail-label">发件人:</span><span id="sender">{{formItemDetail.from}}</span><br>

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
import { getMsgReceive, ajaxMsgReceive, replyMessage, del } from '@/api/message'
const detailButton = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        ajaxMsgReceive(currentRow.id).then(response => {
          vm.formItemDetail.id = currentRow.id
          vm.formItemDetail.from = response.data.data.data.from
          vm.formItemDetail.subject = response.data.data.data.subject
          vm.formItemDetail.content = response.data.data.data.content
          vm.modalDetail.show = true
          vm.modalDetail.index = index
        })
      }
    }
  }, currentRow.subject)
}
const replyButton = (vm, h, currentRow, index) => {
  return h('Button', {
    props: {
      type: 'primary'
    },
    style: {
      margin: '0 5px'
    },
    on: {
      'click': () => {
        vm.formItem.id = currentRow.id
        vm.formItem.from = currentRow.from
        vm.formItem.subject = '回复：' + currentRow.subject
        vm.formItem.content = '\n\n------------------ 原始邮件 ------------------\n' + currentRow.content
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, '回复')
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
  name: 'message_receive',
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
          title: '发件人',
          align: 'center',
          minWidth: 190,
          key: 'from'
        },
        {
          title: '发件人ID',
          align: 'center',
          minWidth: 190,
          key: 'user_id'
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
          title: '留言时间',
          align: 'center',
          key: 'send_time',
          width: 140
        },
        {
          title: '回复时间',
          align: 'center',
          key: 'write_time',
          width: 120
        },
        {
          title: '状态',
          align: 'center',
          key: 'hasview',
          width: 120
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              replyButton(this, h, params.row, params.index),
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
      formItem: {
        from: '',
        subject: '',
        content: '',
        id: 0
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
    alertAdd () {
      let vm = this
      vm.modalSetting.show = true
    },
    submit () {
      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          replyMessage(vm.formItem).then(response => {
            vm.modalSetting.loading = false
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.cancel()
          }).catch(() => {
            vm.modalSetting.loading = false
          })
        }
      })
    },
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
      getMsgReceive({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords
      }).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    detailCancel () {
      this.modalDetail.show = false
    }
  }
}
</script>
