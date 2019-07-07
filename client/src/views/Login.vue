<template>
    <div class="text-center">
        <div class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">Silakan Sign In Dulu</h1>
            <label for="username" 
              class="sr-only">Username</label>
            <input type="text" 
              id="username" 
              class="form-control" 
              placeholder="Username" 
              v-model="username"
              required 
              autofocus />
            <label for="password" 
              class="sr-only">Password</label>
            <input type="password" 
              id="password" 
              class="form-control" 
              placeholder="Password"
              v-model="password"
              required>
            <button class="btn btn-lg btn-primary btn-block" 
              @click="onLoginClicked">Sign in</button>
            <p class="mt-5 mb-3 text-muted">© GoLok Labs 2019</p>
            <div class="alert alert-danger alert-dismissible" role="alert" v-if="showDialog">
              {{ message }}
              <button type="button" 
                class="close" 
                data-dismiss="alert" 
                aria-label="Close" 
                @click="showDialog = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
        </div>
    </div>
</template>

<script>
import server from '../services/server'

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      showDialog: false,
      message: ''
    }
  },
  methods: {
    onLoginSuccess(data, token) {
      localStorage.username = data.username
      localStorage.nama = data.nama
      localStorage.no_hp = data.no_hp
      localStorage.tipe = data.tipe
      localStorage.token = token
      this.$router.push('dashboard')
    },

    onLoginFailed() {
      this.showDialog = true
      this.username = ''
      this.password = ''
      this.message = 'Username atau password salah.'
    },

    loginCallback(response) {
      const status = response.data.status
      if (status === 401 || status === 404) this.onLoginFailed()
      else if (status === 200) this.onLoginSuccess(response.data.data, response.data.token)
    },

    onLoginClicked() {
      if (this.username == '' || this.password == '') {
        this.message = 'Pastikan tidak ada field yang kosong.'
        this.showDialog = true
        return
      }
      server.post('/login', { 
        username: this.username, 
        password: this.password
      })
        .then(this.loginCallback)
        .catch(err => console.log(err))
    }

  }
}
</script>


<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

