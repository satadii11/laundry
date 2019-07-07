import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/karyawan',
      name: 'karyawan',
      component: () => import('./views/Karyawan.vue'),
      meta: {
        requireAuth: true,
        requireAdmin: true
      }
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: () => import('./views/Kategori.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/nota',
      name: 'nota',
      component: () => import('./views/Nota.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/pelanggan',
      name: 'pelanggan',
      component: () => import('./views/Pelanggan.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('./components/Logout.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: {
        guest: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requireAuth)) {
    if (to.matched.some(route => route.meta.requireAdmin)) {
      if (localStorage.tipe !== 'Admin') {
        next({
          name: 'dashboard',
          params: {nextUrl: to.fullPath}
        })
      } else {
        next()
      }
    } else if (!localStorage.getItem('token')) {
      next({
        name: 'login',
        params: {nextUrl: to.fullPath}
      })
    } else {
      next()
    }
  } else if (to.matched.some(route => route.meta.guest)) {
    if (localStorage.getItem('token')) {
      next(from.fullPath)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
