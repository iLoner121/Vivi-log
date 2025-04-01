# Vivi-log 客户端

## 项目概述

Vivi-log 是一个基于 Electron + React 的桌面应用，用于管理蛇类爬宠的日常饲养信息。本项目使用 TypeScript 作为开发语言，采用现代化的前端技术栈和工具链。

## 技术栈

- **核心框架**
  - Electron v28.x - 跨平台桌面应用框架
  - React v19.x - 用户界面框架
  - TypeScript v5.x - 类型安全的 JavaScript 超集
  - Vite v6.x - 现代化前端构建工具

- **UI 框架与样式**
  - Ant Design v5.x - React UI 组件库
  - TailwindCSS v3.x - 原子化 CSS 框架
  - PostCSS v8.x - CSS 处理器

- **状态管理与数据可视化**
  - Zustand v5.x - 轻量级状态管理
  - ECharts v5.x - 数据可视化库

- **数据持久化**
  - Prisma v6.x - 数据库 ORM

## 项目结构

```
client/
├── electron/                 # Electron 主进程相关
│   └── main.ts              # 主进程入口文件
├── src/
│   ├── main/                # Electron 主进程代码
│   │   ├── database/        # 数据库相关
│   │   ├── ipc/            # IPC 通信
│   │   └── services/       # 主进程服务
│   ├── renderer/            # 渲染进程代码
│   │   ├── components/     # React 组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── stores/        # 状态管理
│   │   ├── utils/         # 工具函数
│   │   ├── App.tsx        # 应用根组件
│   │   ├── main.tsx       # 渲染进程入口
│   │   └── index.css      # 全局样式
│   └── shared/             # 主进程与渲染进程共享代码
├── index.html              # HTML 入口文件
├── public/                 # 静态资源
├── package.json           # 项目配置和依赖
├── tsconfig.json         # TypeScript 配置
├── tsconfig.node.json    # Node.js TypeScript 配置
├── vite.config.ts        # Vite 构建配置
├── tailwind.config.js    # TailwindCSS 配置
├── postcss.config.js     # PostCSS 配置
├── .eslintrc.json       # ESLint 配置
└── .prettierrc          # Prettier 配置

```

## 配置说明

### TypeScript 配置

- `tsconfig.json`: 主要的 TypeScript 配置文件
  - 启用严格模式
  - 配置模块解析
  - 设置路径别名 (@/* -> src/*)
  - 配置 JSX 支持

- `tsconfig.node.json`: Node.js 环境的 TypeScript 配置
  - 用于 Electron 主进程和构建脚本
  - 配置模块解析策略

### 构建配置

- `vite.config.ts`: Vite 构建工具配置
  - 配置 React 插件
  - 设置路径别名
  - 配置构建输出目录

### 代码规范

- `.eslintrc.json`: ESLint 配置
  - TypeScript 规则
  - React 规则
  - Prettier 集成

- `.prettierrc`: Prettier 代码格式化配置
  - 设置代码风格规则
  - 配置格式化选项

### 样式配置

- `tailwind.config.js`: TailwindCSS 配置
  - 设置内容扫描范围
  - 禁用 preflight 以兼容 Ant Design
  - 自定义主题配置

- `postcss.config.js`: PostCSS 配置
  - 集成 TailwindCSS
  - 配置 Autoprefixer

## 开发脚本

```bash
# 开发环境启动
pnpm dev

# 构建应用
pnpm build

# 代码检查
pnpm lint

# 预览构建结果
pnpm preview
```

## 开发规范

1. **组件开发**
   - 使用函数组件和 Hooks
   - 组件文件使用 PascalCase 命名
   - 组件属性使用 TypeScript 接口定义

2. **状态管理**
   - 使用 Zustand 进行状态管理
   - 按功能模块拆分 store
   - 使用 TypeScript 定义状态类型

3. **样式开发**
   - 优先使用 TailwindCSS 类名
   - 结合 Ant Design 组件库
   - 必要时使用 CSS Modules

4. **类型安全**
   - 严格模式下开发
   - 避免使用 any 类型
   - 为所有组件属性定义接口

## 后续开发计划

1. **功能组件开发**
   - [ ] 布局组件
   - [ ] 导航组件
   - [ ] 数据表单
   - [ ] 数据展示组件

2. **数据库集成**
   - [ ] 设计数据模型
   - [ ] 实现数据库操作
   - [ ] 数据迁移方案

3. **路由系统**
   - [ ] 配置路由
   - [ ] 实现页面导航
   - [ ] 权限控制

4. **状态管理**
   - [ ] 设计状态结构
   - [ ] 实现数据流
   - [ ] 持久化方案

## 注意事项

1. 遵循 TypeScript 严格模式
2. 保持代码风格一致性
3. 编写必要的注释和文档
4. 遵循组件设计原则
5. 注意性能优化 