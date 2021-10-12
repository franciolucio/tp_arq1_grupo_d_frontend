import {bus} from '@/main';

export default {
    name: 'leftPanel',
    components: {},
    data() {
      return {
        currentId: 0,
        disabledIndex11 : true,
        disabledIndex12 : true,
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

      bus.$on('user-selected', (userType, id) => {
        this.currentId = id;
        if (userType == 0) {
          this.disabledIndex11 = true;
          this.disabledIndex12 = true;
          this.disabledIndex2 = false;
          this.disabledIndex3 = true;
          this.disabledIndex31 = true;
          this.disabledIndex32 = true;
          this.disabledIndex33 = true;
          this.disabledIndex34 = true;
        } else if (userType == 1) {
          this.disabledIndex11 = false;
          this.disabledIndex12 = true;
          this.disabledIndex2 = true;
          this.disabledIndex3 = false;
          this.disabledIndex31 = true;
          this.disabledIndex32 = true;
          this.disabledIndex33 = false;
          this.disabledIndex34 = false;
        } else if (userType == 2) {
          this.disabledIndex11 = true;
          this.disabledIndex12 = false;
          this.disabledIndex2 = true;
          this.disabledIndex3 = false;
          this.disabledIndex31 = false;
          this.disabledIndex32 = false;
          this.disabledIndex33 = true;
          this.disabledIndex34 = true;
        } else {
          this.disabledIndex11 = true;
          this.disabledIndex12 = true;
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
        this.$router.push('/').catch(()=>{});
      },

      async goToUsersData() {
        this.$router.push('/usersData').catch(()=>{});
      },

      async goToUserInfo() {
        this.$router.push({
          name: "userInfo",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

      async goToSellerInfo() {
        this.$router.push({
          name: "sellerInfo",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

      async goToProductsToSell() {
        this.$router.push({
          name: "productsToSell",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

      async goToSoldProducts() {
        this.$router.push({
          name: "soldProducts",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

      async goToProductsToBuy() {
        this.$router.push({
          name: "productsToBuy",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

      async goToBuyedProducts() {        
        this.$router.push({
          name: "buyedProducts",
          params:{
            id: this.currentId,
          }
        }).catch(()=>{});
      },

    },
  };
  