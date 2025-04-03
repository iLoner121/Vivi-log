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

### 1.2 待实现的 Store
- [ ] 实现喂食记录 Store
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

- [ ] 实现成长记录 Store
  ```typescript
  // src/stores/growthStore.ts
  interface GrowthState {
    // 体重记录
    weightRecords: WeightRecord[]
    // 蜕皮记录
    sheddingRecords: SheddingRecord[]
    loading: boolean
    error: string | null
    selectedRecord: WeightRecord | SheddingRecord | null
    
    // 体重记录相关方法
    fetchWeightRecords: () => Promise<void>
    getWeightRecordsBySnakeId: (snakeId: number) => WeightRecord[]
    addWeightRecord: (record: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateWeightRecord: (id: number, updates: Partial<WeightRecord>) => Promise<void>
    deleteWeightRecord: (id: number) => Promise<void>
    
    // 蜕皮记录相关方法
    fetchSheddingRecords: () => Promise<void>
    getSheddingRecordsBySnakeId: (snakeId: number) => SheddingRecord[]
    addSheddingRecord: (record: Omit<SheddingRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateSheddingRecord: (id: number, updates: Partial<SheddingRecord>) => Promise<void>
    deleteSheddingRecord: (id: number) => Promise<void>
    
    // 数据分析方法
    calculateGrowthRate: (snakeId: number) => number
    predictNextShedding: (snakeId: number) => Date
    getGrowthChartData: (snakeId: number) => ChartData
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
- [ ] 实现数据导出功能
  ```typescript
  // src/services/exportService.ts
  export const exportService = {
    exportToExcel: (data: any[], type: string) => {
      // 实现 Excel 导出
    },
    exportToJson: (data: any[], type: string) => {
      // 实现 JSON 导出
    }
  }
  ```

- [ ] 实现数据导入功能
  ```typescript
  // src/services/importService.ts
  export const importService = {
    importFromExcel: (file: File) => {
      // 实现 Excel 导入
    },
    importFromJson: (file: File) => {
      // 实现 JSON 导入
    }
  }
  ```

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
- [ ] 实现喂食记录组件
- [ ] 实现成长记录组件
  - 体重记录表单
  - 蜕皮记录表单
  - 成长曲线图表
  - 蜕皮周期分析
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
- [ ] 实现数据导入导出组件
- [ ] 实现数据备份恢复组件
- [ ] 实现提醒设置组件

## 3. 页面开发

### 3.1 主要页面
- [x] 实现首页
- [x] 实现蛇类管理页面
- [ ] 实现喂食记录页面
- [ ] 实现成长记录页面
  - 体重记录管理
  - 蜕皮记录管理
  - 成长数据分析
- [ ] 实现繁殖记录页面
- [x] 实现数据统计页面
- [x] 实现设置页面

### 3.2 功能页面
- [ ] 实现数据导入导出页面
- [ ] 实现数据备份恢复页面
- [ ] 实现提醒设置页面

## 4. 工具函数开发

### 4.1 数据处理
- [ ] 实现日期处理函数
- [ ] 实现数据格式化函数
- [ ] 实现数据验证函数

### 4.2 业务逻辑
- [ ] 实现喂食建议计算
- [ ] 实现体重变化分析
  - 计算生长速度
  - 预测成年体重
  - 异常体重提醒
- [ ] 实现蜕皮周期分析
  - 计算蜕皮间隔
  - 预测下次蜕皮
  - 异常情况识别
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
- [ ] 编写组件文档
- [ ] 编写 Store 文档
- [ ] 编写工具函数文档
- [ ] 编写测试文档

### 6.2 用户文档
- [ ] 编写用户指南
- [ ] 编写功能说明
- [ ] 编写常见问题
- [ ] 编写故障排除指南

## 优先级
1. 完成成长记录功能（体重记录和蜕皮记录）
2. 实现数据可视化
3. 开发喂食记录功能
4. 实现繁殖记录功能
5. 添加数据导入导出
6. 添加测试
7. 完善文档 