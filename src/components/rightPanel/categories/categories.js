import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'categories',
    components: {},
    data() {
      return {
        componentKey: 0,
        loading: false,
        categories: [],
        columnsCategories: [
          {prop: 'nombre', label: 'Nombre', width: 'auto'},
        ],
        categoriesPages: 1,
        pageSizes: [12, 15, 50, 100],
        pageSize: null,
        editCategoryForm: {
          id: null,
          nombre: "",
          rules: {
            nombre: [
              {
                required: true,
                message: "Debe elegir un nombre para la categoría",
                trigger: 'blur',
              },
            ],
          },
        },
        dialogEditCategoryVisible: false,
        editCategoryTitle: "Editar Categoría",
        newCategoryTitle: "Nueva Categoría",
        newCategoryForm: {
          nombre: "",
          rules: {
            nombre: [
              {
                required: true,
                message: "Debe elegir un nombre para la categoría",
                trigger: 'blur',
              },
            ],
          },
        },
        dialogNewCategoryVisible: false,
      }
    },
    computed: {
      currentCategoriesView() {
        return this.searchCategoriesBar.slice(
          (this.categoriesPages - 1) * this.pageSize,
          this.categoriesPages * this.pageSize
        );
      },
  
      searchCategoriesBar() {
        return this.categories
      },
    },
    mounted() {},
    created() {
      this.pageSize = this.pageSizes[0];
      this.getCategories();
    },
    methods: {

      async getCategories() {
        this.loading = true;
          try {
              const chunkUrl = process.env.VUE_APP_URL + 'categorias';
              this.categories = await APIHandler.get(chunkUrl);
          } catch (error) {
              exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
          } finally {
              this.loading = false;
          }
      },

      editCategory(row) {
        this.editCategoryForm.id = row.id;
        this.editCategoryForm.nombre = row.nombre;

        this.dialogEditCategoryVisible = true;
      },
  
      async submitEditCategory() {
        this.$refs.editCategoryForm.validate(async (validate) => {
          if (validate) {
            try {
              let id =  this.editCategoryForm.id;
              const chunkUrl = process.env.VUE_APP_URL + 'categorias/' + id;
              await APIHandler.update(chunkUrl, this.editCategoryForm);
              this.$message({
                type: 'success',
                message: "La categoría fue modificada con exito",
              });
              this.dialogEditCategoryVisible = false;
  
              await this.updateCategoriesRowTable();
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo modificar la categoría", error);
            }
          } else {
            return false;
          }
        });
      },

      async deleteCategory(row) {
        await this.$confirm(
          `¿Desea eliminar la categoría?`,
          '¡Cuidado!',
          {
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            type: 'warning',
          }
        )
        .then(async () => {
          let id = row.id;
          let url = process.env.VUE_APP_URL + 'categorias/' + id;
  
          await APIHandler.remove(url);
          this.$message.success({
            type: 'success',
            message: "La categoría ha sido eliminada con exito",
          });
          this.updateCategoriesRowTable();
        })
        .catch((error) => {
          exceptionHandler.exceptionWarning("Error al eliminar la categoría", error);
        });
      },
  
      cancelEditCategory() {
        this.dialogEditCategoryVisible = false;
        this.editCategoryForm = {
          id: "",
          nombre: '',
        };
      },

      async updateCategoriesRowTable() {
        await this.getCategories();
      },

      async submitNewCategory() {
        this.$refs.newCategoryForm.validate(async (validate) => {
          if (validate) {
            try {
              const chunkUrl = process.env.VUE_APP_URL + 'categorias';
              let form = this.newCategoryForm;
              delete form["rules"];
              await APIHandler.create(chunkUrl, form);
              this.$message({
                type: 'success',
                message: "La categoría fue creada con exito",
              });
              this.dialogNewCategoryVisible = false;
              this.newCategoryForm.nombre = "";
  
              await this.updateCategoriesRowTable();
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo crear la categoría", error);
            }
          } else {
            return false;
          }
        });
      },

      cancelNewCategory() {
        this.dialogNewCategoryVisible = false;
        this.newCategoryForm.nombre = "";
      },

    },
  };
  