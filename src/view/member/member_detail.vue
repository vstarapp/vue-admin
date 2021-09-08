<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="md-person"></Icon>
        会员信息
      </p>
      <div>
        <Form ref="myForm" :model="formItem" :label-width="90">
          <FormItem label="用户名" prop="username">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.username" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="用户昵称" prop="nickname">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.nickname" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="手机号码" prop="mobile">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.mobile" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="真实姓名" prop="real_name">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.real_name" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="会员等级" prop="group_name">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.group_name" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="推荐人" prop="parent">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.parent" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="直推人数" prop="share_count">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.share_count" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="团队人数" prop="team_count">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.team_count" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="爱心果" prop="love_fruit">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.love_fruit" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="爱心值" prop="score">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.score" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="个人能量值" prop="energy_value">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.energy_value" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="团队能量值" prop="team_energy_value">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.team_energy_value" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="推荐码" prop="share_code">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.share_code" disabled></Input>
            </div>
          </FormItem>
          <FormItem label="注册时间" prop="create_time">
            <div style="display:inline-block;width:300px">
              <Input v-model="formItem.create_time" disabled></Input>
            </div>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import { getMemberDetail } from '@/api/member'

export default {
  name: 'member_detail',
  data () {
    return {
      formItem: {
        username: '',
        nickname: '',
        group_name: '',
        parent: '',
        team_count: 0,
        share_count: 0,
        share_code: '',
        love_fruit: 0,
        energy_value: 0,
        team_energy_value: 0,
        score: 0,
        email: '',
        real_name: '',
        mobile: '',
        create_time: '',
        check_status: '',
        status: '',
        zhifubao: ''
      }
    }
  },
  methods: {
    init () {
      let vm = this
      getMemberDetail(this.$route.params.id).then(response => {
        vm.formItem = response.data.data.data
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
