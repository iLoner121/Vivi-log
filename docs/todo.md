# TODO 清单

## SQLite 存储实现

### 1. 数据库初始化
- [ ] 创建数据库客户端
  ```typescript
  // src/main/database/client.ts
  import { PrismaClient } from '@prisma/client'
  export const prisma = new PrismaClient()
  ```
- [ ] 在主进程中初始化数据库连接
  ```typescript
  // electron/main.ts
  const { app, BrowserWindow } = require('electron')
  const { prisma } = require('./src/main/database/client')
  
  app.whenReady().then(async () => {
    // 初始化数据库连接
    await prisma.$connect()
    // ... 其他初始化代码
  })
  ```

### 2. 数据库服务层
- [ ] 实现爬宠服务
  ```typescript
  // src/main/services/snakeService.ts
  import { prisma } from '../database/client'
  
  export const snakeService = {
    findAll: () => prisma.snake.findMany(),
    findById: (id: number) => prisma.snake.findUnique({ where: { id } }),
    create: (data: CreateSnakeDto) => prisma.snake.create({ data }),
    update: (id: number, data: UpdateSnakeDto) => 
      prisma.snake.update({ where: { id }, data }),
    delete: (id: number) => prisma.snake.delete({ where: { id } }),
  }
  ```
- [ ] 实现喂食记录服务
  ```typescript
  // src/main/services/feedingService.ts
  import { prisma } from '../database/client'
  
  export const feedingService = {
    findBySnakeId: (snakeId: number) => 
      prisma.feeding.findMany({ where: { snakeId } }),
    create: (data: CreateFeedingDto) => 
      prisma.feeding.create({ data }),
    // ... 其他方法
  }
  ```
- [ ] 实现体重记录服务
- [ ] 实现蜕皮记录服务
- [ ] 实现繁殖记录服务

### 3. IPC 通信层
- [ ] 创建 IPC 处理器
  ```typescript
  // src/main/ipc/snakeHandler.ts
  import { ipcMain } from 'electron'
  import { snakeService } from '../services/snakeService'
  
  export function setupSnakeHandlers() {
    ipcMain.handle('snake:findAll', () => snakeService.findAll())
    ipcMain.handle('snake:findById', (_, id) => snakeService.findById(id))
    ipcMain.handle('snake:create', (_, data) => snakeService.create(data))
    // ... 其他处理器
  }
  ```
- [ ] 在主进程中注册 IPC 处理器
  ```typescript
  // electron/main.ts
  const { setupSnakeHandlers } = require('./src/main/ipc/snakeHandler')
  
  app.whenReady().then(async () => {
    await prisma.$connect()
    setupSnakeHandlers()
    // ... 其他初始化代码
  })
  ```

### 4. 渲染进程集成
- [ ] 创建 API 服务
  ```typescript
  // src/renderer/services/snakeApi.ts
  import { ipcRenderer } from 'electron'
  
  export const snakeApi = {
    findAll: () => ipcRenderer.invoke('snake:findAll'),
    findById: (id: number) => ipcRenderer.invoke('snake:findById', id),
    create: (data: CreateSnakeDto) => 
      ipcRenderer.invoke('snake:create', data),
    // ... 其他方法
  }
  ```
- [ ] 更新状态管理
  ```typescript
  // src/renderer/stores/snakeStore.ts
  import { create } from 'zustand'
  import { snakeApi } from '../services/snakeApi'
  
  export const useSnakeStore = create<SnakeState>((set, get) => ({
    // ... 现有状态
    loadSnakes: async () => {
      set({ loading: true })
      try {
        const snakes = await snakeApi.findAll()
        set({ snakes })
      } catch (error) {
        console.error('Failed to load snakes:', error)
      } finally {
        set({ loading: false })
      }
    },
    // ... 其他方法
  }))
  ```

### 5. 数据迁移
- [ ] 创建初始迁移
  ```bash
  pnpm prisma migrate dev --name init
  ```
- [ ] 添加数据种子
  ```typescript
  // prisma/seed.ts
  import { PrismaClient } from '@prisma/client'
  
  const prisma = new PrismaClient()
  
  async function main() {
    // 添加测试数据
  }
  
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  ```

### 6. 错误处理
- [ ] 实现全局错误处理中间件
- [ ] 添加数据库错误处理
- [ ] 实现重试机制

### 7. 性能优化
- [ ] 实现数据缓存
- [ ] 添加批量操作支持
- [ ] 优化查询性能

### 8. 测试
- [ ] 添加数据库服务单元测试
- [ ] 添加 IPC 通信测试
- [ ] 添加集成测试

## 注意事项
1. 确保在应用退出时正确关闭数据库连接
2. 实现数据备份机制
3. 添加数据库迁移回滚支持
4. 考虑添加数据库版本管理
5. 实现数据导入导出功能

## 优先级
1. 数据库初始化和基础服务层
2. IPC 通信层
3. 渲染进程集成
4. 数据迁移
5. 错误处理
6. 性能优化
7. 测试 