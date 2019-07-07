<template>
  <div id="app">
    <router-view v-if="!hasLogin" />
    <div v-else>
      <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <router-link class="navbar-brand col-md-2 mr-0" :to="'karyawan'">Laundry</router-link>
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <router-link class="nav-link" :to="'logout'">Sign out</router-link>
          </li>
        </ul>
      </nav>
      <div class="container-fluid">
        <div class="row">
          <nav class="col-md-2 bg-light sidebar">
            <div class="sidebar-sticky">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <router-link class="nav-link" :to="'dashboard'" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Dashboard
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" :to="'nota'" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    Nota
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" :to="'pelanggan'" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Pelanggan
                  </router-link>
                </li>
                <li class="nav-item" v-if="tipe === 'Admin'">
                  <router-link class="nav-link" :to="'karyawan'" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Karyawan
                  </router-link>
                <li class="nav-item">
                  <router-link class="nav-link" :to="'kategori'" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    Kategori
                  </router-link>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" class="col-md-10 ml-md-auto px-4">
            <router-view />        
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeUpdate() {
    this.hasLogin = localStorage.token
    this.tipe = localStorage.tipe
  },
  data() {
    return {
      hasLogin: localStorage.token,
      tipe: localStorage.tipe
    }
  }
}
</script>

