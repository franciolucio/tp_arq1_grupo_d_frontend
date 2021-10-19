import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'productsToSell',
    components: {},
    data() {
      return {
        componentKey: 0,
        currentId: this.$route.params.id,
        loading: false,
        productsToSell: [],
        columnsProductsToSell: [
          {prop: 'id', label: 'ID', width: '75'},
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
          {prop: 'descripcion', label: 'Descripcion', width: 'auto'},
          {prop: 'precio', label: 'Precio', width: '100'},
          {prop: 'stock', label: 'Stock', width: '80'},
          {prop: 'nuevo', label: 'Nuevo', width: '85'},
          {prop: 'tipo_categoria', label: 'Categoria', width: 'auto'}
        ],
        productsToSellPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
        dialogNewProductVisible: false,
        newProductTitle: "Nuevo Producto",
        createProductForm: {
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          nuevo: true,
          id_categoria: "",
          id_vendedor: this.$route.params.id,
        },
        dialogEditProductVisible: false,
        editProductTitle: "Editar Producto",
        editProductForm: {
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          nuevo: true,
          id_categoria: "",
          id_vendedor: this.$route.params.id,
          rules: {
            nombre: [
              {
                required: true,
                message: "Debe elegir un nombre",
                trigger: 'blur',
              },
            ],
            descripcion: [
              {
                required: true,
                message: "Debe elegir una descripción",
                trigger: 'blur',
              },
            ],
            precio: [
              {
                required: true,
                message: "Debe elegir un precio",
                trigger: 'blur',
              },
            ],
            stock: [
              {
                required: true,
                message: "Debe elegir un stock",
                trigger: 'blur',
              },
            ],
            nuevo: [
              {
                required: true,
                message: "Debe elegir si es nuevo",
                trigger: 'blur',
              },
            ],
            categoria: [
              {
                required: true,
                message: "Debe elegir una categoría",
                trigger: 'blur',
              },
            ],
          },
        },
        categories: [],
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
      this.getCategories();
      
    },
    methods: {

      forceRerender() { 
        this.componentKey += 1; 
      },

      async getProductsToSell() {
        this.loading = true;
          try {
              let id = this.currentId;
              const chunkUrl = process.env.VUE_APP_URL + 'productosDelVendedor/' + id;
              this.productsToSell = await APIHandler.get(chunkUrl);
              //Revisar si se puede hacer de otra forma
              for (var i = 0; i < this.productsToSell.length; i++) {
                this.productsToSell[i]["precio"] = "$ " + this.productsToSell[i]["precio"];
                if (this.productsToSell[i]["nuevo"]) {
                  this.productsToSell[i]["nuevo"] = "Si";
                } else {
                  this.productsToSell[i]["nuevo"] = "No";
                }
              }
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              this.forceRerender();
              this.loading = false;
          }
      },

      cancelCreateProduct() {
        this.dialogNewProductVisible = false;
        this.createProductForm = {
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          nuevo: true,
          id_categoria: "",
          id_vendedor: this.$route.params.id,
        };
      },
  
      async submitNewProduct() {
        this.$refs.createProductForm.validate(async (validate) => {
          if (validate) {
            try {
              const chunkUrl = process.env.VUE_APP_URL + 'productos';
              await APIHandler.create(chunkUrl, this.createProductForm);
              this.$message({
                type: 'success',
                message: "El producto fue creado con exito",
              });
              this.dialogNewProductVisible = false;
  
              await this.updateProductsRowTable();
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo crear el producto", error);
            }
          } else {
            return false;
          }
        });
      },

      async updateProductsRowTable() {
        await this.getProductsToSell();
      },

      async getCategories() {
        let chunkUrl = process.env.VUE_APP_URL + "categorias";
        let categoriesAux = await APIHandler.get(chunkUrl);
        for (var i1 = 0; i1 < categoriesAux.length; i1++) {
          let data = [
            {
              key: categoriesAux[i1]['id'],
              label: categoriesAux[i1]['nombre']
            }
          ]
          this.categories = this.categories.concat(data);
        }
      },

      editProduct(row) {
        this.editProductForm.nombre = row.nombre;
        this.editProductForm.descripcion = row.descripcion;
        this.editProductForm.precio = row.precio;
        this.editProductForm.stock = row.stock;
        this.editProductForm.nuevo = row.nuevo;
        this.editProductForm.id_categoria = row.id_categoria;
  
        this.dialogEditProductVisible = true;
      },
  
      async submitEditProduct() {
        this.$refs.editProductForm.validate(async (validate) => {
          if (validate) {
            try {
              const chunkUrl = process.env.VUE_APP_URL + 'productos';
              await APIHandler.update(chunkUrl, this.editProductForm);
              this.$message({
                type: 'success',
                message: "El producto fue modificado con exito",
              });
              this.dialogEditProductVisible = false;
  
              await this.updateProductsRowTable();
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo modificar el producto", error);
            }
          } else {
            return false;
          }
        });
      },
  
      async deleteProduct(row) {
        await this.$confirm(
          `¿Desea eliminar el producto ${row.nombre}?`,
          '¡Cuidado!',
          {
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            type: 'warning',
          }
        )
        .then(async () => {
          let id = row.id;
          let url = process.env.VUE_APP_URL + 'productos/' + id;
  
          await APIHandler.remove(url);
          this.$message.success({
            type: 'success',
            message: "El producto ha sido eliminado con exito",
          });
          this.updateProductsRowTable();
        })
        .catch((error) => {
          exceptionHandler.exceptionWarning("Error al eliminar el producto", error);
        });
      },
  
      cancelEditProduct() {
        this.dialogEditProductVisible = false;
        this.editProductForm = {
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          nuevo: true,
          id_categoria: "",
          id_vendedor: this.$route.params.id,
        };
      },

    },
  };
  