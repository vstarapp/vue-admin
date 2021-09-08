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
          <div>
            <Tree :data="tableData" :load-data="loadData" show-checkbox></Tree>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { getTreeList } from '@/api/member'
export default {
  name: 'member_tree',
  data () {
    return {
      tableData: [],
      searchConf: {
        type: '',
        date: '',
        keywords: '',
        status: ''
      }
    }
  },
  created () {
    this.getList(0)
  },
  methods: {
    search () {
      this.getList(0)
    },
    getList (pid) {
      let vm = this
      let params = {
        type: vm.searchConf.type,
        date: vm.searchConf.date,
        pid: pid,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getTreeList(params).then(response => {
        vm.tableData = response.data.data.list
      })
    },
    loadData (item, callback) {
      let vm = this
      let params = {
        type: vm.searchConf.type,
        date: vm.searchConf.date,
        pid: item.pid,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getTreeList(params).then(response => {
        callback(response.data.data.list)
      })
    }
  }
}
</script>
