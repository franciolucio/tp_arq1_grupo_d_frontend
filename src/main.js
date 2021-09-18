import Vue from 'vue';
import App from './App.vue';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/es';
import VueRouter from 'vue-router';
import usersData from './components/index';


Vue.config.productionTip = false;
Vue.use(VueRouter);
export const bus = new Vue();

const routes = [
    {path: '/', name: 'usersData', component: usersData}
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