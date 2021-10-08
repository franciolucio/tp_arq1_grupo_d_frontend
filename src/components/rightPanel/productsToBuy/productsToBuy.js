import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'productsToBuy',
    components: {},
    data() {
      return {
        loading: false,
        productsToBuy: [],
        columnsProductsToBuy: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: 'auto'},
          {prop: 'stock', label: 'Stock', width: 'auto'},
          {prop: 'id_vendedor', label: 'Vendedor', width: 'auto'},
          {prop: 'nuevo', label: 'Nuevo', width: 'auto'},
          {prop: 'id_categoria', label: 'Categoria', width: 'auto'}
        ],
        productsToBuyPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
      }
    },
    computed: {
      currentProductsToBuyView() {
        return this.searchProductsToBuyBar.slice(
          (this.productsToBuyPages - 1) * this.pageSize,
          this.productsToBuyPages * this.pageSize
        );
      },
  
      searchProductsToBuyBar() {
        return this.productsToBuy
      },
    },
    mounted() {},
    created() {
      this.pageSize = this.pageSizes[0];
      this.getProductsToBuy();
    },
    methods: {

      async getProductsToBuy() {
        this.loading = true;
          try {
              const chunkUrl = process.env.VUE_APP_URL + 'productosConStock';
              this.productsToBuy = await APIHandler.get(chunkUrl);
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
              this.loading = false;
          }
      },
    },
  };
  