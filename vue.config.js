module.exports = {
    //publicPath: '/',
    devServer: {
        proxy: {
            "/simil-mercado/":{
                target:
                    "http://127.0.0.1:8000",        /* local */
                changeOrigin: true,
                pathRewrite: {
                    '^/simil-mercado/' : ''
                }
            }
        }
    }
};
