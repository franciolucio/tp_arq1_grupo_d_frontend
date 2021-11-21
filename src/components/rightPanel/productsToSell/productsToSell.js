import * as APIHandler from '../../../../utils/APIHandler';
import * as functions from '../../../..//utils/functions';
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
          id: "",
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
                pattern: /^[0-9]+/,
                message: "Debe elegir un precio (campo numérico)",
                trigger: 'blur',
              },
            ],
            stock: [
              {
                required: true,
                pattern: /^[0-9]+/,
                message: "Debe elegir un stock (campo numérico)",
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
        dialogMasiveChargeVisible: false,
        loadingMasive: false,
        loadingTemplate: false,
        logMasiveLoad: '',
        logHeaders: ["Nombre", "Categoría", "Descripción", "Precio", "Stock", "Nuevo", "Ejecución"],
        massiveFile: {},
        fileList: [],
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
        this.editProductForm.id = row.id;
        this.editProductForm.nombre = row.nombre;
        this.editProductForm.descripcion = row.descripcion;
        this.editProductForm.precio = row.precio.substr(2);
        this.editProductForm.stock = row.stock;
        this.editProductForm.nuevo = row.nuevo;
        this.editProductForm.id_categoria = row.id_categoria;
  
        this.dialogEditProductVisible = true;
      },
  
      async submitEditProduct() {
        this.$refs.editProductForm.validate(async (validate) => {
          if (validate) {
            try {
              let id =  this.editProductForm.id;
              const chunkUrl = process.env.VUE_APP_URL + 'productos/' + id;
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
          id: "",
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          nuevo: true,
          id_categoria: "",
          id_vendedor: this.$route.params.id,
        };
      },

      async downloadTemplate() {
        this.loadingTemplate = true;
        let link = document.createElement("a");
        link.download = 'carga_masiva_productos.csv';
        link.href = '../../../../templates/masiveProductTemplate.csv';
        link.click();
        this.loadingTemplate = false;
      },
      
      checkCSV(file) {
        if (file.name) {
          if (!/\.(csv)$/i.test(file.name)) {
            this.$message.error("El archivo tiene que ser en formato csv");
            return false;
          }
        } else {
          this.$message.error("El archivo no se ha podido procesar");
          return false;
        }
      },

      async loadCSVUpload(file) {
        try {
          let fileAux = await functions.readCsv(file.file);
          const headers = fileAux.data[0];
          if (headers.length !== 6) {
            this.logMasiveLoad = '';
            this.massiveFile = {};
            this.fileList = [];
            return this.$message.error("Formato del archivo no válido: Numero de columnas invalido");
          }
          this.massiveFile = fileAux;
        } catch (error) {
          this.$message.error("Fallo al cargar el archivo");
          this.logMasiveLoad = '';
        }
      },

      async executeMassiveCharge() {
        this.logMasiveLoad = 'loading';
        this.loading = true;

        try {
          this.dialogMasiveChargeVisible = false;
          //await (new Promise(resolve => setTimeout(resolve, 5000)));
          let inputData = this.massiveFile.data;
          inputData.shift();
          inputData.pop();
          const params = {
            data: inputData,
          };
          let id =  this.currentId;
          let url = process.env.VUE_APP_URL + 'cargarProductos/' + id;
          let log = await APIHandler.create(url, params);
          await log.unshift(this.logHeaders);
          this.logMasiveLoad = log;
          this.updateProductsRowTable();
          this.$message.success("Archivo cargado correctamente");

        } catch (error) {

          this.$message.error("Fallo al cargar el archivo");
          this.logMasiveLoad = '';
          this.loading = false;
        
        } finally {
          this.forceRerender();
          this.loading = false;
        }
      },

      async cancelMassiveCharge() {
        this.dialogMasiveChargeVisible = false;
        this.logMasiveLoad = '';
        this.fileList = [];
        this.massiveFile = {};
      },

      async downloadLogMasive() {
        functions.downloadArrayAsCSV('logCargaMasivaProductos', this.logMasiveLoad);
      },

      handleRemove() {
        this.fileList = [];
        this.massiveFile = {};
      },

      handlePreview(file) {
        
        this.fileList = [file];
      },

      handleExceed() {
        this.$message.warning("Solo se puede cargar de a un archivo por vez");
      },

    },
  };
  