import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
  name: 'usersData',
  components: {},
  data() {
    return {
      loading: false,
      users: [],
      columnsUsers: [
        {prop: 'id', label: 'ID', width: '75'},
        {prop: 'nombre', label: 'Nombre', width: 'auto'},
        {prop: 'apellido', label: 'Apellido', width: 'auto'},
        {prop: 'email', label: 'Email', width: 'auto'},
      ],
      usersPages: 1,
      sellers: [],
      columnsSellers: [
        {prop: 'id', label: 'ID', width: '75'},
        {prop: 'razon_social', label: 'Razón Social', width: 'auto'},
        {prop: 'email', label: 'Email', width: 'auto'},
      ],
      sellersPages: 1,
      pageSizes: [12, 15, 50, 100],
      pageSize: null,
      activeName: 'first',
      editUserForm: {
        id: null,
        nombre: null,
        apellido: null,
        email: null,
        activo: true,
        rules: {
          nombre: [
            {
              required: true,
              message: "Debe elegir un nombre",
              trigger: 'blur',
            },
          ],
          apellido: [
            {
              required: true,
              message: "Debe elegir un apellido",
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Debe elegir un email con el formato: abc@abc.com",
              trigger: 'blur',
            },
          ],
        },
      },
      dialogEditUserVisible: false,
      editUserTitle: "Editar Usuario",
      editSellerForm: {
        id: null,
        razon_social: null,
        email: null,
        activo: true,
        rules: {
          razon_social: [
            {
              required: true,
              message: "Debe elegir un nombre como razón social",
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Debe elegir un email con el formato: abc@abc.com",
              trigger: 'blur',
            },
          ],
        },
      },
      dialogEditSellerVisible: false,
      editSellerTitle: "Editar Vendedor",
      newUserTitle: "Nuevo Usuario",
      createUserForm: {
        nombre: '',
        apellido: '',
        email: '',
        activo: true,
      },
      dialogNewUserVisible: false,
      newSellerTitle: "Nuevo Vendedor",
      createSellerForm: {
        razon_social: '',
        email: '',
        activo: true,
      },
      dialogNewSellerVisible: false,
    };
  },
  computed: {

    currentSellersView() {
      return this.searchSellersBar.slice(
        (this.sellersPages - 1) * this.pageSize,
        this.sellersPages * this.pageSize
      );
    },

    searchSellersBar() {
      return this.sellers
    },

    currentUsersView() {
      return this.searchUsersBar.slice(
        (this.usersPages - 1) * this.pageSize,
        this.usersPages * this.pageSize
      );
    },

    searchUsersBar() {
      return this.users
    },

  },
  mounted() {},
  created() {
    this.pageSize = this.pageSizes[0];
    this.getUsers();
    this.getSellers();
  },
  methods: {

    async getUsers() {
      this.loading = true;
        try {
            const chunkUrl = process.env.VUE_APP_URL + "usuarios";
            this.users = await APIHandler.get(chunkUrl);
        } catch (error) {
            exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
        } finally {
            await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
            this.loading = false;
        }
    },

    async getSellers() {
      this.loading = true;
        try {
            const chunkUrl = process.env.VUE_APP_URL + "vendedores";
            this.sellers = await APIHandler.get(chunkUrl);
        } catch (error) {
            exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
        } finally {
            this.loading = false;
        }
    },

    editUser(row) {
      this.editUserForm.id = row.id;
      this.editUserForm.nombre = row.nombre;
      this.editUserForm.apellido = row.apellido;
      this.editUserForm.email = row.email;

      this.dialogEditUserVisible = true;
    },

    async submitEditUser() {
      this.$refs.editUserForm.validate(async (validate) => {
        if (validate) {
          try {
            let id = this.editUserForm.id;
            const chunkUrl = process.env.VUE_APP_URL + 'usuarios/' + id;

            await APIHandler.update(chunkUrl, this.editUserForm);
            this.$message({
              type: 'success',
              message: "El usuario fue modificado con exito",
            });
            this.dialogEditUserVisible = false;

            await this.updateUsersRowTable();
          } catch (error) {
            exceptionHandler.exceptionWarning("Error: No se pudo modificar el usuario", error);
          }
        } else {
          return false;
        }
      });
    },

    async deleteUser(row) {
      await this.$confirm(
        `¿Desea eliminar el usuario ${row.nombre} ${row.apellido}?`,
        '¡Cuidado!',
        {
          confirmButtonText: 'SI',
          cancelButtonText: 'NO',
          type: 'warning',
        }
      )
      .then(async () => {
        let id = row.id;
        let url = process.env.VUE_APP_URL + 'usuarios/' + id;

        await APIHandler.remove(url);
        this.$message.success({
          type: 'success',
          message: "El usuario ha sido eliminado con exito",
        });
        this.updateUsersRowTable();
      })
      .catch((error) => {
        exceptionHandler.exceptionWarning("Error al eliminar el usuario", error);
      });
    },

    async updateUsersRowTable() {
      await this.getUsers();
    },

    editSeller(row) {
      this.editSellerForm.id = row.id;
      this.editSellerForm.razon_social = row.razon_social;
      this.editSellerForm.email = row.email;

      this.dialogEditSellerVisible = true;
    },

    async submitEditSeller() {
      this.$refs.editSellerForm.validate(async (validate) => {
        if (validate) {
          try {
            let id = this.editSellerForm.id;
            const chunkUrl = process.env.VUE_APP_URL + 'vendedores/' + id;
            await APIHandler.update(chunkUrl, this.editSellerForm);
            this.$message({
              type: 'success',
              message: "El vendedor fue modificado con exito",
            });
            this.dialogEditSellerVisible = false;

            await this.updateSellersRowTable();
          } catch (error) {
            exceptionHandler.exceptionWarning("Error: No se pudo modificar el vendedor", error);
          }
        } else {
          return false;
        }
      });
    },

    async deleteSeller(row) {
      await this.$confirm(
        `¿Desea eliminar el vendedor ${row.razon_social}?`,
        '¡Cuidado!',
        {
          confirmButtonText: 'SI',
          cancelButtonText: 'NO',
          type: 'warning',
        }
      )
      .then(async () => {
        let id = row.id;
        let url = process.env.VUE_APP_URL + 'vendedores/' + id;

        await APIHandler.remove(url);
        this.$message.success({
          type: 'success',
          message: "El vendedor ha sido eliminado con exito",
        });
        this.updateSellersRowTable();
      })
      .catch((error) => {
        exceptionHandler.exceptionWarning("Error al eliminar el vendedor", error);
      });
    },

    async updateSellersRowTable() {
      await this.getSellers();
    },

    cancelCreateUser() {
      this.dialogNewUserVisible = false;
      this.createUserForm = {
        nombre: '',
        apellido: '',
        email: '',
        activo: true,
      };
    },

    cancelCreateSeller() {
      this.dialogNewSellerVisible = false;
      this.createSellerForm = {
        razon_social: '',
        email: '',
        activo: true,
      };
    },

    async submitNewUser() {
      this.$refs.createUserForm.validate(async (validate) => {
        if (validate) {
          try {
            const chunkUrl = process.env.VUE_APP_URL + 'usuarios';
            await APIHandler.create(chunkUrl, this.createUserForm);
            this.$message({
              type: 'success',
              message: "El usuario fue creado con exito",
            });
            this.dialogNewUserVisible = false;

            await this.updateUsersRowTable();
          } catch (error) {
            exceptionHandler.exceptionWarning("Error: No se pudo crear el usuario", error);
          }
        } else {
          return false;
        }
      });
    },

    async submitNewSeller() {
      this.$refs.createSellerForm.validate(async (validate) => {
        if (validate) {
          try {
            const chunkUrl = process.env.VUE_APP_URL + 'vendedores';
            await APIHandler.create(chunkUrl, this.createSellerForm);
            this.$message({
              type: 'success',
              message: "El vendedor fue creado con exito",
            });
            this.dialogNewSellerVisible = false;

            await this.updateSellersRowTable();
          } catch (error) {
            exceptionHandler.exceptionWarning("Error: No se pudo crear el vendedor", error);
          }
        } else {
          return false;
        }
      });
    },

  },
};
