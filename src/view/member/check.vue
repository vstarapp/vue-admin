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
              <DatePicker type="datetimerange" v-model="searchConf.date" format="yyyy-MM-dd HH:mm" placeholder="筛选时间段" style="width: 300px"></DatePicker>
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
          <p slot="title" style="height: 32px">
            <Button type="primary" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
          </p>
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
        <span>{{formItem.id ? '编辑' : '新增'}}会员</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="会员账号" prop="username">
          <Input v-model="formItem.username" :disabled="formItem.id?true:false" placeholder=""></Input>
        </FormItem>
        <FormItem label="会员昵称" prop="nickname">
          <Input v-model="formItem.nickname" placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem label="会员密码" prop="password">
          <Input v-model="formItem.password" type="password" placeholder="不设置则留空"></Input>
        </FormItem>
        <FormItem label="推荐码" prop="share_code">
          <Input v-model="formItem.share_code" :disabled="formItem.id?true:false" placeholder="推荐码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalChangeAmount.show" width="668" :styles="{top: '30px'}" @on-visible-change="doChangeAmountCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}爱心果</span>
      </p>
      <Form ref="changeAmountForm" :rules="ruleValidateChangeAmount" :model="changeAmountForm" :label-width="80">
        <FormItem label="会员账号" prop="username">
          <Input v-model="changeAmountForm.username" :disabled="true" placeholder=""></Input>
        </FormItem>
        <FormItem label="变动类型" prop="type">
          <Select v-model="changeAmountForm.type" style="width:200px">
            <Option :value="1" :key="1"> 添加</Option>
            <Option :value="2" :key="2"> 减少</Option>
          </Select>
        </FormItem>
        <FormItem label="变动数量" prop="amount">
          <Input v-model="changeAmountForm.amount" type="number" placeholder="请输入变动数量"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="changeAmountForm.remark" type="textarea" :rows="3"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="changeAmountCancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="changeAmountSubmit" :loading="modalChangeAmount.loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalFreeze.show" width="668" :styles="{top: '30px'}" @on-visible-change="doFreezeCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>冻结会员</span>
      </p>
      <Form ref="myForm1" :model="formItemFreeze" :label-width="80">
        <FormItem label="会员账号" prop="username">
          <Input v-model="formItemFreeze.username" :disabled="true" placeholder=""></Input>
        </FormItem>
        <FormItem label="冻结原因" prop="content">
          <Input v-model="formItemFreeze.lock_reason" type="textarea"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="freezeCancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submitFreeze" :loading="modalFreeze.loading">确定冻结</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { changeAmount } from '@/api/member-fruit-flow'
import { getCheckList, changeStatus, add, edit, del, doFreeze } from '@/api/member'
const memberDetail = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        vm.$router.push({
          name: 'member_detail',
          query: {
            id: currentRow.id
          }
        })
      }
    }
  }, currentRow.username)
}
const changeAmountButton = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        vm.changeAmountForm.id = currentRow.id
        vm.changeAmountForm.username = currentRow.username
        vm.changeAmountForm.type = currentRow.type
        vm.changeAmountForm.amount = currentRow.amount
        vm.changeAmountForm.remark = currentRow.remark
        vm.modalChangeAmount.show = true
        vm.modalChangeAmount.index = index
      }
    }
  }, currentRow.love_fruit)
}
const changeFrozenButton = (vm, h, currentRow, index) => {
  return h('a', {
    props: {
      type: 'primary'
    },
    on: {
      'click': () => {
        vm.formItemFreeze.id = currentRow.id
        vm.formItemFreeze.username = currentRow.username
        vm.formItemFreeze.lock_reason = ''
        vm.modalFreeze.show = true
        vm.modalFreeze.index = index
      }
    }
  }, '冻结')
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
        vm.formItem.username = currentRow.username
        vm.formItem.nickname = currentRow.nickname
        vm.formItem.password = ''
        vm.formItem.share_code = currentRow.share_code
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, vm.$t('edit_button'))
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
  name: 'member_list',
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
          render: (h, params) => {
            return h('div', [
              memberDetail(this, h, params.row, params.index)
            ])
          },
          minWidth: 90
        },
        {
          title: '会员级别',
          align: 'center',
          key: 'group_name',
          minWidth: 90
        },
        {
          title: '推荐会员',
          align: 'center',
          key: 'parent',
          width: 120
        },
        {
          title: '推荐人数',
          align: 'center',
          key: 'share_count',
          width: 100
        },
        {
          title: '爱心果',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('div', [
              changeAmountButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '爱心值',
          align: 'center',
          key: 'score',
          width: 90
        },
        {
          title: '能量值',
          align: 'center',
          key: 'energy_value',
          width: 90
        },
        {
          title: '团队能量值',
          align: 'center',
          key: 'team_energy_value',
          width: 120
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let vm = this
            return h('i-switch', {
              attrs: {
                size: 'large'
              },
              props: {
                'true-value': 1,
                'false-value': 0,
                value: params.row.status
              },
              on: {
                'on-change': function (status) {
                  changeStatus(status, params.row.id).then(response => {
                    vm.$Message.success(response.data.msg)
                    vm.getList()
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, vm.$t('open_choose')),
              h('span', {
                slot: 'close'
              }, vm.$t('close_choose'))
            ])
          }
        },
        {
          title: '冻结',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('div', [
              changeFrozenButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 178,
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
        date: '',
        keywords: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      modalChangeAmount: {
        show: false,
        loading: false,
        index: 0
      },
      modalFreeze: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        username: '',
        nickname: '',
        password: '',
        share_code: '',
        id: 0
      },
      changeAmountForm: {
        type: 0,
        amount: 0,
        remark: '',
        id: 0
      },
      formItemFreeze: {
        id: 0,
        username: '',
        lock_reason: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ]
      },
      ruleValidateChangeAmount: {
        amount: [
          { required: true, message: '变动数量不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    alertAdd () {
      // let vm = this
      this.modalSetting.show = true
    },
    submit () {
      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            add(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          } else {
            edit(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          }
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
      getCheckList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    changeAmountCancel () {
      this.modalChangeAmount.show = false
    },
    doChangeAmountCancel (data) {
      if (!data) {
        this.changeAmountForm.id = 0
        this.$refs['changeAmountForm'].resetFields()
        this.modalChangeAmount.loading = false
        this.modalChangeAmount.index = 0
      }
    },
    changeAmountSubmit () {
      let vm = this
      this.$refs['changeAmountForm'].validate((valid) => {
        if (valid) {
          vm.modalChangeAmount.loading = true
          changeAmount(vm.changeAmountForm).then(response => {
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.changeAmountCancel()
          }).catch(() => {
            vm.modalChangeAmount.loading = false
          })
        }
      })
    },
    freezeCancel () {
      this.modalFreeze.show = false
    },
    doFreezeCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm1'].resetFields()
        this.modalFreeze.loading = false
        this.modalFreeze.index = 0
      }
    },
    submitFreeze () {
      let vm = this
      doFreeze(vm.formItemFreeze).then(response => {
        vm.$Message.success(response.data.msg)
        vm.getList()
        vm.freezeCancel()
      }).catch(() => {
        vm.modalFreeze.loading = false
      })
    }
  }
}
</script>
