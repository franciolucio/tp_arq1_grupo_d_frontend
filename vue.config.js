module.exports = {
    publicPath: '/',
    devServer: {
        proxy: {
            "/hello-world/":{
                target:
                    "http://127.0.0.1:8000",        /* local */
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/hello-world/' : ''
                }
            }
        }
    }
};
