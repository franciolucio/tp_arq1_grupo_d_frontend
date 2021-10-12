import {bus} from '@/main';
import * as APIHandler from '../../../../utils/APIHandler';
import * as exceptionHandler from '../../../../utils/exceptionHandler';

export default {
    name: 'sellerInfo',
    components: {},
    data() {
      return {
        currentId: this.$route.params.id,
        editSellerForm: {
          id: null,
          razon_social: null,
          email: null,
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
    computed: {},
    mounted() {},
    async created() {

      let chunkUrl = process.env.VUE_APP_URL + "vendedores/" + this.currentId;
      let user = await APIHandler.get(chunkUrl);
      this.editSellerForm.id = user.id;
      this.editSellerForm.razon_social = user.razon_social;
      this.editSellerForm.email = user.email;

    },
    methods: {

      async submitEditSeller() {
        this.$refs.editSellerForm.validate(async (validate) => {
          if (validate) {
            try {
              let id = this.editSellerForm.id;
              const chunkUrl = process.env.VUE_APP_URL + 'vendedores/' + id;
  
              await APIHandler.update(chunkUrl, this.editSellerForm);
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

      async deleteSeller() {
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
          let url = process.env.VUE_APP_URL + 'vendedores/' + this.currentId;
  
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
  