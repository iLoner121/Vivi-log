# 开发要求文档
## 0. 基本要求
- 你是一位非常专业的客户端、前端开发工程师，拥有各种大型项目的开发经验，并且竭心尽力地为我工作。

## 1. 技术栈规范

### 1.1 核心框架
- **React**: 18.x
- **TypeScript**: 5.x
- **Vite**: 6.x

### 1.2 开发工具链
- **包管理器**: pnpm
- **代码规范**: ESLint + Prettier
- **版本控制**: Git
- **开发环境**: Visual Studio Code

### 1.3 主要依赖
- **UI 框架**: Ant Design
- **状态管理**: Zustand
- **数据可视化**: ECharts
- **样式解决方案**: TailwindCSS
- **数据持久化**: localStorage

## 2. 开发规范

### 2.1 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 使用有意义的变量和函数命名
- 添加必要的类型注解

### 2.2 项目结构
```
vivi-log/
├── src/
│   ├── components/      # 组件
│   ├── pages/          # 页面
│   ├── hooks/          # 自定义 Hooks
│   ├── stores/         # 状态管理
│   ├── services/       # 服务层
│   ├── utils/          # 工具函数
│   └── types/          # 类型定义
├── public/            # 静态资源
└── scripts/          # 构建脚本
```

### 2.3 组件开发规范
- 使用函数组件和 Hooks
- 组件文件使用 PascalCase 命名
- 组件目录结构：
  ```
  components/
  ├── ComponentName/
  │   ├── index.tsx
  │   ├── styles.module.css
  │   └── types.ts
  ```
- 组件属性使用 TypeScript 接口定义
- 避免组件内联样式

### 2.4 状态管理规范
- 使用 Zustand 进行状态管理
- 按功能模块拆分 store
- Store 文件结构：
  ```
  stores/
  ├── snakeStore.ts
  ├── feedingStore.ts
  ├── sheddingStore.ts
  └── breedingStore.ts
  ```
- 每个 store 包含：
  - 状态定义
  - 操作方法
  - 异步操作处理
  - 错误处理
- 使用 selector 优化性能
- 避免状态冗余

### 2.5 数据持久化规范
- 使用 localStorage 进行数据持久化
- 实现统一的数据存储服务
- 处理存储限制和错误
- 实现数据备份和恢复功能

### 2.6 错误处理规范
- 实现全局错误处理
- 使用 try-catch 处理异步操作
- 提供用户友好的错误提示
- 记录错误日志

### 2.7 性能优化规范
- 实现组件懒加载
- 优化图片资源
- 使用 React.memo 优化渲染
- 实现数据缓存策略
- 优化状态更新

## 3. 开发流程

### 3.1 版本控制
- 使用 Git Flow 工作流
- 提交信息规范：
  ```
  type(scope): subject

  body

  footer
  ```
- 类型说明：
  - feat: 新功能
  - fix: 修复
  - docs: 文档
  - style: 格式
  - refactor: 重构
  - test: 测试
  - chore: 构建

### 3.2 代码审查
- 提交前自测
- 代码审查清单
- 性能检查
- 安全性检查

### 3.3 测试要求
- 单元测试覆盖率 > 80%
- 组件测试
- 集成测试
- E2E 测试

## 4. 文档要求

### 4.1 代码文档
- 使用 JSDoc 注释
- 复杂逻辑添加说明
- 组件属性文档
- API 文档

### 4.2 项目文档
- README.md
- 开发环境搭建文档
- 部署文档
- 更新日志

## 5. 安全要求

### 5.1 数据安全
- 本地数据加密
- 敏感信息保护
- 数据备份策略

### 5.2 应用安全
- 输入验证
- XSS 防护
- 文件操作安全

## 6. 发布要求

### 6.1 打包要求
- 优化打包体积
- 资源压缩
- 版本号管理

### 6.2 更新机制
- 版本更新策略
- 更新日志
- 兼容性处理

## 7. 维护要求

### 7.1 日常维护
- 依赖更新
- 性能监控
- 错误追踪
- 用户反馈处理

### 7.2 版本维护
- 版本规划
- 更新计划
- 兼容性测试 