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
                <Option :value="1">AppId</Option>
                <Option :value="2">应用名称</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.keywords" placeholder="能量盒名称"></Input>
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
        <span>{{formItem.id ? '编辑' : '新增'}}能量盒</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="能量盒名称" prop="title">
          <Input v-model="formItem.title" placeholder="请输入能量盒名称"></Input>
        </FormItem>
        <FormItem label="封面" prop="thumb">
          <div class="demo-upload-list" v-if="formItem.thumb">
            <img :src="formItem.thumb">
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleImgRemove()"></Icon>
            </div>
          </div>
          <input v-if="formItem.thumb" v-model="formItem.thumb" type="hidden" name="thumb">
          <Upload type="drag"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  v-if="!formItem.thumb"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handleImgSuccess"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="能量盒分类" prop="product_type_id">
          <Select v-model="formItem.product_type_id" style="width:200px">
            <Option v-for="(v, i) in productType" :value="v.id" :kk="i" :key="v.id"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="每天产量" prop="daily_output">
          <Input style="width: 300px" type="number" v-model="formItem.daily_output"
                 placeholder="请输入每天产量">
          </Input>
        </FormItem>
        <FormItem label="能量值" prop="energy_value">
          <Input style="width: 300px" type="number" v-model="formItem.energy_value"
                 placeholder="请输入能量值">
          </Input>
        </FormItem>
        <FormItem label="同时开启上限" prop="purchase_limit">
          <Input style="width: 300px" type="number" v-model="formItem.purchase_limit"
                 placeholder="请输入同时开启上限">
          </Input>
          <Tag class="margin-left-5">（个）</Tag>
        </FormItem>
        <FormItem label="描述" prop="content">
          <Input v-model="formItem.content" type="textarea"></Input>
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
import { getFreeList, changeStatus, addFree, edit, del } from '@/api/product'
import { baseUrl } from '@/libs/api.request'
import { getToken } from '@/libs/util'
import { getAll } from '@/api/product-type'

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
          vm.productType = response.data.data.list
          vm.formItem.id = currentRow.id
          vm.formItem.title = currentRow.title
          vm.formItem.thumb = currentRow.thumb
          vm.formItem.price = currentRow.price
          vm.formItem.stock = currentRow.stock
          vm.formItem.energy_value = currentRow.energy_value
          vm.formItem.cycle = currentRow.cycle
          vm.formItem.daily_output = currentRow.daily_output
          vm.formItem.purchase_limit = currentRow.purchase_limit
          vm.formItem.content = currentRow.content
          vm.formItem.product_type_id = currentRow.product_type_id
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
  name: 'interface_list',
  data () {
    return {
      uploadUrl: baseUrl + 'Index/upload',
      uploadHeader: { 'apiAuth': getToken() },
      productType: [],
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '能量盒名称',
          align: 'center',
          key: 'title',
          minWidth: 120
        },
        {
          title: '能量盒类型',
          align: 'center',
          key: 'type',
          minWidth: 120
        },
        {
          title: '能量值',
          align: 'center',
          key: 'energy_value',
          width: 120
        },
        {
          title: '每天产量',
          align: 'center',
          key: 'daily_output',
          width: 180
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
        title: '',
        thumb: '',
        price: '',
        stock: '',
        energy_value: '',
        cycle: '',
        daily_output: '',
        content: '',
        product_type_id: 1,
        purchase_limit: '',
        id: 0
      },
      ruleValidate: {
        title: [
          { required: true, message: '能量盒名称不能为空', trigger: 'blur' }
        ],
        daily_output: [
          { required: true, message: '每天产量不能为空', trigger: 'blur' }
        ],
        energy_value: [
          { required: true, message: '能量值不能为空', trigger: 'blur' }
        ]
      },
      checkAllStatus: {},
      checkAllIndeterminate: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    alertAdd () {
      let vm = this
      getAll().then(response => {
        vm.productType = response.data.data.list
      })
      vm.modalSetting.show = true
    },
    submit () {
      let vm = this
      vm.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            addFree(vm.formItem).then(response => {
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
      this.formItem.id = 0
      this.$refs['myForm'].resetFields()
      this.modalSetting.show = false
      this.modalSetting.loading = false
      this.modalSetting.index = 0
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
      getFreeList({
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
        this.formItem.thumb = ''
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    handleImgFormatError (file) {
      this.$Notice.warning({
        title: '文件类型不合法',
        desc: file.name + '的文件类型不正确，请上传jpg或者png图片。'
      })
    },
    handleImgRemove () {
      this.formItem.thumb = ''
    },
    handleImgSuccess (response) {
      if (response.code === 1) {
        this.$Message.success(response.msg)
        this.formItem.thumb = response.data.fileUrl
      } else {
        this.$Message.error(response.msg)
      }
    },
    handleImgMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小不合法',
        desc: file.name + '太大啦请上传小于5M的文件。'
      })
    }
  }
}
</script>
