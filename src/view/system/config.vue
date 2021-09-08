<style lang="less" scoped>
  @import './user.less';
</style>
<template>
  <div>
    <Tabs :animated="false" value="base" @on-click="changeTab">
      <TabPane v-for="(group,index) in groupList" :key="index" :label="group" :name="index">
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
                    <Option :value="1">名称</Option>
                    <Option :value="2">标题</Option>
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
      </TabPane>
    </Tabs>
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}系统参数</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="配置分组" prop="group">
          <RadioGroup v-model="formItem.group">
            <Radio v-for="(value,index) in groupList" :key="index" :label="index">{{value}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="配置类型" prop="type">
          <Select v-model="formItem.type"  clearable>
            <Option v-for="(value,index) in formItemTypeList" :key="index" :value="index">{{value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入配置标题"></Input>
          <Tag color="error" class="margin-left-5">一般由中文组成，仅用于显示</Tag>
        </FormItem>
        <FormItem label="配置名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入配置名称"></Input>
          <Tag color="error" class="margin-left-5">由英文字母和下划线组成，如 site_title，调用方法：config('site_title')</Tag>
        </FormItem>
        <FormItem label="配置值" prop="value">
          <Input v-model="formItem.value" placeholder="请输入配置值" type="textarea" :rows="3"></Input>
          <Tag color="error" class="margin-left-5">该配置的具体内容</Tag>
        </FormItem>
        <FormItem label="配置项" prop="options">
          <Input v-model="formItem.options" placeholder="请输入配置项" type="textarea" :rows="3"></Input>
          <Tag color="error" class="margin-left-5">用于单选、多选、下拉、联动等类型</Tag>
        </FormItem>
        <FormItem label="配置说明" prop="tips">
          <Input v-model="formItem.tips" placeholder="请输入配置说明"></Input>
          <Tag color="error" class="margin-left-5">该配置的具体说明</Tag>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="formItem.sort" placeholder="请输入排序"></Input>
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
import { getList, changeStatus, add, edit, del, getAllGroups, getFormItemType } from '@/api/config'

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
        vm.formItem.group = currentRow.group
        vm.formItem.type = currentRow.type
        vm.formItem.title = currentRow.title
        vm.formItem.name = currentRow.name
        vm.formItem.value = currentRow.value
        vm.formItem.options = currentRow.options
        vm.formItem.tips = currentRow.tips
        vm.formItem.sort = currentRow.sort
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
  name: 'system_user',
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
          title: '名称',
          align: 'center',
          key: 'name',
          minWidth: 120
        },
        {
          title: '标题',
          align: 'center',
          key: 'title',
          width: 160
        },
        {
          title: '类型',
          align: 'center',
          key: 'type',
          width: 160
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
      groupList: [],
      formItemTypeList: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      searchConf: {
        type: '',
        keywords: '',
        status: '',
        group: 'base'
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        group: 'base',
        type: '',
        name: '',
        title: '',
        value: '',
        options: '',
        tips: '',
        sort: 0,
        id: 0
      },
      ruleValidate: {
        type: [
          { required: true, message: '配置类型不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '配置标题不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '配置名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '配置值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGroups()
    this.getList()
    this.getFormItemTypes()
  },
  methods: {
    getGroups () {
      let vm = this
      getAllGroups().then(response => {
        vm.groupList = response.data.data.list
      })
    },
    getFormItemTypes () {
      let vm = this
      getFormItemType().then(response => {
        vm.formItemTypeList = response.data.data.list
      })
    },
    alertAdd () {
      this.formItem.group = this.searchConf.group
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
    changeTab (id) {
      this.searchConf.group = id
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
        status: vm.searchConf.status,
        group: vm.searchConf.group
      }
      getList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
