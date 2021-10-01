import {bus} from '@/main';

export default {
    name: 'leftPanel',
    components: {},
    data() {
      return {
        disabledIndex1 : true,
        disabledIndex2 : true,
        disabledIndex3 : true,
        disabledIndex31 : true,
        disabledIndex32 : true,
        disabledIndex33 : true,
        disabledIndex34 : true,
      }
    },
    computed: {},
    mounted() {

      bus.$on('user-selected', (userType) => {
        if (userType == 0) {
          this.disabledIndex1 = false;
          this.disabledIndex2 = false;
          this.disabledIndex3 = false;
          this.disabledIndex31 = false;
          this.disabledIndex32 = false;
          this.disabledIndex33 = false;
          this.disabledIndex34 = false;
        } else if (userType == 1) {
          this.disabledIndex1 = false;
          this.disabledIndex2 = true;
          this.disabledIndex3 = false;
          this.disabledIndex31 = true;
          this.disabledIndex32 = true;
          this.disabledIndex33 = false;
          this.disabledIndex34 = false;
        } else if (userType == 2) {
          this.disabledIndex1 = false;
          this.disabledIndex2 = true;
          this.disabledIndex3 = false;
          this.disabledIndex31 = false;
          this.disabledIndex32 = false;
          this.disabledIndex33 = true;
          this.disabledIndex34 = true;
        } else {
          this.disabledIndex1 = true;
          this.disabledIndex2 = true;
          this.disabledIndex3 = true;
          this.disabledIndex31 = true;
          this.disabledIndex32 = true;
          this.disabledIndex33 = true;
          this.disabledIndex34 = true;
        }
      });

    },
    created() {},
    methods: {

      async goToInicioView() {
        this.$router.push('/');
      },

      async goToUsersData() {
        this.$router.push('/usersData');
      },

      async goToUserInfo() {
        this.$router.push('/userInfo');
      },

      async goToProductsToSell() {
        this.$router.push('/productsToSell');
      },

      async goToSoldProducts() {
        this.$router.push('/soldProducts');
      },

      async goToProductsToBuy() {
        this.$router.push('/productsToBuy');
      },

      async goToBuyedProducts() {
        this.$router.push('/buyedProducts');
      },

    },
  };
  