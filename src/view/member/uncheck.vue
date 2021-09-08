<style lang="less" scoped>
  @import './uncheck.less';
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
                <Option :value="1">会员账号</Option>
                <Option :value="2">会员昵称</Option>
                <Option :value="3">手机号码</Option>
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
    <Modal v-model="modalVerifySetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doVerifyCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formVerify.id ? '编辑' : '新增'}}认证</span>
      </p>
      <Form ref="myVerifyForm" :rules="verifyRuleValidate" :model="formVerify" :label-width="80">
        <FormItem label="真实姓名" prop="real_name">
          <Input v-model="formVerify.real_name" placeholder="请输入会员真实姓名"></Input>
        </FormItem>
        <FormItem label="身份证正面" prop="cardpic">
          <div class="demo-upload-list" v-if="formVerify.cardpic">
            <img :src="formVerify.cardpic">
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handlePicRemove()"></Icon>
            </div>
          </div>
          <input v-if="formVerify.cardpic" v-model="formVerify.cardpic" type="hidden" name="cardpic">
          <Upload type="drag"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  v-if="!formVerify.cardpic"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handlePicSuccess"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="身份证反面" prop="cardpic1">
          <div class="demo-upload-list" v-if="formVerify.cardpic1">
            <img :src="formVerify.cardpic1">
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handlePic1Remove()"></Icon>
            </div>
          </div>
          <input v-if="formVerify.cardpic1" v-model="formVerify.cardpic1" type="hidden" name="cardpic1">
          <Upload type="drag"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  v-if="!formVerify.cardpic1"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handlePic1Success"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="身份证号码" prop="card_number">
          <Input style="width: 300px" v-model="formVerify.card_number"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="verifyCancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="verifySubmit" :loading="modalVerifySetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getUnCheckList, changeStatus, add, edit, del, addVerify } from '@/api/member'
import { baseUrl } from '@/libs/api.request'
import { getToken } from '@/libs/util'
const verifyButton = (vm, h, currentRow, index) => {
  return h('Button', {
    props: {
      type: 'primary'
    },
    style: {
      margin: '0 5px'
    },
    on: {
      'click': () => {
        vm.formVerify.id = currentRow.id
        vm.formVerify.real_name = currentRow.real_name
        vm.formVerify.card_number = currentRow.card_number
        vm.formVerify.cardpic = currentRow.cardpic
        vm.formVerify.cardpic1 = currentRow.cardpic1
        vm.modalVerifySetting.show = true
        vm.modalVerifySetting.index = index
      }
    }
  }, vm.$t('verify'))
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
      uploadUrl: baseUrl + 'Index/upload',
      uploadHeader: { 'apiAuth': getToken() },
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
          minWidth: 90
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
          width: 100
        },
        {
          title: '推荐会员',
          align: 'center',
          key: 'parent',
          width: 100
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
          key: 'love_fruit',
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
          title: '操作',
          align: 'center',
          width: 280,
          render: (h, params) => {
            return h('div', [
              verifyButton(this, h, params.row, params.index),
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
      modalVerifySetting: {
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
      formVerify: {
        real_name: '',
        card_number: '',
        cardpic: '',
        cardpic1: '',
        id: 0
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ]
      },
      verifyRuleValidate: {
        real_name: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        card_number: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    verifyAdd () {
      this.modalVerifySetting.show = true
    },
    alertAdd () {
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
      getUnCheckList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    verifyCancel () {
      this.modalVerifySetting.show = false
    },
    handleImgFormatError (file) {
      this.$Notice.warning({
        title: '文件类型不合法',
        desc: file.name + '的文件类型不正确，请上传jpg或者png图片。'
      })
    },
    handlePicRemove () {
      this.formVerify.cardpic = ''
    },
    handlePic1Remove () {
      this.formVerify.cardpic1 = ''
    },
    handlePicSuccess (response) {
      if (response.code === 1) {
        this.$Message.success(response.msg)
        this.formVerify.cardpic = response.data.fileUrl
      } else {
        this.$Message.error(response.msg)
      }
    },
    handlePic1Success (response) {
      if (response.code === 1) {
        this.$Message.success(response.msg)
        this.formVerify.cardpic1 = response.data.fileUrl
      } else {
        this.$Message.error(response.msg)
      }
    },
    handleImgMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小不合法',
        desc: file.name + '太大啦请上传小于5M的文件。'
      })
    },
    doVerifyCancel (data) {
      if (!data) {
        this.formVerify.id = 0
        this.formVerify.cardpic = ''
        this.formVerify.cardpic1 = ''
        this.$refs['myVerifyForm'].resetFields()
        this.modalVerifySetting.loading = false
        this.modalVerifySetting.index = 0
      }
    },
    verifySubmit () {
      let vm = this
      this.$refs['myVerifyForm'].validate((valid) => {
        if (valid) {
          vm.modalVerifySetting.loading = true
          addVerify(vm.formVerify).then(response => {
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.verifyCancel()
          }).catch(() => {
            vm.modalVerifySetting.loading = false
          })
        }
      })
    }
  }
}
</script>
