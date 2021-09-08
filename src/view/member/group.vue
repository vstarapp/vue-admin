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
                <Option :value="1">级别标识</Option>
                <Option :value="2">级别名称</Option>
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
        <span>{{formItem.id ? '编辑' : '新增'}}会员等级</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="头衔" prop="name">
          <Input v-model="formItem.name" placeholder="请输入头衔"></Input>
        </FormItem>
        <FormItem label="级别" prop="level">
          <Input v-model="formItem.level" type="number" placeholder="请输入级别"></Input>
        </FormItem>
        <FormItem label="直接分享" prop="share_num">
          <Input v-model="formItem.share_num" type="number" placeholder="直接分享有效初级（及以上）"></Input>
        </FormItem>
        <FormItem label="团队能量值" prop="energy_value">
          <Input v-model="formItem.energy_value" type="number" placeholder="团队能量值（G）"></Input>
        </FormItem>
        <FormItem label="培养" prop="cultivate">
          <Input v-model="formItem.cultivate" type="number" placeholder="培养"></Input>
        </FormItem>
        <FormItem label="奖励永久能量盒" prop="product_id">
          <Select v-model="formItem.product_id" style="width:200px">
            <Option v-for="(v, i) in productList" :value="v.id" :kk="i" :key="v.id"> {{v.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="手续费加权分红比例" prop="dividend_rate">
          <Input v-model="formItem.dividend_rate" type="number" placeholder="手续费加权分红比例"></Input>
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
import { getList, changeStatus, add, edit, del } from '@/api/member-group'
import { getAll } from '@/api/product'

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
        getAll().then(response => {
          vm.productList = response.data.data.list
          vm.formItem.id = currentRow.id
          vm.formItem.name = currentRow.name
          vm.formItem.level = currentRow.level
          vm.formItem.energy_value = currentRow.energy_value
          vm.formItem.share_num = currentRow.share_num
          vm.formItem.cultivate = currentRow.cultivate
          vm.formItem.product_id = currentRow.product_id
          vm.formItem.dividend_rate = currentRow.dividend_rate
          vm.modalSetting.show = true
          vm.modalSetting.index = index
        })
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
  name: 'system_user',
  data () {
    return {
      productList: [],
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '头衔',
          align: 'center',
          key: 'name',
          minWidth: 90
        },
        {
          title: '级别',
          align: 'center',
          key: 'level',
          width: 90
        },
        {
          title: '直接分享有效初级（及以上）',
          align: 'center',
          key: 'share_num',
          width: 220
        },
        {
          title: '团队能量值（G）',
          align: 'center',
          key: 'energy_value',
          width: 160
        },
        {
          title: '培养',
          align: 'center',
          key: 'cultivate',
          width: 90
        },
        {
          title: '手续费加权分红比例',
          align: 'center',
          key: 'dividend_rate',
          width: 200
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
        name: '',
        level: '',
        share_num: '',
        cultivate: '',
        product_id: '',
        energy_value: '',
        dividend_rate: '',
        id: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '头衔不能为空', trigger: 'blur' }
        ],
        share_num: [
          { required: true, message: '直接分享有效初级（及以上）不能为空', trigger: 'blur' }
        ],
        energy_value: [
          { required: true, message: '团队能量值不能为空', trigger: 'blur' }
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
      getAll().then(response => {
        vm.productList = response.data.data.list
      })
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
      getList({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
