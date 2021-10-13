import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'productsToBuy',
    components: {},
    data() {
      return {
        componentKey: 0,
        currentId: this.$route.params.id,
        loading: false,
        productsToBuy: [],
        columnsProductsToBuy: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: '100'},
          {prop: 'stock', label: 'Stock', width: '80'},
          {prop: 'nuevo', label: 'Nuevo', width: '85'},
          {prop: 'tipo_categoria', label: 'Categoria', width: 'auto'},
          {prop: 'nombre_vendedor', label: 'Vendedor', width: 'auto'},
        ],
        productsToBuyPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
        dialogbuyProductVisible: false,
        productForm: {
          id_usuario_comprador: this.$route.params.id,
          id_producto: '',
          nombre: '',
          cantidad: 1,
        },
        cantidadDisponible: [],
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

      forceRerender() { 
        this.componentKey += 1; 
      },

      async getProductsToBuy() {
        this.loading = true;
          try {
              const chunkUrl = process.env.VUE_APP_URL + 'productosConStock';
              this.productsToBuy = await APIHandler.get(chunkUrl);
              //Revisar si se puede hacer de otra forma
              for (var i = 0; i < this.productsToBuy.length; i++) {
                this.productsToBuy[i]["precio"] = "$ " + this.productsToBuy[i]["precio"];
                if (this.productsToBuy[i]["nuevo"]) {
                  this.productsToBuy[i]["nuevo"] = "Si";
                } else {
                  this.productsToBuy[i]["nuevo"] = "No";
                }
              }
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              this.forceRerender();
              this.loading = false;
          }
      },

      buyProduct(product) {
        this.dialogbuyProductVisible = true;
        this.productForm.id_producto = product.id;
        this.productForm.nombre = product.nombre;
        this.cantidadDisponible = [];
        let cantidad = product.stock;
        for (var i = 1; i <= cantidad; i++) {
          let data = [
            {
              key: i,
              label: i
            }
          ]
          this.cantidadDisponible = this.cantidadDisponible.concat(data);
        }
      },

      cancelBuyProduct() {
        this.dialogbuyProductVisible = false;
        this.productForm = {
          id_usuario_comprador: this.$route.params.id,
          id_producto: '',
          nombre: '',
          cantidad: 1,
        };
      },

      submitBuyProduct() {
        this.$refs.productForm.validate(async (validate) => {
          if (validate) {
            try {
              const chunkUrl = process.env.VUE_APP_URL + 'eventos';
              let product = {
                id_usuario_comprador: this.productForm.id_usuario_comprador,
                id_producto: this.productForm.id_producto,
                cantidad: this.productForm.cantidad,
              };
              await APIHandler.create(chunkUrl, product);
              this.$message({
                type: 'success',
                message: "El producto fue comprado con exito",
              });
              this.dialogbuyProductVisible = false;
  
              await this.updateProductsRowTable();
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo comprar el producto", error);
            }
          } else {
            return false;
          }
        });
      },

      async updateProductsRowTable() {
        await this.getProductsToBuy();
      },

    },
  };
  