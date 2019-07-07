<template>
  <div>
    <div class="row mt-4">
      <h1 style="margin-left:12px;">Nota</h1>
      <div class="col align-self-center">
        <button class="btn btn-primary" data-toggle="modal" data-target="#form"
                @click="isEditing = false; id = callMoment()">
          + Tambah
        </button>
      </div>
    </div>
    <p v-if="this.notas.length === 0">Data masih kosong</p>
    <div v-else>
      <input class="form-control" type="text" placeholder="Filter dengan id nota" v-model="filter"/>
      <table class="table mt-3">
        <thead class="thead-light">
        <tr>
          <th>Id</th>
          <th>Pelanggan</th>
          <th>Tgl Masuk</th>
          <th>Tgl Keluar</th>
          <th>Jml</th>
          <th>Kategori</th>
          <th>Total</th>
          <th>Petugas</th>
          <th>Aksi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="nota in notas" :key="nota.username">
          <td>{{ nota.id_nota }}</td>
          <td>{{ nota.pelanggan.nama_pelanggan }}</td>
          <td>{{ nota.tanggal_masuk }}</td>
          <td>{{ nota.tanggal_keluar }}</td>
          <td class="text-right">{{ nota.jml_pakaian }}</td>
          <td>{{ nota.kategori.nama_kategori }}</td>
          <td class="text-right">{{ formatRp(nota.total_harga) }}</td>
          <td>{{ nota.karyawan.nama }}</td>
          <td>
            <font-awesome-icon icon="edit" data-toggle="modal" data-target="#form"
                               @click="() => onEditClicked(nota)"/>
            <font-awesome-icon :style="{ marginLeft: '16px' }" icon="trash-alt" data-toggle="modal"
                               data-target="#delete-confirmation" @click="selectedNota = nota"/>
            <font-awesome-icon :style="{marginLeft: '16px'}" icon="check-square" data-toggle="modal"
                               data-target="#done-confirmation" @click="selectedNota = nota"
                               v-if="!nota.tanggal_keluar" />
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

    <modal id="form" :modalTitle="isEditing ? 'Ubah Nota' : 'Tambah Nota'" positiveButton="Simpan"
           :onPositiveClicked="onSaveClicked">
      <div class="form-group">
        <label for="id_nota">Id Nota</label>
        <input class="form-control" type="text" disabled v-model="id" id="id_nota"/>
      </div>
      <div class="form-group">
        <label>Pelanggan</label>
        <select class="form-control" v-model="pelanggan">
          <option disabled selected value="-1">Pilih pelanggan</option>
          <option :value="item" v-for="item in pelanggans" :key="item.id_pelanggan">
            {{ item.nama_pelanggan }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="jml_pakaian">Jumlah Pakaian</label>
        <input id="jml_pakaian" class="form-control" v-model="jml_pakaian" placeholder="Jumlah Pakaian" type="number">
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <select class="form-control" v-model="kategori">
          <option disabled selected value="-1">Pilih kategori</option>
          <option :value="item" v-for="item in kategoris" :key="item.id_kategori">
            {{ item.nama_kategori }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="total">Total</label>
        <input class="form-control" type="text" disabled v-model="total" id="total"/>
      </div>
    </modal>

    <modal id="delete-confirmation" modalTitle="Konfirmasi Hapus Nota" positiveButton="Yakin"
           :onPositiveClicked="onDeleteClicked">
      Apakah anda yakin untuk mengahapus nota {{ selectedNota ? selectedNota.id_nota : ''}}?
    </modal>

    <modal id="done-confirmation" modalTitle="Konfirmasi Penyelesaian" positiveButton="Yakin"
           :onPositiveClicked="onDoneClicked">
      Konfirmasi untuk menyelesaikan nota {{ selectedNota ? selectedNota.id_nota : ''}}.
    </modal>
  </div>
</template>

<script>
  import moment from 'moment'

  import Modal from '../components/Modal'
  import server from '../services/server'

  export default {
    name: 'nota',
    components: {
      modal: Modal
    },
    methods: {
      async onDoneClicked() {
        try {
          await server.put(`/nota/taken/${this.selectedNota.id_nota}`, null, {
            headers: {token: localStorage.token}
          });
        } catch (err) {
          alert(err.message);
          return;
        }

        this.$router.go(0);
      },

      onEditClicked(nota) {
        this.isEditing = true;
        this.selectedNota = nota
        this.id = nota.id_nota
        this.jml_pakaian = nota.jml_pakaian
        this.pelanggan = nota.pelanggan
        this.kategori = nota.kategori
        this.total = nota.total_harga
      },

      onDeleteClicked() {
        server.delete(`/nota/${this.selectedNota.id_nota}`, {
          headers: {
            token: localStorage.token
          }
        })
          .then(() => this.onDeleted())
          .catch(err => console.log(err))
      },

      onSaveClicked() {
        const data = {
          id_nota: this.id,
          jml_pakaian: this.jml_pakaian,
          id_pelanggan: this.pelanggan.id_pelanggan,
          id_kategori: this.kategori.id_kategori,
          username: localStorage.username,
          total_harga: this.total
        };
        const headers = {
          headers: {
            token: localStorage.token
          }
        };

        let promise = null;
        if (!this.isEditing) promise = server.post('/nota', data, headers);
        else promise = server.put(`/nota/${this.selectedNota.id_nota}`, data, headers);
        promise
          .then(() => this.onDataSaved())
          .catch(err => console.log(err))
      },

      onDataSaved() {
        $('#form').modal('toggle');
        this.$router.go(0);
        this.reset()
      },

      onDeleted() {
        $('#delete-confirmation').modal('toggle');
        this.$router.go(0)
      },

      callMoment() {
        return moment().format('DDMMYYHHmmss')
      },

      async request() {
        const headers = {
          headers: {
            token: localStorage.token
          }
        };

        let notas, pelanggans, kategoris;
        let result = 0;
        try {
          notas = await server.get(`/nota?page=${this.currentPage}&filter=${this.filter}`, headers);
          pelanggans = await server.get('/pelanggan?page=-1&filter=', headers);
          kategoris = await server.get('/kategori?page=-1&filter=', headers);
          result = notas + pelanggans + kategoris
        } catch (err) {
          console.log(err)
        }

        this.render(notas.data.data, notas.data.totalPage);
        this.pelanggans = pelanggans.data.data;
        this.kategoris = kategoris.data.data;
      },

      render(data, totalPage) {
        this.notas = data;
        this.totalPage = totalPage
      },

      calculateTotal() {
        if (this.kategori === -1) this.total = 0
        else this.total = this.jml_pakaian * this.kategori.harga_kategori
      },

      formatRp(number) {
        return this.numberFormatter.format(number);
      }
    },
    data() {
      return {
        notas: [],
        kategoris: [],
        pelanggans: [],
        totalPage: 0,
        currentPage: 1,
        filter: '',
        id: this.callMoment(),
        jml_pakaian: 0,
        total: 0,
        pelanggan: -1,
        kategori: -1,
        isEditing: false,
        selectedNota: null,
        numberFormatter: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
      }
    },
    mounted() {
      this.request()
    },
    watch: {
      currentPage: 'request',
      filter: 'request',
      kategori: 'calculateTotal',
      jml_pakaian: 'calculateTotal'
    }
  }
</script>
