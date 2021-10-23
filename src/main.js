import Vue from 'vue';
import App from './App.vue';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/es';
import VueRouter from 'vue-router';
import inicioView from './components/rightPanel/inicioView/index';
import usersData from './components/rightPanel/usersData/index';
import categories from './components/rightPanel/categories/index';
import userInfo from './components/rightPanel/userInfo/index';
import sellerInfo from './components/rightPanel/sellerInfo/index';
import productsToSell from './components/rightPanel/productsToSell/index';
import soldProducts from './components/rightPanel/soldProducts/index';
import productsToBuy from './components/rightPanel/productsToBuy/index';
import buyedProducts from './components/rightPanel/buyedProducts/index';


Vue.config.productionTip = false;
Vue.use(VueRouter);
export const bus = new Vue();

const routes = [
    { 
        path: '/',
        name: 'inicioView',
        component: inicioView
    },
    { 
        path: '/usersData',
        name: 'usersData',
        component: usersData
    },
    { 
        path: '/categories',
        name: 'categories',
        component: categories
    },
    { 
        path: '/userInfo/:id',
        name: 'userInfo',
        component: userInfo
    },
    { 
        path: '/sellerInfo/:id',
        name: 'sellerInfo',
        component: sellerInfo
    },
    { 
        path: '/productsToSell/:id',
        name: 'productsToSell',
        component: productsToSell
    },
    { 
        path: '/soldProducts/:id',
        name: 'soldProducts',
        component: soldProducts
    },
    { 
        path: '/productsToBuy/:id',
        name: 'productsToBuy',
        component: productsToBuy
    },
    { 
        path: '/buyedProducts/:id',
        name: 'buyedProducts',
        component: buyedProducts
    }
];

export const router = new VueRouter(
    {
        mode: "history",
        routes
    });

Vue.use(Element, {locale});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');