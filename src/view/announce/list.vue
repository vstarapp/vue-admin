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
                <Option :value="1">接口标识</Option>
                <Option :value="2">接口名称</Option>
                <Option :value="3">真实类库</Option>
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
        <span>{{formItem.id ? '编辑' : '新增'}}公告</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="90">
        <FormItem label="标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入公告标题"></Input>
        </FormItem>
        <FormItem label="发布时间" prop="publish_time">
          <DatePicker v-model="formItem.publish_time" type="date" placeholder="选择日期" style="width: 200px;z-index:100100000"></DatePicker>
        </FormItem>
        <FormItem label="发布人" prop="operator">
          <Input v-model="formItem.operator" placeholder="" style="width:200px"></Input>
        </FormItem>
        <FormItem label="公告类别" prop="tid">
          <Select v-model="formItem.tid" style="width:200px">
            <Option v-for="(v, i) in announceType" :value="v.id" :kk="i" :key="v.hash"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="查看权限" prop="viewer">
          <RadioGroup v-model="formItem.viewer">
            <Radio label="all">所有人</Radio>
            <Radio label="member">会员</Radio>
            <Radio label="center">报单中心</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="接口映射" prop="content">
          <mavon-editor
            v-model="formItem.content"
            ref="md"
            @change="change"
            style="min-height: 250px"/>
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
import { getList, changeStatus, add, edit, del } from '@/api/announce'
import { getAll } from '@/api/announce-type'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
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
        vm.formItem.title = currentRow.title
        vm.formItem.operator = currentRow.operator
        vm.formItem.viewer = currentRow.viewer
        vm.formItem.tid = currentRow.tid
        vm.formItem.publish_time = currentRow.publish_time
        vm.formItem.content = currentRow.content
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
        del(currentRow.hash).then(response => {
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
  name: 'interface_list',
  components: {
    mavonEditor
  },
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
          title: '标题',
          align: 'center',
          minWidth: 190,
          key: 'title'
        },
        {
          title: '发布人',
          align: 'center',
          key: 'operator',
          width: 120
        },
        {
          title: '发布时间',
          align: 'center',
          key: 'publish_time',
          width: 140
        },
        {
          title: '添加时间',
          align: 'center',
          key: 'create_time',
          width: 140
        },
        {
          title: '类别',
          align: 'center',
          key: 'type',
          width: 120
        },
        {
          title: '查看权限',
          align: 'center',
          key: 'viewer_text',
          width: 120
        },
        {
          title: '状态',
          align: 'center',
          width: 130,
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
                  changeStatus(status, params.row.hash).then(response => {
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
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              editButton(this, h, params.row, params.index),
              deleteButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      tableData: [],
      announceType: [],
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
        title: '',
        content: '',
        operator: 'admin',
        viewer: 'all',
        tid: 0,
        publish_time: '',
        id: 0
      },
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  activated () {
    let vm = this
    getAll().then(response => {
      vm.announceType = response.data.data.list
    })
  },
  methods: {
    alertAdd () {
      let vm = this
      getAll().then(response => {
        vm.announceType = response.data.data.list
      })
      vm.modalSetting.show = true
    },
    submit () {
      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            add(vm.formItem).then(response => {
              vm.modalSetting.loading = false
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          } else {
            edit(vm.formItem).then(response => {
              vm.modalSetting.loading = false
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
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    change (value, render) {
      this.formItem.content = render
    }
  }
}
</script>
