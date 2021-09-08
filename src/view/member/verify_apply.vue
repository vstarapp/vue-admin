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
              <Select v-model="searchConf.status" clearable placeholder='请选择状态' style="width:100px">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:100px">
                <Option :value="1">真实姓名</Option>
                <Option :value="2">会员账号</Option>
                <Option :value="3">会员昵称</Option>
                <Option :value="4">手机号码</Option>
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
        <span>审核确认</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="真实姓名" prop="real_name">
          <Input v-model="formItem.real_name" disabled></Input>
        </FormItem>
        <FormItem label="身份证号码" prop="card_number">
          <Input v-model="formItem.card_number" disabled></Input>
        </FormItem>
        <FormItem label="审核状态" prop="status">
          <Select v-model="formItem.status" clearable style="width:200px">
            <Option value="3" :key="3">实名通过</Option>
            <Option value="2" :key="2">实名失败</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getVerifyApplyList, doApply, delApply } from '@/api/member'

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
        vm.formItem.real_name = currentRow.real_name
        vm.formItem.card_number = currentRow.card_number
        vm.formItem.status = currentRow.status
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, vm.$t('apply_button'))
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
        delApply(currentRow.id).then(response => {
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
  name: 'member_verify_apply',
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
          title: '会员账号',
          align: 'center',
          key: 'username',
          minWidth: 120
        },
        {
          title: '会员昵称',
          align: 'center',
          key: 'nickname',
          width: 120
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'mobile',
          width: 120
        },
        {
          title: '真实姓名',
          align: 'center',
          key: 'real_name',
          width: 120
        },
        {
          title: '身份证号',
          align: 'center',
          key: 'card_number',
          width: 180
        },
        {
          title: '申请时间',
          align: 'center',
          key: 'create_time',
          width: 180
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              editButton(this, h, params.row, params.index),
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
        keywords: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        real_name: '',
        card_number: '',
        status: '',
        id: 0
      },
      ruleValidate: {
        real_name: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        card_number: [
          { required: true, message: '身份证号码不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
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
          doApply(vm.formItem).then(response => {
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
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getVerifyApplyList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
