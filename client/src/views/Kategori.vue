<template>
  <div>
    <div class="row mt-4">
      <h1 style="margin-left:12px;">Kategori</h1>
      <div class="col align-self-center">
        <button class="btn btn-primary" data-toggle="modal" data-target="#form" @click="isEditing = false">
          + Tambah
        </button>
      </div>
    </div>
    <p v-if="this.kategoris.length === 0">Data masih kosong</p>
    <div v-else>
      <input class="form-control" type="text" placeholder="Filter dengan nama" v-model="filter"/>
      <table class="table mt-3">
        <thead class="thead-light">
        <tr>
          <th>Nama</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="kategori in kategoris" :key="kategori.username">
          <td>{{ kategori.nama_kategori }}</td>
          <td class="text-right">{{ formatRp(kategori.harga_kategori) }}</td>
          <td>
            <font-awesome-icon icon="edit" data-toggle="modal" data-target="#form"
                               @click="() => onEditClicked(kategori)"/>
            <font-awesome-icon :style="{ marginLeft: '16px' }" icon="trash-alt" data-toggle="modal"
                               data-target="#delete-confirmation" @click="selectedKategori = kategori"/>
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

    <modal id="form" :modalTitle="isEditing ? 'Ubah Kategori' : 'Tambah Kategori'" positiveButton="Simpan"
           :onPositiveClicked="onSaveClicked">
      <div class="form-group">
        <label for="nama_kategori">Nama</label>
        <input id="nama_kategori" class="form-control" v-model="nama_kategori" placeholder="Nama">
      </div>
      <div class="form-group">
        <label for="harga">Harga</label>
        <input id="harga" class="form-control" v-model="harga_kategori" placeholder="Harga" type="number">
      </div>
    </modal>

    <modal id="delete-confirmation" modalTitle="Hapus Kategori" positiveButton="Yakin"
           :onPositiveClicked="onDeleteClicked">
      Apakah anda yakin untuk mengahapus kategori {{ selectedKategori ? selectedKategori.nama_kategori : '' }}?
    </modal>
  </div>
</template>

<script>
  import Modal from '../components/Modal'
  import server from '../services/server'

  export default {
    name: 'kategori',
    components: {
      modal: Modal
    },
    methods: {
      onEditClicked(kategori) {
        this.harga_kategori = kategori.harga_kategori
        this.nama_kategori = kategori.nama_kategori
        this.isEditing = true
        this.selectedKategori = kategori
      },

      onDeleteClicked() {
        server.delete(`/kategori/${this.selectedKategori.id_kategori}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(() => this.onDeleted())
          .catch(err => console.log(err))
      },

      onSaveClicked() {
        if (this.nama_kategori === '' || this.harga_kategori === '') {
          alert('Pastikan tidak ada field yang kosong')
          return
        }

        const data = {
          nama_kategori: this.nama_kategori,
          harga_kategori: this.harga_kategori
        };
        const headers = {
          headers: {
            token: localStorage.token
          }
        }

        let promise = null
        if (!this.isEditing) promise = server.post('/kategori', data, headers)
        else promise = server.put(`/kategori/${this.selectedKategori.id_kategori}`, data, headers)
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
        server.get(`/kategori?page=${this.currentPage}&filter=${this.filter}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(res => this.render(res.data.data, res.data.totalPage))
          .catch(err => console.log(err))
      },

      reset() {
        this.nama_kategori = ''
        this.harga_kategori = ''
      },

      render(data, totalPage) {
        this.kategoris = data
        this.totalPage = totalPage
      },

      formatRp(number) {
        return this.numberFormatter.format(number);
      }
    },
    data() {
      return {
        kategoris: [],
        totalPage: 0,
        currentPage: 1,
        filter: '',
        nama_kategori: '',
        harga_kategori: '',
        isEditing: false,
        selectedKategori: null,
        numberFormatter: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
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
