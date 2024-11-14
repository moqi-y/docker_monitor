import { defineConfig } from "umi";

export default defineConfig({
    routes: [
        { path: "/", component: "index" },
        { path: "/images", component: "images" },
        { path: "/container", component: "container" },
        { path: "/host", component: "host" },
        { path: "/login", component: "login" , layout: false},
        { path: "/remoteContainer", component: "remoteContainer"},
        { path: "/tools", component: "tools"},
        { path: "/source", component: "source"},
    ],
    npmClient: 'npm',
    proxy: {
        '/api': {
            'port': 8001,
            // 'target': 'http://10.13.6.47:8000',
            'target': 'http://localhost:8000',
            'changeOrigin': true,
            // 'pathRewrite': {'^/api': ''},
        },
    },
    links: [
        { rel: 'icon', href: './favicon.ico' },
    ],
    title: '容器管理系统'
});
