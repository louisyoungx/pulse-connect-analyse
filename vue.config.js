const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    // 打包APP
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    configureWebpack: {
        plugins: [
            new CompressionPlugin({
                /* [file]被替换为原始资产文件名。
                   [path]替换为原始资产的路径。
                   [dir]替换为原始资产的目录。
                   [name]被替换为原始资产的文件名。
                   [ext]替换为原始资产的扩展名。
                   [query]被查询替换。*/
                filename: '[path].gz[query]',
                //压缩算法
                algorithm: 'gzip',
                //匹配文件
                test: /\.js$|\.css$|\.html$/,
                //压缩超过此大小的文件,以字节为单位
                threshold: 10240,
                minRatio: 0.8,
                //删除原始文件只保留压缩后的文件
                deleteOriginalAssets: false
            })
        ]
    },
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/API': {
                //target: 'http://127.0.0.1:8000',
                target: 'http://45.40.234.190:8085',
                changeOrigin: true,
            }
        }
    },

    pwa: {
        name: 'xiao',
        themeColor: '#2c3e50',
        msTileColor: '#2c3e50',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
/*        iconPaths:{
            favicon16: "./img/icons/colors/Rocket-32x.png",
            favicon32: "./img/icons/single/Rocket-16x-full.png",
            appleTouchIcon: "./img/icons/colors/Rocket-192x.png",
            maskIcon: "./img/icons/colors/Rocket-16x.svg",
            msTileImage: "./img/icons/colors/Rocket-144x.png",
        },*/
        workboxPluginMode: 'GenerateSW', // 也可以定义为‘InjectManifest’模式。但是需自己写SW.js文件进行配置
        workboxOptions: {
            importWorkboxFrom: 'local', //从''cdn"导入workbox,也可以‘local’
            skipWaiting: true, // 安装完SW不等待直接接管网站
            clientsClaim: true,
            /*
            navigateFallback: '/',
            navigateFallbackBlacklist: [/\/API\//],
            exclude: [/\.(?:png|jpg|jpeg|svg)$/], //在预缓存中排除图片
            // 定义运行时缓存
            runtimeCaching: [
                {
                    urlPattern: new RegExp('^https://cdn'),
                    handler: 'NetworkFirst',
                    options: {
                        networkTimeoutSeconds: 20,
                        cacheName: 'cdn-cache',
                        cacheableResponse: {
                            statuses: [200]
                        }
                    }
                }
            ]*/
        }
    }
}
