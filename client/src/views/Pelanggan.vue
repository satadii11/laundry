<template>
  <div>
    <div class="row mt-4">
      <h1 style="margin-left:12px;">Pelanggan</h1>
      <div class="col align-self-center">
        <button class="btn btn-primary" data-toggle="modal" data-target="#form" @click="isEditing = false">
          + Tambah
        </button>
      </div>
    </div>
    <p v-if="this.pelanggans.length === 0">Data masih kosong</p>
    <div v-else>
      <input class="form-control" type="text" placeholder="Filter dengan nama" v-model="filter" />
      <table class="table mt-3">
        <thead class="thead-light">
        <tr>
          <th>Nama</th>
          <th>Handphone</th>
          <th>Aksi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="pelanggan in pelanggans" :key="pelanggan.username">
          <td>{{ pelanggan.nama_pelanggan }}</td>
          <td>{{ pelanggan.no_hp }}</td>
          <td>
            <font-awesome-icon icon="edit" data-toggle="modal" data-target="#form"
                               @click="() => onEditClicked(pelanggan)"/>
            <font-awesome-icon :style="{ marginLeft: '16px' }" icon="trash-alt" data-toggle="modal"
                               data-target="#delete-confirmation" @click="selectedPelanggan = pelanggan"/>
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

    <modal id="form" :modalTitle="isEditing ? 'Ubah Pelanggan' : 'Tambah Pelanggan'" positiveButton="Simpan"
           :onPositiveClicked="onSaveClicked">
      <div class="form-group">
        <label for="nama">Nama</label>
        <input id="nama" class="form-control" v-model="nama" placeholder="Nama">
      </div>
      <div class="form-group">
        <label for="hp">Handphone</label>
        <input id="hp" class="form-control" v-model="no_hp" placeholder="Handphone" type="number">
      </div>
    </modal>

    <modal id="delete-confirmation" modalTitle="Hapus Pelanggan" positiveButton="Yakin"
           :onPositiveClicked="onDeleteClicked">
      Apakah anda yakin untuk mengahapus pelanggan {{ selectedPelanggan ? selectedPelanggan.nama_pelanggan : '' }}?
    </modal>
  </div>
</template>

<script>
  import Modal from '../components/Modal'
  import server from '../services/server'

  export default {
    name: 'pelanggan',
    components: {
      modal: Modal
    },
    methods: {
      onEditClicked(pelanggan) {
        this.no_hp = pelanggan.no_hp
        this.nama = pelanggan.nama_pelanggan
        this.isEditing = true
        this.selectedPelanggan = pelanggan
      },

      onDeleteClicked() {
        server.delete(`/pelanggan/${this.selectedPelanggan.id_pelanggan}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(() => this.onDeleted())
          .catch(err => console.log(err))
      },

      onSaveClicked() {
        if (this.nama === '' || this.no_hp === '') {
          alert('Pastikan tidak ada field yang kosong')
          return
        } else if (this.no_hp.length < 11) {
          alert('Apakah nomer handphone yang dimasukkan sudah benar?')
          return
        }

        const data = {
          nama_pelanggan: this.nama,
          no_hp: this.no_hp
        };
        const headers = {
          headers: {
            token: localStorage.token
          }
        }

        let promise = null
        if (!this.isEditing) promise = server.post('/pelanggan', data, headers)
        else promise = server.put(`/pelanggan/${this.selectedPelanggan.id_pelanggan}`, data, headers)
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
        server.get(`/pelanggan?page=${this.currentPage}&filter=${this.filter}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(res => this.render(res.data.data, res.data.totalPage))
          .catch(err => console.log(err))
      },

      reset() {
        this.nama = ''
        this.no_hp = ''
      },

      render(data, totalPage) {
        this.pelanggans = data
        this.totalPage = totalPage
      }
    },
    data() {
      return {
        pelanggans: [],
        totalPage: 0,
        currentPage: 1,
        filter: '',
        nama: '',
        no_hp: '',
        isEditing: false,
        selectedPelanggan: null
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
