import Vue from 'vue'
import Router from 'vue-router'
import layOut from '@/modules/layout/layout.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/list',
      component: layOut,
      children: [
        {
          // 首页
          path: '/list',
          name: 'list',
          component: resolve => require(['@/views/list/index'], resolve)
        },
        {
          // K线
          path: '/kline',
          name: 'kline',
          component: resolve => require(['@/views/kline/index'], resolve)
        }

      ]
    }
  ]
})
