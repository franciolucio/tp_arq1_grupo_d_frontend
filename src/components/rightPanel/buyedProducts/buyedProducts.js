import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'buyedProducts',
    components: {},
    data() {
      return {
        loading: false,
        buyedProducts: [],
        columnsBuyedProducts: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: 'auto'},
          {prop: 'stock', label: 'Stock', width: 'auto'},
          {prop: 'id_vendedor', label: 'Vendedor', width: 'auto'},
          {prop: 'nuevo', label: 'Nuevo', width: 'auto'},
          {prop: 'id_categoria', label: 'Categoria', width: 'auto'}
        ],
        buyedProductsPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
      }
    },
    computed: {
      currentBuyedProductsView() {
        return this.searchBuyedProductsBar.slice(
          (this.buyedProductsPages - 1) * this.pageSize,
          this.buyedProductsPages * this.pageSize
        );
      },
  
      searchBuyedProductsBar() {
        return this.buyedProducts
      },
    },
    mounted() {},
    created() {
      this.pageSize = this.pageSizes[0];
      this.getBuyedProducts();
    },
    methods: {

      async getBuyedProducts() {
        this.loading = true;
          try {
            let id = 'idUsuario';
              const chunkUrl = process.env.VUE_APP_URL + 'productosCompradosPorUsuario/' + id;
              this.buyedProducts = await APIHandler.get(chunkUrl);
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
              this.loading = false;
          }
      },
    },
  };