# TODO 清单

## 1. 状态管理实现

### 1.1 基础 Store 实现
- [x] 创建数据存储服务
  ```typescript
  // src/services/storage.ts
  class StorageService<T> {
    // ... 已实现
  }
  ```
- [x] 实现蛇类管理 Store
  ```typescript
  // src/stores/snakeStore.ts
  export const useSnakeStore = create<SnakeState>((set, get) => ({
    // ... 已实现
  }))
  ```
- [x] 实现成长记录 Store
  ```typescript
  // src/stores/growthStore.ts
  interface GrowthState {
    // ... 已实现
  }
  ```

### 1.2 待实现的 Store
- [x] 实现喂食记录 Store
  ```typescript
  // src/stores/feedingStore.ts
  interface FeedingState {
    feedings: Feeding[]
    loading: boolean
    error: string | null
    selectedFeeding: Feeding | null
    
    fetchFeedings: () => Promise<void>
    getFeedingsBySnakeId: (snakeId: number) => Feeding[]
    addFeeding: (feeding: Omit<Feeding, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateFeeding: (id: number, updates: Partial<Feeding>) => Promise<void>
    deleteFeeding: (id: number) => Promise<void>
  }
  ```

- [ ] 实现繁殖记录 Store
  ```typescript
  // src/stores/breedingStore.ts
  interface BreedingState {
    breedings: Breeding[]
    loading: boolean
    error: string | null
    selectedBreeding: Breeding | null
    
    fetchBreedings: () => Promise<void>
    getBreedingsBySnakeId: (snakeId: number) => Breeding[]
    addBreeding: (breeding: Omit<Breeding, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateBreeding: (id: number, updates: Partial<Breeding>) => Promise<void>
    deleteBreeding: (id: number) => Promise<void>
  }
  ```

### 1.3 Store 功能增强
- [x] 实现数据导出功能
- [x] 实现数据导入功能
- [ ] 实现数据备份功能
  ```typescript
  // src/services/backupService.ts
  export const backupService = {
    createBackup: () => {
      // 实现数据备份
    },
    restoreBackup: (backup: string) => {
      // 实现数据恢复
    }
  }
  ```

## 2. UI 组件开发

### 2.1 基础组件
- [x] 实现蛇类列表组件
- [x] 实现蛇类详情组件
- [x] 实现蛇类表单组件
- [x] 实现喂食记录组件
- [x] 实现成长记录组件
  - [x] 体重记录表单
  - [x] 蜕皮记录表单
  - [ ] 成长曲线图表
  - [x] 蜕皮周期分析
- [ ] 实现繁殖记录组件

### 2.2 数据可视化组件
- [ ] 实现体重变化图表
  - 支持时间范围选择
  - 显示生长速度趋势
  - 支持数据点标记
- [ ] 实现蜕皮周期图表
  - 显示蜕皮间隔
  - 预测下次蜕皮时间
  - 异常情况标记
- [ ] 实现喂食频率图表
- [ ] 实现繁殖成功率图表

### 2.3 功能组件
- [x] 实现数据导入导出组件
- [ ] 实现数据备份恢复组件
- [ ] 实现提醒设置组件

## 3. 页面开发

### 3.1 主要页面
- [x] 实现首页
- [x] 实现蛇类管理页面
- [x] 实现喂食记录页面
- [x] 实现成长记录页面
  - [x] 体重记录管理
  - [x] 蜕皮记录管理
  - [ ] 成长数据分析
- [ ] 实现繁殖记录页面
- [ ] 实现数据统计页面
- [x] 实现设置页面

### 3.2 功能页面
- [x] 实现数据导入导出页面
- [ ] 实现数据备份恢复页面
- [ ] 实现提醒设置页面

## 4. 工具函数开发

### 4.1 数据处理
- [x] 实现日期处理函数
- [x] 实现数据格式化函数
- [x] 实现数据验证函数

### 4.2 业务逻辑
- [ ] 实现喂食建议计算
- [x] 实现体重变化分析
  - [x] 计算生长速度
  - [ ] 预测成年体重
  - [ ] 异常体重提醒
- [x] 实现蜕皮周期分析
  - [x] 计算蜕皮间隔
  - [x] 预测下次蜕皮
  - [ ] 异常情况识别
- [ ] 实现繁殖成功率分析

## 5. 测试

### 5.1 单元测试
- [ ] 测试 Store 功能
- [ ] 测试工具函数
- [ ] 测试组件渲染
- [ ] 测试用户交互

### 5.2 集成测试
- [ ] 测试页面流程
- [ ] 测试数据流转
- [ ] 测试状态管理

## 6. 文档

### 6.1 开发文档
- [x] 编写组件文档
- [x] 编写 Store 文档
- [x] 编写工具函数文档
- [ ] 编写测试文档

### 6.2 用户文档
- [ ] 编写用户指南
- [ ] 编写功能说明
- [ ] 编写常见问题
- [ ] 编写故障排除指南

## 优先级
1. 实现数据可视化功能
   - 体重变化图表
   - 蜕皮周期图表
2. 实现繁殖记录功能
3. 实现统计分析功能
4. 添加数据备份恢复
5. 添加测试
6. 完善文档

## 7. Electron改造建议

### 7.1 文件系统优化
- [ ] 改进文件导出功能
  - 使用Electron的`dialog`模块显示文件保存对话框
  - 使用Node.js的`fs`模块直接保存文件
  - 添加默认保存路径
  - 记住上次保存位置
- [ ] 改进文件导入功能
  - 使用系统原生文件选择对话框
  - 支持拖拽导入
  - 添加文件格式验证

### 7.2 用户体验优化
- [ ] 添加系统托盘功能
  - 最小化到托盘
  - 托盘菜单快捷操作
  - 托盘图标状态显示
- [ ] 添加快捷键支持
  - 常用操作快捷键
  - 自定义快捷键设置
- [ ] 添加窗口管理
  - 记住窗口位置和大小
  - 多窗口支持
  - 窗口状态恢复

### 7.3 数据存储优化
- [ ] 改进数据存储机制
  - 使用electron-store替代localStorage
  - 实现数据自动备份
  - 添加数据加密功能
- [ ] 添加数据同步功能
  - 支持多设备数据同步
  - 云端备份选项
  - 数据冲突解决

### 7.4 性能优化
- [ ] 优化应用启动速度
  - 实现按需加载
  - 优化资源加载
  - 添加启动画面
- [ ] 优化内存使用
  - 实现资源释放
  - 优化大文件处理
  - 添加内存监控

注意：以上功能均为建议，可根据实际需求选择性实现。优先级较低，可在基础功能完善后考虑。 