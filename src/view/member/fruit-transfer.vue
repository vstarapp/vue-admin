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
              <Select v-model="searchConf.status" clearable placeholder="请选择状态" style="width:100px">
                <Option :value="0">等待接收</Option>
                <Option :value="1">转出成功</Option>
                <Option :value="2">转出失败</Option>
                <Option :value="3">已撤销</Option>
                <Option :value="4">退回</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:100px">
                <Option :value="1">转出人姓名</Option>
                <Option :value="2">转出人账号</Option>
                <Option :value="3">转出人昵称</Option>
                <Option :value="4">转出人号码</Option>
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
  </div>
</template>
<script>
import { getTransferList } from '@/api/member-fruit-transfer'

export default {
  name: 'member_fruit_transfer',
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
          title: '转出人ID',
          align: 'center',
          key: 'send_id',
          minWidth: 120
        },
        {
          title: '转出人账号',
          align: 'center',
          key: 'send',
          width: 120
        },
        {
          title: '转出数额',
          align: 'center',
          key: 'transfer_amount',
          width: 120
        },
        {
          title: '手续费',
          align: 'center',
          key: 'handling_fee',
          width: 120
        },
        {
          title: '转账时间',
          align: 'center',
          key: 'create_time',
          width: 160
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 100
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark',
          width: 180
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
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getTransferList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
