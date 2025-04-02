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
# 启动 Vite 开发服务器
pnpm dev

# 启动 Electron 应用（开发模式）
pnpm electron-dev

# 构建应用
pnpm build

# 代码检查
pnpm lint

# 预览构建结果
pnpm preview

# 构建 preload 脚本
pnpm build:preload
```

### 开发环境配置

#### 端口配置
- Vite 开发服务器默认使用 5173 端口
- 如果端口被占用，会自动尝试下一个可用端口
- Electron 主进程会自动检测并连接到正确的端口
- 最多尝试 10 个端口（从 5173 开始）

#### 开发模式特性
- 支持热重载
- 自动打开开发者工具
- 使用模拟数据进行测试
- 支持 TypeScript 类型检查

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

## 功能模块

### 1. 爬宠档案管理

#### 1.1 基础信息管理
- 支持添加、编辑、删除和查看爬宠信息
- 包含以下字段：
  - 昵称（必填）
  - 编号（必填，唯一）
  - 物种（必填）
  - 基因（可选）
  - 性别（必填）
  - 出生日期（必填）
  - 来源（必填）
  - 价格（可选）
  - 体长（可选）
  - 体重（可选）
  - 颜色（可选）
  - 花纹特征（可选）

#### 1.2 数据展示
- 表格形式展示爬宠列表
- 支持分页和排序
- 显示基本信息和计算年龄
- 支持快速操作（查看、编辑、删除）

#### 1.3 组件结构
```
src/
├── shared/
│   └── types/
│       └── snake.ts          # 类型定义
├── renderer/
│   ├── components/
│   │   └── snake/
│   │       ├── SnakeForm.tsx # 爬宠表单组件
│   │       └── SnakeList.tsx # 爬宠列表组件
│   ├── stores/
│   │   └── snakeStore.ts     # 状态管理
│   └── pages/
│       └── SnakeManagement.tsx # 爬宠管理页面
```

#### 1.4 开发状态
- [x] 数据模型设计
- [x] 类型定义
- [x] 状态管理
- [x] 表单组件
- [x] 列表组件
- [x] 管理页面
- [ ] 数据库集成
- [ ] 详情页面
- [ ] 图片上传
- [ ] 数据导入导出 

### 2. 路由系统

#### 2.1 路由配置
- 使用 React Router v7 实现路由管理
- 配置了以下路由：
  - `/` - 首页
  - `/snakes` - 爬宠管理页面
  - `/snakes/:id` - 爬宠详情页面

#### 2.2 组件结构
```
src/
├── renderer/
│   ├── App.tsx              # 路由配置
│   └── pages/
│       ├── Home.tsx         # 首页
│       ├── SnakeManagement.tsx # 爬宠管理
│       └── SnakeDetail.tsx  # 爬宠详情
```

### 3. 数据库集成

#### 3.1 数据模型
- 使用 Prisma ORM 实现数据库操作
- 定义了 Snake 模型，包含以下字段：
  - id: Int (主键)
  - name: String (昵称)
  - code: String (编号)
  - species: String (物种)
  - gene: String? (基因)
  - gender: String (性别)
  - birthDate: DateTime (出生日期)
  - source: String (来源)
  - price: Float? (价格)
  - length: Float? (体长)
  - weight: Float? (体重)
  - color: String? (颜色)
  - pattern: String? (花纹特征)
  - createdAt: DateTime (创建时间)
  - updatedAt: DateTime (更新时间)

#### 3.2 数据库服务
- 实现了数据库连接和操作服务
- 提供了完整的 CRUD 操作接口
- 使用 SQLite 作为开发环境数据库

### 4. IPC 通信

#### 4.1 主进程服务
- 实现了 IPC 通信处理
- 提供了以下 IPC 通道：
  - `snake:getAll` - 获取所有爬宠
  - `snake:getById` - 获取单个爬宠
  - `snake:create` - 创建爬宠
  - `snake:update` - 更新爬宠
  - `snake:delete` - 删除爬宠

#### 4.2 渲染进程 API
- 封装了 IPC 通信的 API 服务
- 提供了类型安全的接口调用
- 实现了错误处理和日志记录

### 5. 开发环境配置

#### 5.1 构建配置
- 配置了 Vite 开发服务器
- 实现了 Electron 主进程和渲染进程的构建
- 添加了 preload 脚本的构建配置

#### 5.2 开发脚本
- `pnpm dev` - 启动 Vite 开发服务器
- `pnpm electron-dev` - 启动 Electron 应用（开发模式）
- `pnpm build` - 构建应用
- `pnpm build:preload` - 构建 preload 脚本

## 开发状态更新

### 已完成功能
- [x] 项目基础架构搭建
- [x] 路由系统实现
- [x] 数据库模型设计
- [x] IPC 通信实现
- [x] 爬宠管理基础功能
- [x] 开发环境配置

### 进行中功能
- [ ] 爬宠详情页面完善
- [ ] 图片上传功能
- [ ] 数据导入导出
- [ ] 数据可视化
- [ ] 用户认证

### 待开发功能
- [ ] 批量操作功能
- [ ] 数据备份恢复
- [ ] 系统设置
- [ ] 多语言支持
- [ ] 主题定制

## 技术栈更新

### 新增依赖
- `react-router-dom` - 路由管理
- `dayjs` - 日期处理
- `@prisma/client` - 数据库 ORM
- `cross-env` - 跨平台环境变量

### 开发工具
- `prisma` - 数据库迁移和客户端生成
- `electron-builder` - 应用打包

## 注意事项

1. 遵循 TypeScript 严格模式
2. 保持代码风格一致性
3. 编写必要的注释和文档
4. 遵循组件设计原则
5. 注意性能优化

## 功能模块

### 1. 爬宠档案管理

#### 1.1 基础信息管理
- 支持添加、编辑、删除和查看爬宠信息
- 包含以下字段：
  - 昵称（必填）
  - 编号（必填，唯一）
  - 物种（必填）
  - 基因（可选）
  - 性别（必填）
  - 出生日期（必填）
  - 来源（必填）
  - 价格（可选）
  - 体长（可选）
  - 体重（可选）
  - 颜色（可选）
  - 花纹特征（可选）

#### 1.2 数据展示
- 表格形式展示爬宠列表
- 支持分页和排序
- 显示基本信息和计算年龄
- 支持快速操作（查看、编辑、删除）

#### 1.3 组件结构
```
src/
├── shared/
│   └── types/
│       └── snake.ts          # 类型定义
├── renderer/
│   ├── components/
│   │   └── snake/
│   │       ├── SnakeForm.tsx # 爬宠表单组件
│   │       └── SnakeList.tsx # 爬宠列表组件
│   ├── stores/
│   │   └── snakeStore.ts     # 状态管理
│   └── pages/
│       └── SnakeManagement.tsx # 爬宠管理页面
```

#### 1.4 开发状态
- [x] 数据模型设计
- [x] 类型定义
- [x] 状态管理
- [x] 表单组件
- [x] 列表组件
- [x] 管理页面
- [ ] 数据库集成
- [ ] 详情页面
- [ ] 图片上传
- [ ] 数据导入导出 