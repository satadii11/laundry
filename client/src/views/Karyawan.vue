<template>
  <div>
    <div class="row mt-4">
      <h1 style="margin-left:12px;">Karyawan</h1>
      <div class="col align-self-center">
        <button class="btn btn-primary" data-toggle="modal" data-target="#form" @click="isEditing = false">
          + Tambah
        </button>
      </div>
    </div>
    <p v-if="this.karyawans.length === 0">Data masih kosong</p>
    <div v-else>
      <input class="form-control" type="text" placeholder="Filter dengan nama" v-model="filter" />
      <table class="table mt-3">
        <thead class="thead-light">
        <tr>
          <th>Nama</th>
          <th>Username</th>
          <th>Handphone</th>
          <th>Tipe</th>
          <th>Aksi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="karyawan in karyawans" :key="karyawan.username">
          <td>{{ karyawan.nama }}</td>
          <td>{{ karyawan.username }}</td>
          <td>{{ karyawan.no_hp }}</td>
          <td>{{ karyawan.tipe }}</td>
          <td>
            <font-awesome-icon icon="edit" data-toggle="modal" data-target="#form"
                               @click="() => onEditClicked(karyawan)"/>
            <font-awesome-icon :style="{ marginLeft: '16px' }" icon="trash-alt" data-toggle="modal"
                               data-target="#delete-confirmation" @click="selectedKaryawan = karyawan"/>
          </td>
        </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination justify-content-end">
          <li class="page-item" :class="currentPage === 1 ? 'disabled' : ''">
            <a class="page-link" aria-label="Previous" @click="currentPage--" href="#">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-if="currentPage - 1 !== 0">
            <a class="page-link" href="#" @click="currentPage--">{{currentPage-1}}</a>
          </li>
          <li class="page-item active">
            <a class="page-link" href="#">{{currentPage}}</a>
          </li>
          <li class="page-item" v-if="currentPage + 1 !== totalPage + 1">
            <a class="page-link" href="#" @click="currentPage++">{{currentPage+1}}</a>
          </li>
          <li class="page-item" v-if="currentPage === 1 && currentPage + 2 <= totalPage">
            <a class="page-link" href="#" @click="currentPage += 2">{{currentPage+2}}</a>
          </li>
          <li class="page-item" :class="currentPage === totalPage ? 'disabled' : ''">
            <a class="page-link" aria-label="Next" @click="currentPage++" href="#">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <modal id="form" :modalTitle="isEditing ? 'Ubah Karyawan' : 'Tambah Karyawan'" positiveButton="Simpan" :onPositiveClicked="onSaveClicked">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" class="form-control" v-model="username" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" class="form-control" v-model="password" placeholder="Password" type="password">
      </div>
      <div class="form-group">
        <label for="nama">Nama</label>
        <input id="nama" class="form-control" v-model="nama" placeholder="Nama">
      </div>
      <div class="form-group">
        <label for="hp">Handphone</label>
        <input id="hp" class="form-control" v-model="no_hp" placeholder="Handphone" type="number">
      </div>
    </modal>

    <modal id="delete-confirmation" modalTitle="Hapus Karyawan" positiveButton="Yakin"
           :onPositiveClicked="onDeleteClicked">
      Apakah anda yakin untuk mengahapus karyawan {{ selectedKaryawan ? selectedKaryawan.nama : ''}}?
    </modal>
  </div>
</template>

<script>
  import Modal from '../components/Modal'
  import server from '../services/server'

  export default {
    name: 'karyawan',
    components: {
      modal: Modal
    },
    methods: {
      onEditClicked(karyawan) {
        this.username = karyawan.username
        this.no_hp = karyawan.no_hp
        this.nama = karyawan.nama
        this.selectedKaryawan = karyawan
        this.isEditing = true
      },

      onDeleteClicked() {
        server.delete(`/karyawan/${this.selectedKaryawan.username}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(() => this.onDeleted())
          .catch(err => console.log(err))
      },

      onSaveClicked() {
        if (this.username === '' || this.password === '' || this.nama === '' || this.no_hp === '') {
          alert('Pastikan tidak ada field yang kosong')
          return
        } else if (this.password.length < 8) {
          alert('Gunakan password yang kuat, minimal 8 karakter')
          return
        } else if (this.no_hp.length < 11) {
          alert('Apakah nomer handphone yang dimasukkan sudah benar?')
          return
        }

        const data = {
          username: this.username,
          password: this.password,
          nama: this.nama,
          no_hp: this.no_hp
        };
        const headers = {
          headers: {
            token: localStorage.token
          }
        }

        let promise = null
        if (!this.isEditing) promise = server.post('/karyawan', data, headers)
        else promise = server.put(`/karyawan/${this.selectedKaryawan.username}`, data, headers)
        promise
          .then(res => this.onDataSaved())
          .catch(err => console.log(err))
      },

      onDataSaved() {
        $('#form').modal('toggle')
        this.$router.go(0)
        this.reset()
      },

      onDeleted() {
        $('#delete-confirmation').modal('toggle')
        this.$router.go(0)
      },

      request() {
        server.get(`/karyawan?page=${this.currentPage}&filter=${this.filter}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(res => this.render(res.data.data, res.data.totalPage))
          .catch(err => console.log(err))
      },

      reset() {
        this.username = ''
        this.password = ''
        this.nama = ''
        this.no_hp = ''
      },

      render(data, totalPage) {
        this.karyawans = data
        this.totalPage = totalPage
      }
    },
    data() {
      return {
        karyawans: [],
        totalPage: 0,
        currentPage: 1,
        username: '',
        password: '',
        nama: '',
        no_hp: '',
        filter: '',
        isEditing: false,
        selectedKaryawan: null
      }
    },
    mounted() {
      this.request()
    },
    watch: {
      currentPage: 'request',
      filter: 'request'
    }
  }
</script>
