import * as APIHandler from '../../utils/APIHandler';
import * as exceptionHandler from '../../utils/exceptionHandler';

export default {
  name: 'usersData',
  components: {},
  data() {
    return {
      buttonName: "GET USUARIOS",
      loading: false,
      usuarios: [],
      columns: [
        {prop: 'id', label: 'ID', width: 'auto'},
        {prop: 'nombre', label: 'Nombre', width: 'auto'},
        {prop: 'apellido', label: 'Apellido', width: 'auto'},
        {prop: 'email', label: 'Email', width: 'auto'},
      ],
      usersPages: 1,
      pageSizes: [12, 15, 50, 100],
      pageSize: null,
    };
  },
  computed: {

    currentUsersView() {
      return this.searchBar.slice(
        (this.usersPages - 1) * this.pageSize,
        this.usersPages * this.pageSize
      );
    },

    searchBar() {
      return this.usuarios
    },

  },
  mounted() {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  methods: {
    async getUsers() {
      this.loading = true;
        try {
            const chunkUrl = process.env.VUE_APP_URL + `usuarios`;
            this.usuarios = await APIHandler.get(chunkUrl);
        } catch (error) {
            exceptionHandler.exceptionWarning("ROMPIO PAPU!!!",error);
        } finally {
            await (new Promise(resolve => setTimeout(resolve, 2000)));        //BORRAR!!!!!
            this.loading = false;
        }
    },
  },
};
