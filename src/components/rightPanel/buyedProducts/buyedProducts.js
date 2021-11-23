import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'buyedProducts',
    components: {},
    data() {
      return {
        currentId: this.$route.params.id,
        loading: false,
        buyedProducts: [],
        columnsBuyedProducts: [
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: '100'},
          {prop: 'cantidad', label: 'Cantidad', width: '100'},
          {prop: 'nuevo', label: 'Nuevo', width: '85'},
          {prop: 'tipo_categoria', label: 'Categoria', width: 'auto'},
          {prop: 'nombre_vendedor', label: 'Vendedor', width: 'auto'},
          {prop: 'fecha_compra', label: 'Fecha', width: 'auto'},
        ],
        buyedProductsPages: 1,
        pageSizes: [10, 25, 50, 100],
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
            let id = this.currentId;
              const chunkUrl = process.env.VUE_APP_URL + 'productosCompradosPorUsuario/' + id;
              this.buyedProducts = await APIHandler.get(chunkUrl);
              //Revisar si se puede hacer de otra forma
              for (var i = 0; i < this.buyedProducts.length; i++) {
                this.buyedProducts[i]["precio"] = "$ " + this.buyedProducts[i]["precio"];
                if (this.buyedProducts[i]["nuevo"]) {
                  this.buyedProducts[i]["nuevo"] = "Si";
                } else {
                  this.buyedProducts[i]["nuevo"] = "No";
                }
              }
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {              
              this.loading = false;
          }
      },
    },
  };