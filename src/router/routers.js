import Main from '@/components/main'
import { dynamicRouterAdd } from '@/libs/router-utils'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export const otherRouter = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/login/:loginType',
    name: 'loginByType',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: '/user-center',
        name: 'user_center',
        meta: {
          hideInMenu: true,
          title: '个人中心',
          notCache: true,
          icon: 'md-home',
          access: 'admin/User/own'
        },
        component: () => import('@/view/single-page/own/own.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system_setting',
    meta: {
      icon: 'ios-build',
      title: '系统配置',
      access: ['admin/Menu/index', 'admin/User/index', 'admin/Auth/index', 'admin/Log/index', 'admin/memberGroup/index']
    },
    component: Main,
    children: [
      {
        path: 'menu',
        name: 'menu_setting',
        meta: {
          icon: 'md-menu',
          title: '菜单维护',
          access: 'admin/Menu/index'
        },
        component: () => import('@/view/system/menu.vue')
      },
      {
        path: 'user',
        name: 'user_setting',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          access: 'admin/User/index'
        },
        component: () => import('@/view/system/user.vue')
      },
      {
        path: 'auth',
        name: 'auth_setting',
        meta: {
          icon: 'md-lock',
          title: '权限管理',
          access: 'admin/Auth/index'
        },
        component: () => import('@/view/system/auth.vue')
      },
      {
        path: 'config',
        name: 'system_config',
        meta: {
          icon: 'md-settings',
          title: '系统参数',
          access: 'admin/Config/index'
        },
        component: () => import('@/view/system/config.vue')
      },
      {
        path: 'log',
        name: 'logs',
        meta: {
          icon: 'md-clipboard',
          title: '操作日志',
          access: 'admin/Log/index'
        },
        component: () => import('@/view/system/log.vue')
      }
    ]
  },
  // {
  //   path: '/apps',
  //   name: 'apps_setting',
  //   meta: {
  //     icon: 'md-cloud',
  //     title: '应用接入',
  //     access: ['admin/AppGroup/index', 'admin/App/index']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'appsGroup',
  //       name: 'apps_group',
  //       meta: {
  //         icon: 'ios-archive',
  //         title: '应用分组',
  //         access: 'admin/AppGroup/index'
  //       },
  //       component: () => import('@/view/app/group.vue')
  //     },
  //     {
  //       path: 'appsList',
  //       name: 'apps_list',
  //       meta: {
  //         icon: 'md-list-box',
  //         title: '应用列表',
  //         access: 'admin/App/index'
  //       },
  //       component: () => import('@/view/app/list.vue')
  //     }
  //   ]
  // },
  {
    path: '/member',
    name: 'member_setting',
    meta: {
      icon: 'md-people',
      title: '会员管理',
      access: ['admin/MemberGroup/index', 'admin/Member/uncheck', 'admin/Member/check', 'admin/Member/tree', 'admin/Member/verifyApply', 'admin/Member/verifyRecord', 'admin/Member/freeze']
    },
    component: Main,
    children: [
      {
        path: 'memberGroup',
        name: 'member_group',
        meta: {
          icon: 'ios-people',
          title: '会员等级',
          access: 'admin/MemberGroup/index'
        },
        component: () => import('@/view/member/group.vue')
      },
      {
        path: 'memberUncheck',
        name: 'member_uncheck',
        meta: {
          icon: 'ios-contact-outline',
          title: '未实名会员列表',
          access: 'admin/Member/uncheck'
        },
        component: () => import('@/view/member/uncheck.vue')
      },
      {
        path: 'memberCheck',
        name: 'member_check',
        meta: {
          icon: 'ios-contact',
          title: '已实名会员列表',
          access: 'admin/Member/check'
        },
        component: () => import('@/view/member/check.vue')
      },
      {
        path: 'member-detail',
        meta: {
          title: '会员详情',
          hideInMenu: true
        },
        name: 'member_detail',
        component: () => import('@/view/member/member_detail.vue')
      },
      {
        path: 'memberTree',
        name: 'member_tree',
        meta: {
          icon: 'md-git-network',
          title: '会员树状结构图',
          access: 'admin/Member/tree'
        },
        component: () => import('@/view/member/tree.vue')
      },
      {
        path: 'verifyApply',
        name: 'verify_apply',
        meta: {
          icon: 'md-list-box',
          title: '实名认证申请',
          access: 'admin/Member/verifyApply'
        },
        component: () => import('@/view/member/verify_apply.vue')
      },
      {
        path: 'verifyRecord',
        name: 'verify_record',
        meta: {
          icon: 'md-list-box',
          title: '实名认证记录',
          access: 'admin/Member/verifyRecord'
        },
        component: () => import('@/view/member/verify_record.vue')
      },
      {
        path: 'memberFreeze',
        name: 'member_freeze',
        meta: {
          icon: 'md-lock',
          title: '冻结会员',
          access: 'admin/Member/freeze'
        },
        component: () => import('@/view/member/freeze.vue')
      }
    ]
  },
  {
    path: '/operation',
    name: 'operation_setting',
    meta: {
      icon: 'md-cloud',
      title: '能量盒管理',
      access: ['admin/ProductType/index', 'admin/Product/free', 'admin/Product/index', 'admin/MemberTaskLog/index', 'admin/MemberFruitFlow/index', 'admin/MemberScore/index', 'admin/MemberEnergyFlow/index', 'admin/MemberTeamEnergyFlow/index', 'admin/MemberFruitTransfer/give', 'admin/MemberFruitTransfer/transfer', 'admin/MemberFruitFlow/bonus']
    },
    component: Main,
    children: [
      {
        path: 'productType',
        name: 'product_type',
        meta: {
          icon: 'ios-archive',
          title: '能量盒分类',
          access: 'admin/ProductType/index'
        },
        component: () => import('@/view/product/type.vue')
      },
      {
        path: 'productFree',
        name: 'product_free',
        meta: {
          icon: 'md-list-box',
          title: '免费能量盒列表',
          access: 'admin/Product/free'
        },
        component: () => import('@/view/product/free.vue')
      },
      {
        path: 'productList',
        name: 'product_list',
        meta: {
          icon: 'md-list-box',
          title: '兑换能量盒列表',
          access: 'admin/Product/index'
        },
        component: () => import('@/view/product/list.vue')
      },
      {
        path: 'taskList',
        name: 'task_list',
        meta: {
          icon: 'md-list-box',
          title: '任务完成列表',
          access: 'admin/MemberTaskLog/index'
        },
        component: () => import('@/view/member/task.vue')
      },
      {
        path: 'fruitFlowList',
        name: 'fruit_flow_list',
        meta: {
          icon: 'md-rose',
          title: '爱心果收支明细列表',
          access: 'admin/MemberFruitFlow/index'
        },
        component: () => import('@/view/member/fruit-flow.vue')
      },
      {
        path: 'scoreList',
        name: 'score_list',
        meta: {
          icon: 'ios-heart',
          title: '爱心收支明细列表',
          access: 'admin/MemberScore/index'
        },
        component: () => import('@/view/member/score.vue')
      },
      {
        path: 'energyFlowList',
        name: 'energy_flow_list',
        meta: {
          icon: 'md-list-box',
          title: '个人能量值收支列表',
          access: 'admin/MemberEnergyFlow/index'
        },
        component: () => import('@/view/member/energy-flow.vue')
      },
      {
        path: 'teamEnergyList',
        name: 'team_energy_list',
        meta: {
          icon: 'md-list-box',
          title: '团队能量值收支列表',
          access: 'admin/MemberTeamEnergyFlow/index'
        },
        component: () => import('@/view/member/energy-team.vue')
      },
      {
        path: 'fruitGiveList',
        name: 'fruit_give_list',
        meta: {
          icon: 'md-repeat',
          title: '爱心果转赠列表',
          access: 'admin/MemberFruitTransfer/give'
        },
        component: () => import('@/view/member/fruit-give.vue')
      },
      {
        path: 'fruitTransferList',
        name: 'fruit_transfer_list',
        meta: {
          icon: 'ios-redo',
          title: '爱心果转出列表',
          access: 'admin/MemberFruitTransfer/transfer'
        },
        component: () => import('@/view/member/fruit-transfer.vue')
      },
      {
        path: 'fruit_bonus_list',
        name: 'fruit_bonus_list',
        meta: {
          icon: 'md-list-box',
          title: '会员分红列表',
          access: 'admin/MemberFruitFlow/bonus'
        },
        component: () => import('@/view/member/fruit-bonus.vue')
      }
    ]
  },
  {
    path: '/exchange',
    name: 'exchange_setting',
    meta: {
      icon: 'md-swap',
      title: '交易管理',
      access: ['admin/Exchange/buy', 'admin/Exchange/trading', 'admin/Exchange/buyComplete', 'admin/Exchange/sellComplete', 'admin/Exchange/complaint', 'admin/Exchange/complaintComplete']
    },
    component: Main,
    children: [
      {
        path: 'exchangeBuy',
        name: 'exchange_buy',
        meta: {
          icon: 'md-archive',
          title: '买单列表',
          access: 'admin/Exchange/buy'
        },
        component: () => import('@/view/exchange/buy.vue')
      },
      {
        path: 'exchangeTrading',
        name: 'exchange_trading',
        meta: {
          icon: 'md-infinite',
          title: '交易中的订单',
          access: 'admin/Exchange/trading'
        },
        component: () => import('@/view/exchange/trading.vue')
      },
      {
        path: 'exchangeBuyComplete',
        name: 'exchange_buy_complete',
        meta: {
          icon: 'md-archive',
          title: '已完成的订单',
          access: 'admin/Exchange/buyComplete'
        },
        component: () => import('@/view/exchange/buy-complete.vue')
      },
      {
        path: 'exchangeComplaint',
        name: 'exchange_complaint',
        meta: {
          icon: 'md-infinite',
          title: '投诉中的订单',
          access: 'admin/Exchange/complaint'
        },
        component: () => import('@/view/exchange/complaint.vue')
      },
      {
        path: 'exchangeComplaintComplete',
        name: 'exchange_complaint_complete',
        meta: {
          icon: 'md-infinite',
          title: '已完成的投诉单',
          access: 'admin/Exchange/complaintComplete'
        },
        component: () => import('@/view/exchange/complaint-complete.vue')
      }
    ]
  },
  {
    path: '/announce',
    name: 'announce_setting',
    meta: {
      icon: 'md-notifications',
      title: '公告/留言',
      access: ['admin/Announce/index', 'admin/AnnounceType/index', 'admin/Message/msgReceive', 'admin/Message/msgSend']
    },
    component: Main,
    children: [
      {
        path: 'announce',
        name: 'announce_list',
        meta: {
          icon: 'md-megaphone',
          title: '公告管理',
          access: 'admin/Announce/index'
        },
        component: () => import('@/view/announce/list.vue')
      },
      {
        path: 'announceType',
        name: 'announce_type',
        meta: {
          icon: 'md-list',
          title: '公告类别',
          access: 'admin/AnnounceType/index'
        },
        component: () => import('@/view/announce/type.vue')
      },
      {
        path: 'messageReceive',
        name: 'message_receive',
        meta: {
          icon: 'md-chatboxes',
          title: '留言收件箱',
          access: 'admin/Message/msgReceive'
        },
        component: () => import('@/view/message/receive.vue')
      },
      {
        path: 'MessageSend',
        name: 'msessage_send',
        meta: {
          icon: 'ios-chatbubbles',
          title: '留言发件箱',
          access: 'admin/Message/msgSend'
        },
        component: () => import('@/view/message/send.vue')
      }
    ]
  },
  {
    path: '/interface',
    name: 'interface_setting',
    meta: {
      icon: 'ios-link',
      title: '接口管理',
      access: ['admin/InterfaceList/index', 'admin/InterfaceGroup/index']
    },
    component: Main,
    children: [
      {
        path: 'interfaceGroup',
        name: 'interface_group',
        meta: {
          icon: 'md-archive',
          title: '接口分组',
          access: 'admin/InterfaceGroup/index'
        },
        component: () => import('@/view/interface/group.vue')
      },
      {
        path: 'interfaceList',
        name: 'interface_list',
        meta: {
          icon: 'md-infinite',
          title: '接口列表',
          access: 'admin/InterfaceList/index'
        },
        component: () => import('@/view/interface/list.vue')
      },
      {
        path: 'request/:hash',
        meta: {
          title: '请求参数',
          hideInMenu: true
        },
        name: 'interface_request',
        component: () => import('@/view/interface/request.vue')
      },
      {
        path: 'response/:hash',
        hideInMenu: true,
        meta: {
          hideInMenu: true,
          title: '返回参数'
        },
        name: 'interface_response',
        component: () => import('@/view/interface/response.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/wiki/list',
    name: 'wiki_list',
    meta: {
      title: '文档列表',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/list.vue')
  },
  {
    path: '/wiki/error',
    name: 'wiki_error',
    meta: {
      title: '错误码',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/error-code.vue')
  },
  {
    path: '/wiki/calculation',
    name: 'wiki_calculation',
    meta: {
      title: '算法详解',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/calculation.vue')
  },
  {
    path: '/wiki/login',
    name: 'wiki_login',
    meta: {
      title: '文档登录',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/login.vue')
  }
]

export const appRouter = [...dynamicRouterAdd()]

export const routes = [
  ...otherRouter,
  ...appRouter
]

// 所有上面定义的路由都要写在下面输出
export default routes
