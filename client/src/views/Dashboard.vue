<template>
  <div>
    <div class="row mt-4">
      <div class="col">
        <select class="form-control" v-model="activeYear">
          <option :value="year">Tahun ini</option>
          <option :value="year - 1">1 Tahun lalu</option>
          <option :value="year - 2">2 Tahun lalu</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-6">
        <GChart
          type="LineChart"
          :options="incomeLineOption"
          :data="incomeLineData"/>
      </div>

      <div class="col-6">
        <GChart
          type="LineChart"
          :options="orderLineOption"
          :data="orderLineData"/>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col">
        <select class="form-control" v-model="activeMonth">
          <option :value="month">Bulan ini</option>
          <option :value="month - 1">1 Bulan lalu</option>
          <option :value="month - 2">2 Bulan lalu</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-6 offset-3">
        <GChart
          type="PieChart"
          :options="categoryPieOption"
          :data="categoryPieData"/>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {GChart} from 'vue-google-charts'
  import server from '../services/server'

  moment.locale('id');

  export default {
    name: 'dashboard',
    components: {
      GChart
    },
    data() {
      const now = moment();
      const defaultYear = now.format("YYYY");
      const defaultMonth = now.format("MM");
      return {
        year: defaultYear,
        activeYear: defaultYear,
        month: defaultMonth,
        activeMonth: defaultMonth,
        categoryPieData: [],
        incomeLineData: [],
        orderLineData: [],
      }
    },
    computed: {
      orderLineOption() {
        return {
          title: `Pemesanan Selama Tahun ${this.activeYear}`,
          legend: {
            position: 'bottom'
          }
        };
      },

      incomeLineOption() {
        return {
          title: `Pendapatan Selama Tahun ${this.activeYear}`,
          legend: {
            position: 'bottom'
          }
        };
      },

      categoryPieOption() {
        return {
          title: `Tren Kategori ${moment(this.activeMonth, 'M').format('MMMM')} ${this.activeYear}`
        };
      }
    },
    methods: {
      async request() {
        const headers = {
          headers: {token: localStorage.token}
        };
        const orders = await server.get(`/nota/report/order/${this.activeYear}`, headers);
        const categories = await server.get(`/nota/report/category/${this.activeYear}/${this.activeMonth}`, headers);
        const income = await server.get(`/nota/report/income/${this.activeYear}`, headers);
        const result = orders + categories + income;
        this.orderLineData = orders.data.data;
        this.categoryPieData = categories.data.data;
        this.incomeLineData = income.data.data;
      }
    },
    watch: {
      activeYear: 'request',
      activeMonth: 'request'
    },
    async mounted() {
      await this.request();
    }
  }
</script>
