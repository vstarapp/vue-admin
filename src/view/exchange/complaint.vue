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
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>投诉仲裁处理</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="投诉人" prop="complain_user">
          <Input v-model="formItem.complain_user" :disabled="true" placeholder=""></Input>
        </FormItem>
        <FormItem label="被投诉人" prop="respond_user">
          <Input v-model="formItem.respond_user" :disabled="true" ></Input>
        </FormItem>
        <FormItem label="投诉内容" prop="complain_content">
          <Input v-model="formItem.complain_content" :disabled="true" type="textarea"></Input>
        </FormItem>
        <FormItem label="仲裁判决" prop="winner">
          <RadioGroup v-model="formItem.winner">
            <Radio label="1">投诉方赢</Radio>
            <Radio label="2">被投诉方赢</Radio>
          </RadioGroup>
          <Tag color="error" class="margin-left-5">永久冻结问题方账号，另一方解冻账号</Tag>
        </FormItem>
        <FormItem label="仲裁结果" prop="final_result">
          <Input v-model="formItem.final_result" type="textarea"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">提交仲裁</Button>
      </div>
    </Modal>
    <Modal v-model="modalImg.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancelShowImg">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>查看图片</span>
      </p>
      <img :src="imagepath" width="100%"/>
      <div slot="footer">
        <Button type="text" @click="cancelShowImg" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="cancelShowImg" :loading="modalImg.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getComplaintList, complaintCancel, complaintAdd, cktp } from '@/api/exchange'
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
            vm.imagepath = config.baseUrl.site + response.data.data.photo
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
const editButton = (vm, h, currentRow, index) => {
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
        vm.formItem.complain_user = currentRow.complain_user
        vm.formItem.respond_user = currentRow.respond_user
        vm.formItem.complain_content = currentRow.complain_content
        vm.formItem.final_result = currentRow.final_result
        vm.formItem.winner = 0
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, '仲裁')
}
const cancelButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要撤销这条投诉吗? ',
      transfer: true
    },
    on: {
      'on-ok': () => {
        complaintCancel(currentRow.id).then(response => {
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
    }, '撤销投诉')
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
          width: 100,
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
          width: 220
        },
        {
          title: '操作',
          align: 'center',
          width: 220,
          render: (h, params) => {
            return h('div', [
              editButton(this, h, params.row, params.index),
              cancelButton(this, h, params.row, params.index)
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
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      modalImg: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        complain_user: '',
        respond_user: '',
        complain_content: '',
        final_result: '',
        winner: 0,
        id: 0
      },
      imagepath: '',
      ruleValidate: {
        winner: [
          { required: true, message: '请选择胜负双方', trigger: 'blur' }
        ],
        final_result: [
          { required: true, message: '判决结果不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    submit () {
      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          complaintAdd(vm.formItem).then(response => {
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
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
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
      getComplaintList(params).then(response => {
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
