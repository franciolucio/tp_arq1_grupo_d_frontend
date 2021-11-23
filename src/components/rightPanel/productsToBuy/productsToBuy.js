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
        search: "",
        quitFilterShow: false,
        dialogFilterVisible: false,
        maxPrice: 0,
        filterTypes: [
          { key: 0, label: 'Mayor que..' },
          { key: 1, label: 'Menor que..' },
          { key: 2, label: 'En un rango' },
        ],
        filterForm: {
          filter_type: "",
          price: 0,
          rangeFrom: 0,
          rangeTo: 0,
          rules: {
            filter_type: [
              {
                required: true,
                message: "Debe elegir un tipo de filtro",
                trigger: 'blur',
              },
            ],
            price: [
              {
                required: true,
                message: "Debe elegir un precio (campo numérico)",
                pattern: /^[0-9]+/,
                trigger: 'blur',
              },
            ],
            rangeFrom: [
              {
                required: true,
                message: "Debe elegir un precio (campo numérico)",
                pattern: /^[0-9]+/,
                trigger: 'blur',
              },
            ],
            rangeTo: [
              {
                required: true,
                message: "Debe elegir un precio (campo numérico)",
                pattern: /^[0-9]+/,
                trigger: 'blur',
              },
            ],
          },
        },
        productsToBuy: [],
        columnsProductsToBuy: [
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: '100'},
          {prop: 'stock', label: 'Stock', width: '80'},
          {prop: 'nuevo', label: 'Nuevo', width: '85'},
          {prop: 'tipo_categoria', label: 'Categoria', width: 'auto'},
          {prop: 'nombre_vendedor', label: 'Vendedor', width: 'auto'},
        ],
        productsToBuyPages: 1,
        pageSizes: [10, 25, 50, 100],
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
        return this.productsToBuy.filter(
          (data) => (
            !this.search ||
            data.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
            data.tipo_categoria.toLowerCase().includes(this.search.toLowerCase())
          )
        );
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

      quitFilter() {
        this.quitFilterShow = false;
        this.getProductsToBuy();
      },

      async filter() {
        this.loading = true;
        this.$refs.filterForm.validate(async (validate) => {
          if (validate) {
            try {
              if (this.filterForm.filter_type == 0) {
                const chunkUrl = process.env.VUE_APP_URL + 'productosMayorA' + '/' + this.filterForm.price;
                this.productsToBuy = await APIHandler.get(chunkUrl);
                this.productFormat()
              } else if (this.filterForm.filter_type == 1) {
                const chunkUrl = process.env.VUE_APP_URL + 'productosMenorA' + '/' + this.filterForm.price;
                this.productsToBuy = await APIHandler.get(chunkUrl);
                this.productFormat()
              } else if (this.filterForm.filter_type == 2) {
                const chunkUrl = process.env.VUE_APP_URL + 'productosEntre' + '/' + this.filterForm.rangeFrom + '/' + this.filterForm.rangeTo;
                this.productsToBuy = await APIHandler.get(chunkUrl);
                this.productFormat()
              } else {
                //LANZAR ERROR
              }

              this.$message({
                type: 'success',
                message: "El filtro fue aplicado con exito",
              });

              this.dialogFilterVisible = false;
              this.quitFilterShow = true;
              
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo aplicar el filtro", error);
            }
          } else {
            return false;
          }
        });
        this.loading = false;
      },

      productFormat() {
        //Revisar si se puede hacer de otra forma
        for (var i = 0; i < this.productsToBuy.length; i++) {
          if (this.productsToBuy[i]["precio"] > this.maxPrice) {
            this.maxPrice = this.productsToBuy[i]["precio"];
          }
          this.productsToBuy[i]["precio"] = "$ " + this.productsToBuy[i]["precio"];
          if (this.productsToBuy[i]["nuevo"]) {
            this.productsToBuy[i]["nuevo"] = "Si";
          } else {
            this.productsToBuy[i]["nuevo"] = "No";
          }
        }
      },

      cancelFilter() {
        this.dialogFilterVisible = false;
        this.filterForm = {
          price: 0,
          range: [0,0],
          tipo_filtro: ""
        };
      },

      async getProductsToBuy() {
        this.loading = true;
        try {
            const chunkUrl = process.env.VUE_APP_URL + 'productosConStock';
            this.productsToBuy = await APIHandler.get(chunkUrl);
            this.productFormat()
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
  