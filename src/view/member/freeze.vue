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
              <DatePicker type="datetimerange" v-model="searchConf.date" format="yyyy-MM-dd HH:mm" placeholder="冻结时间" style="width: 300px"></DatePicker>
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
  </div>
</template>
<script>
import { getFreezeList, del, doUnfreeze } from '@/api/member'
const unfreezeButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: `您确定要解冻${currentRow.username}吗? `,
      transfer: true
    },
    on: {
      'on-ok': () => {
        doUnfreeze(currentRow.id).then(response => {
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
        type: 'warning',
        placement: 'top',
        loading: currentRow.isDeleting
      }
    }, '解冻')
  ])
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
  name: 'member_freeze',
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
          minWidth: 90
        },
        {
          title: '会员级别',
          align: 'center',
          key: 'group_name',
          minWidth: 90
        },
        {
          title: '爱心果',
          align: 'center',
          key: 'love_fruit',
          width: 90
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
          title: '冻结原因',
          align: 'center',
          key: 'lock_reason',
          width: 150
        },
        {
          title: '冻结时间',
          align: 'center',
          key: 'lock_time',
          width: 120
        },
        {
          title: '操作',
          align: 'center',
          width: 178,
          render: (h, params) => {
            return h('div', [
              unfreezeButton(this, h, params.row, params.index),
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
        keywords: ''
      },
      formItem: {
        username: '',
        nickname: '',
        password: '',
        share_code: '',
        id: 0
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
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
        keywords: vm.searchConf.keywords
      }
      getFreezeList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
