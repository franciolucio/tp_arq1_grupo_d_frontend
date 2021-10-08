import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'soldProducts',
    components: {},
    data() {
      return {
        loading: false,
        soldProducts: [],
        columnsSoldProducts: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: 'auto'},
          {prop: 'stock', label: 'Stock', width: 'auto'},
          {prop: 'nuevo', label: 'Nuevo', width: 'auto'},
          {prop: 'id_categoria', label: 'Categoria', width: 'auto'}
        ],
        soldProductsPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
      }
    },
    computed: {
      currentSoldProductsView() {
        return this.searchsSoldProductsBar.slice(
          (this.soldProductsPages - 1) * this.pageSize,
          this.soldProductsPages * this.pageSize
        );
      },
  
      searchsSoldProductsBar() {
        return this.soldProducts
      },
    },
    mounted() {},
    created() {
      this.pageSize = this.pageSizes[0];
      this.getSoldProducts();
    },
    methods: {

      async getSoldProducts() {
        this.loading = true;
          try {
              let id = 'idVendedor';
              const chunkUrl = process.env.VUE_APP_URL + 'productosVendidosPorVendedor/' + id;
              this.soldProducts = await APIHandler.get(chunkUrl);
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
              this.loading = false;
          }
      },
    },
  };
  