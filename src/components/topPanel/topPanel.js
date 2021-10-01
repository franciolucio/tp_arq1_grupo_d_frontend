import {bus} from '@/main';
import * as APIHandler from '../../../utils/APIHandler';
import * as exceptionHandler from '../../../utils/exceptionHandler';

export default {
  name: 'topPanel',
  components: {},
  data() {
    return {
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
        name: ''
      },
      newUserForm: {
        type: '',
        name: ''
      },
      rules: {
        type: [
            {required: true, message: "Debe seleccionar un tipo de Usuario", trigger: 'blur'},
        ],
        name: [
            {required: true, message: "Debe seleccionar un Usuario", trigger: 'blur'}
        ],
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
      this.$refs.refNewUserForm.resetFields()
      this.dialogSingupVisible =  false;
      this.disabledUserName = true;
    },

    submitUser() {
      this.$refs.refSelectUserForm.validate(async(validate) => {
        if(validate) {
            try {
                this.dialogLoginVisible = false;
                bus.$emit('user-selected', this.selectUserForm.type);
            } catch(error) {
                exceptionHandler.exceptionWarning("User selection error", error);
            }
        } else {
            return false;
        }
      });
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
          /* eslint-disable no-console */
          console.log(usersAux);                                         //BORRAR!!!!!
          /* eslint-enable no-console */
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
          /* eslint-disable no-console */
          console.log(usersAux);                                         //BORRAR!!!!!
          /* eslint-enable no-console */
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

  },
};
