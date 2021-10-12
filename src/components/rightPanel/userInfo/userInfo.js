import {bus} from '@/main';
import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'userInfo',
    components: {},
    data() {
      return {
        currentId: this.$route.params.id,
        editUserForm: {
          id: null,
          nombre: null,
          apellido: null,
          email: null,
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
      }
    },
    computed: {},
    mounted() {},
    async created() {

      let chunkUrl = process.env.VUE_APP_URL + "usuarios/" + this.currentId;
      let user = await APIHandler.get(chunkUrl);
      this.editUserForm.id = user.id;
      this.editUserForm.nombre = user.nombre;
      this.editUserForm.apellido = user.apellido;
      this.editUserForm.email = user.email;

    },
    methods: {

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
            } catch (error) {
              exceptionHandler.exceptionWarning("Error: No se pudo modificar el usuario", error);
            }
          } else {
            return false;
          }
        });
      },

      async deleteUser() {
        await this.$confirm(
          `¿Esta seguro que quiere eliminar su usuario?`,
          '¡Cuidado!',
          {
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            type: 'warning',
          }
        )
        .then(async () => {
          let url = process.env.VUE_APP_URL + 'usuarios/' + this.currentId;
  
          await APIHandler.remove(url);
          this.$message.success({
            type: 'success',
            message: "El usuario ha sido eliminado con exito",
          });
          bus.$emit('user-logOut');
        })
        .catch((error) => {
          exceptionHandler.exceptionWarning("Error al eliminar el usuario", error);
        });
      },

    },
  };
  