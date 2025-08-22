# 后台管理系统

## 项目简介

这是一个基于Vue 2和Element UI构建的现代化后台管理系统，使用Vite作为构建工具。系统集成了数据可视化、用户管理、商品管理、订单管理、权限管理等完整的企业级功能模块。

## 技术栈

- **前端框架**: Vue 2.7.16
- **UI组件库**: Element UI 2.15.14
- **构建工具**: Vite 4.5.0
- **路由管理**: Vue Router 3.5.2
- **HTTP请求**: Axios 1.11.0
- **数据可视化**: ECharts 6.0.0
- **富文本编辑**: Vue Quill Editor 3.0.6
- **CSS预处理器**: Sass 1.90.0

## 功能特性

### 🔐 用户认证
- 用户登录/登出
- Token认证机制
- 路由守卫保护

### 👥 用户管理
- 用户列表展示
- 用户添加/编辑/删除
- 用户状态管理
- 用户角色分配

### 🔐 权限管理
- 角色管理
- 权限列表
- 权限分配

### 📦 商品管理
- 商品列表管理
- 商品分类管理
- 商品参数管理
- 商品添加/编辑

### 📋 订单管理
- 订单列表
- 订单详情查看
- 订单状态管理

### 📊 数据报表
- 数据可视化展示
- 图表统计分析
- 实时数据监控

### 📝 富文本编辑
- 商品详情编辑
- 内容发布管理

## 项目结构

```
back-stage-management/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── MenuItem.vue   # 菜单项组件
│   │   ├── Pagination.vue # 分页组件
│   │   └── Search.vue     # 搜索组件
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   ├── view/              # 页面组件
│   │   ├── goods/         # 商品相关页面
│   │   ├── orders/        # 订单相关页面
│   │   ├── reports/       # 报表相关页面
│   │   ├── rights/        # 权限相关页面
│   │   ├── users/         # 用户相关页面
│   │   ├── home.vue       # 主页面
│   │   ├── login.vue      # 登录页面
│   │   └── 404.vue        # 404页面
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js        # Vite配置
└── jsconfig.json         # JavaScript配置
```

## 安装和运行

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 主要页面说明

### 登录页面 (/login)
- 用户登录认证
- 记住登录状态
- 登录成功后跳转到主页

### 主页 (/home)
- 欢迎信息展示
- 数据概览
- 快捷操作入口

### 用户管理 (/home/users)
- 用户列表展示
- 用户搜索功能
- 用户添加/编辑/删除
- 用户状态切换
- 角色分配管理

### 角色管理 (/home/roles)
- 角色列表展示
- 角色添加/编辑/删除
- 权限分配管理

### 权限管理 (/home/rights)
- 权限列表展示
- 权限层级管理

### 商品管理 (/home/goods)
- 商品列表展示
- 商品搜索功能
- 商品添加/编辑/删除
- 商品状态管理

### 商品分类 (/home/categories)
- 分类树形展示
- 分类添加/编辑/删除
- 分类级别管理

### 商品参数 (/home/params)
- 参数列表管理
- 动态参数配置
- 静态属性管理

### 订单管理 (/home/orders)
- 订单列表展示
- 订单详情查看
- 订单状态管理
- 物流信息查询

### 数据报表 (/home/reports)
- 数据可视化图表
- 销售数据统计
- 用户行为分析

## 开发说明

### 组件开发
- 公共组件位于 `src/components/` 目录
- 页面组件位于 `src/view/` 目录
- 遵循Vue单文件组件规范

### 样式开发
- 使用Sass预处理器
- 全局样式在 `src/assets/index.css`
- Element UI主题定制

### API开发
- API接口统一管理在 `src/api/` 目录
- 使用Axios进行HTTP请求
- 统一的错误处理和响应拦截

### 路由开发
- 路由配置在 `src/router/index.js`
- 使用懒加载提升性能
- 路由守卫进行权限控制

## 部署说明

### 构建优化
- 代码分割和懒加载
- 资源压缩和优化
- 缓存策略配置

### 部署要求
- 支持HTML5 History模式的Web服务器
- 静态资源服务器配置
- 反向代理配置（如需要）

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 版本历史

- **1.0.0** - 初始版本
  - 完整的后台管理系统功能
  - 用户认证和权限管理
  - 商品和订单管理
  - 数据可视化报表

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

© 2024 后台管理系统. All rights reserved.