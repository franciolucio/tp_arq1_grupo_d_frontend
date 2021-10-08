import {bus} from '@/main';
import * as APIHandler from '../../../utils/APIHandler';
import * as exceptionHandler from '../../../utils/exceptionHandler';

export default {
  name: 'topPanel',
  components: {},
  data() {
    return {
      currentID: 0,
      titleLoginDialog: "Log In",
      titleSignupDialog: "Sing Up",
      dialogLoginVisible: false,
      dialogSingupVisible: false,
      userType: [
        { key: 0, label: 'Administradores' },
        { key: 1, label: 'Usuarios' },
        { key: 2, label: 'Vendedores' },
      ],
      users: [],
      titleUserType: "Tipo de Usuario:",
      placeholderUserType: "Seleccione el tipo de usuario",
      titleUserName: "Usuario:",
      placeholderUserName: "Seleccione el usuario",
      disabledUserName: true,
      selectUserForm: {
        type: '',
        name: '',
        rules: {
          type: [
              {required: true, message: "Debe seleccionar un tipo de Usuario", trigger: 'blur'},
          ],
          name: [
              {required: true, message: "Debe seleccionar un Usuario", trigger: 'blur'}
          ],
        }
      },
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
      editUserForm: {
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
      editSellerForm: {
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

    }
  },
  methods: {

    closeDialogLogin() {
      this.$refs.refSelectUserForm.resetFields();
      this.dialogLoginVisible = false;
      this.disabledUserName = true;
    },

    closeDialogSignup() {
      this.dialogSingupVisible =  false;
    },

    submitUser() {
      this.$refs.refSelectUserForm.validate(async(validate) => {
        if(validate) {
            try {
                this.dialogLoginVisible = false;
                bus.$emit('user-selected', this.selectUserForm.type, this.currentID);
            } catch(error) {
                exceptionHandler.exceptionWarning("User selection error", error);
            }
        } else {
            return false;
        }
      });
    },

    async loadUser(event) {
      this.currentID = event;
    },

    async selectUserType() {
      try {
        this.loading = true;
        this.users = [];
        this.selectUserForm.name = '';
        let chunkUrl = ""
        if (this.selectUserForm.type == 0) {
          this.users = [
            {
              key: 0,
              label: "Admin"
            }
          ]
        } else if (this.selectUserForm.type == 1) {
          chunkUrl = process.env.VUE_APP_URL + "usuarios";
          let usersAux = await APIHandler.get(chunkUrl);
          for (var i1 = 0; i1 < usersAux.length; i1++) {
            let data = [
              {
                key: usersAux[i1]['id'],
                label: usersAux[i1]['nombre'] + " " + usersAux[i1]['apellido']
              }
            ]
            this.users = this.users.concat(data);
          }
        } else if (this.selectUserForm.type == 2) {
          chunkUrl = process.env.VUE_APP_URL + "vendedores";
          let usersAux = await APIHandler.get(chunkUrl);
          for (var i2 = 0; i2 < usersAux.length; i2++) {
            let data = [
              {
                key: usersAux[i2]['id'],
                label: usersAux[i2]['razon_social']
              }
            ]
            this.users = this.users.concat(data);
          }
        } else {
            throw "Invalid User Type";
        }
      } catch (error) {
          exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
      } finally {
          this.disabledUserName = false;
          this.loading = false;
      }
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
            this.cancelCreateUser();

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
            this.cancelCreateSeller();

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
