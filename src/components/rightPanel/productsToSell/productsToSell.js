import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'productsToSell',
    components: {},
    data() {
      return {
        loading: false,
        productsToSell: [],
        columnsProductsToSell: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: 'auto'},
          {prop: 'stock', label: 'Stock', width: 'auto'},
          {prop: 'nuevo', label: 'Nuevo', width: 'auto'},
          {prop: 'id_categoria', label: 'Categoria', width: 'auto'}
        ],
        productsToSellPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
      }
    },
    computed: {
      currentProductsToSellView() {
        return this.searchProductsToSellBar.slice(
          (this.productsToSellPages - 1) * this.pageSize,
          this.productsToSellPages * this.pageSize
        );
      },
  
      searchProductsToSellBar() {
        return this.productsToSell
      },
    },
    mounted() {},
    created() {
      this.pageSize = this.pageSizes[0];
      this.getProductsToSell();
    },
    methods: {

      async getProductsToSell() {
        this.loading = true;
          try {
              let id = 'idVendedor';
              const chunkUrl = process.env.VUE_APP_URL + 'productosDelVendedor/' + id;
              this.productsToSell = await APIHandler.get(chunkUrl);
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
              this.loading = false;
          }
      },
    },
  };
  