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

- **状态管理与数据可视化**
  - Zustand v5.x - 轻量级状态管理
  - ECharts v5.x - 数据可视化库

- **数据持久化**
  - Prisma v6.x - 数据库 ORM
  - SQLite - 本地数据库

## 开发环境搭建

### 1. 环境准备
- Node.js v20.x
- pnpm v10.x
- 如果在 macOS 上遇到 Electron 安装问题，可以尝试：
  ```bash
  # 设置 Electron 镜像
  export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
  export ELECTRON_CUSTOM_DIR="{{ version }}"
  ```

### 2. 安装依赖
```bash
# 进入客户端目录
cd client

# 安装依赖
pnpm install

# 如果 Electron 安装失败，可以尝试：
npm install electron@28.1.0 --save-dev --force
```

### 3. 启动开发服务器
```bash
# 构建 Electron 主进程
pnpm build:electron

# 启动开发服务器（包含 Electron）
pnpm electron-dev
```

### 4. 构建应用
```bash
pnpm build
```

## 开发模式特性

- 支持热重载
- 自动打开开发者工具
- SQLite 数据持久化
- TypeScript 类型检查
- Electron 原生功能支持

## 项目结构

```
client/
├── electron/                # Electron 主进程相关
│   └── main.ts             # 主进程入口文件
├── prisma/                 # Prisma ORM 相关
│   └── schema.prisma       # 数据库模型定义
├── src/
│   ├── main/              # Electron 主进程代码
│   │   ├── database/      # 数据库相关
│   │   ├── ipc/          # IPC 通信
│   │   └── services/     # 主进程服务
│   ├── renderer/         # 渲染进程代码
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── stores/       # 状态管理
│   │   ├── services/     # API 服务
│   │   └── utils/        # 工具函数
│   └── shared/           # 主进程与渲染进程共享代码
│       └── types/        # 类型定义
└── 配置文件
```

## 功能开发

### 数据库操作
- 使用 Prisma 进行数据库操作
- 通过 IPC 在渲染进程中调用数据库服务
- 支持数据迁移和备份

### 系统集成
- 支持系统通知
- 文件系统访问
- 系统托盘集成
- 自动更新

### 开发注意事项
1. 主进程代码使用 CommonJS 语法
2. 渲染进程代码使用 ES Modules
3. 数据库操作应在主进程中进行
4. 使用 IPC 进行进程间通信

## 核心功能模块

### 1. 爬宠档案管理

- **功能**：添加、编辑、删除和查看爬宠基本信息
- **数据模型**：包含昵称、编号、物种、基因、性别、出生日期等字段
- **界面**：表格形式展示，支持分页、排序和快速操作

### 2. 数据存储实现

- **生产环境**：使用 SQLite 数据库（通过 Prisma ORM）
- **开发环境**：支持两种模式
  - Electron 环境：使用 SQLite 数据库
  - 纯浏览器环境：使用 localStorage 持久化存储（自动降级）
- **IPC 通信**：渲染进程通过 IPC 与主进程数据库服务交互

### 3. 路由系统

- 基于 React Router 实现
- 主要路由：首页、爬宠管理、爬宠详情

## 开发规范

1. **组件开发**
   - 使用函数组件和 Hooks
   - 组件文件使用 PascalCase 命名
   - 组件属性使用 TypeScript 接口定义

2. **状态管理**
   - 使用 Zustand 进行状态管理
   - 按功能模块拆分 store

3. **类型安全**
   - 严格模式下开发
   - 为所有组件属性定义接口

## 开发状态

### 已完成功能
- [x] 项目基础架构搭建
- [x] 爬宠基础信息管理
- [x] 数据持久化实现（SQLite + localStorage 降级）

### 待完成功能
- [ ] 爬宠详情页面完善
- [ ] 图片上传功能
- [ ] 数据导入导出
- [ ] 数据可视化

## 最近更新

- 添加了 localStorage 数据持久化降级方案
  - 在纯浏览器环境中自动使用 localStorage 存储数据
  - 确保开发环境中数据在页面刷新后仍然保留
  - 实现了优雅降级，当 Electron IPC 可用时自动使用数据库
