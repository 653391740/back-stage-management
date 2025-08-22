<template>
    <el-container>
        <el-header>
            <div>
                <el-image lazy />
                <h2>电商后台管理系统</h2>
            </div>
            <el-button type="info" size="big" @click="goBack">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="250px">
                <el-menu :default-active="defaultRouter" :default-openeds="defaultMenuOpen"
                    class="el-menu-vertical-demo" text-color="#fff" :unique-opened="true" router @open="handleOpen">
                    <!-- 递归渲染菜单组件 -->
                    <menu-item v-for="menu in menus" :key="menu.id" :menu="menu">
                    </menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ activeMenu }}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ activeMenuPath }}</el-breadcrumb-item>
                </el-breadcrumb>

                <div class="cont">
                    <router-view></router-view>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import { Getmenus } from '@/api/http.js'
    import MenuItem from '@/components/MenuItem.vue'

    export default {
        components: {
            MenuItem
        },
        data() {
            return {
                menus: [],
                defaultRouter: '/home/users',
                defaultMenuOpen: ['/home/users'],
                active: [
                    {
                        authName: '用户管理',
                        path: [{ authName: '用户列表', path: '/home/users' }]
                    },
                    {
                        authName: '权限管理',
                        path: [
                            { authName: '角色列表', path: '/home/roles' },
                            { authName: '权限列表', path: '/home/rights' }
                        ]
                    },
                    {
                        authName: '商品管理',
                        path: [
                            { authName: '商品列表', path: '/home/goods' },
                            { authName: '分类参数', path: '/home/params' },
                            { authName: '商品分类', path: '/home/categories' }
                        ]
                    },
                    {
                        authName: '订单管理',
                        path: [
                            { authName: '订单列表', path: '/home/orders' }
                        ]
                    },
                    {
                        authName: '数据统计',
                        path: [
                            { authName: '数据报表', path: '/home/reports' },
                        ]
                    },
                ]
            }
        },
        computed: {
            activeMenu() {
                const currentPath = this.$route.path
                const activeItem = this.active.find(item =>
                    item.path.some(path => path.path === currentPath)
                )
                return activeItem ? activeItem.authName : ''
            },
            activeMenuPath() {
                const currentPath = this.$route.path
                const activeItem = this.active.find(item =>
                    item.path.some(path => path.path === currentPath)
                )
                const pathItem = activeItem ? activeItem.path.find(path => path.path === currentPath) : null
                return pathItem ? pathItem.authName : ''
            }
        },
        mounted() {
            this._GetMenus()
            this.$router.afterEach((to, from) => {
                if (to.path === '/home' || to.path === from.path) return
                // 记录当前路由信息
                this.saveRouteInfo(to.path)

                // 特殊处理添加商品页面
                if (to.path === '/home/add') {
                    sessionStorage.setItem('defaultRouter', JSON.stringify(to.path))
                }
            })
        },
        methods: {
            goBack() {
                this.$router.push('/login');
                localStorage.removeItem('token')
                sessionStorage.removeItem('defaultRouter')
                sessionStorage.removeItem('defaultMenuOpen')
            },
            handleOpen(key, keyPath) { // 保存菜单打开选项
                sessionStorage.setItem('defaultMenuOpen', JSON.stringify(keyPath))
            },

            saveRouteInfo(path) { // 保存路由信息
                sessionStorage.setItem('defaultRouter', JSON.stringify(path))
                this.defaultRouter = path
            },
            restoreRouteState() { // 恢复路由状态
                // 恢复默认路由
                const savedRouter = sessionStorage.getItem('defaultRouter')
                if (savedRouter) {
                    const defaultRouter = JSON.parse(savedRouter)
                    this.defaultRouter = defaultRouter === '/home/add' ? '/home/goods' : defaultRouter
                }

                // 恢复菜单打开状态
                const savedMenuOpen = sessionStorage.getItem('defaultMenuOpen')
                if (savedMenuOpen) {
                    this.defaultMenuOpen = JSON.parse(savedMenuOpen)
                }
            },
            async _GetMenus() {
                try {
                    const res = await Getmenus()
                    this.menus = res
                    // 菜单数据加载完成后，重新应用路由状态
                    this.$nextTick(() => {
                        this.restoreRouteState()
                    })
                } catch (err) {
                    console.log(err);
                    this.menus = []
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .is-vertical>.el-container {
        height: calc(100% - 100px) !important;
    }

    .el-container {
        height: 100%;
    }

    .cont {
        margin-top: 20px;
        background-color: #fff;
        padding: 20px 10px;
        height: calc(100% - 40px);
        overflow: hidden;

        &>div {
            height: 100%;
        }
    }

    .el-header {
        background-color: #4083cd;
        color: #333;
        text-align: center;
        height: 100px !important;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        div {
            display: flex;
            align-items: center;

            .el-image {
                width: 155px;
                height: 71px;
            }
        }

        h2 {
            margin-left: 40px;
            color: #fff;
        }
    }

    .el-aside {
        border-top: 1px solid #000;
        background-color: #4083cd;
        color: #fff;
    }

    .el-main {
        background-color: #efefef;
        color: #333;
        height: 100%;
    }
</style>