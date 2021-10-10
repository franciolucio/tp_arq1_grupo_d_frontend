import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'soldProducts',
    components: {},
    data() {
      return {
        currentId: this.$route.params.id,
        loading: false,
        soldProducts: [],
        columnsSoldProducts: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: '100'},
          {prop: 'stock', label: 'Stock', width: '75'},
          {prop: 'nuevo', label: 'Nuevo', width: '75'},
          {prop: 'id_categoria', label: 'Categoria', width: '200'}
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
            let id = this.currentId;
              const chunkUrl = process.env.VUE_APP_URL + 'productosVendidosPorVendedor/' + id;
              this.soldProducts = await APIHandler.get(chunkUrl);
              //Revisar si se puede hacer de otra forma
              for (var i = 0; i < this.soldProducts.length; i++) {
                this.soldProducts[i]["precio"] = "$ " + this.soldProducts[i]["precio"];
                if (this.soldProducts[i]["nuevo"]) {
                  this.soldProducts[i]["nuevo"] = "Si";
                } else {
                  this.soldProducts[i]["nuevo"] = "No";
                }
              }
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
              this.loading = false;
          }
      },
    },
  };
  