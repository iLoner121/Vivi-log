import type { Dayjs } from 'dayjs';

// 蛇类爬宠基本信息
export interface Snake {
  id: number;
  code: string;
  name: string;
  species: string;
  gene: string;
  gender: 'male' | 'female' | 'unknown';
  birthDate: string;
  source?: string;
  price?: number;
  length?: number;
  weight?: number;
  color?: string;
  pattern?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 蛇类表单数据类型
export interface SnakeFormData {
  name: string;
  species: string;
  gene: string;
  gender: 'male' | 'female' | 'unknown';
  birthDate: Dayjs | null;
  source?: string;
  price?: number;
  length?: number;
  weight?: number;
  color?: string;
  pattern?: string;
  notes?: string;
}

// 喂食记录
export interface Feeding {
  id: number;
  snakeId: number;       // 关联的蛇ID
  date: string;          // 喂食日期
  foodType: string;      // 食物类型
  weight: number;        // 食物重量
  quantity: number;      // 食物数量
  notes?: string;        // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}

// 喂食表单数据类型
export interface FeedingFormData {
  snakeId: number;
  date: string;
  foodType: string;
  weight: number;
  quantity: number;
  notes?: string;
}

// 喂食记录筛选条件
export interface FeedingFilters {
  snakeId?: number;
  startDate?: string;
  endDate?: string;
  foodType?: string;
}

// 体重记录
export interface WeightRecord {
  id: number;
  snakeId: number;
  weight: number; // 体重（克）
  date: string; // 记录日期
  notes?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

// 蜕皮记录
export interface SheddingRecord {
  id: number;
  snakeId: number;
  date: string; // 蜕皮日期
  isComplete: boolean; // 是否完整蜕皮
  notes?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

// 成长记录状态
export interface GrowthState {
  weightRecords: WeightRecord[];
  sheddingRecords: SheddingRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: WeightRecord | SheddingRecord | null;
  calculateGrowthRate: (weights: number[], dates: string[]) => number;
  predictNextShedding: (snakeId: number) => { predictedDate: Date; confidence: number };
  getGrowthChartData: (snakeId: number) => GrowthChartData;
  getWeightRecordsBySnakeId: (snakeId: number) => WeightRecord[];
  getSheddingRecordsBySnakeId: (snakeId: number) => SheddingRecord[];
  fetchWeightRecords: () => Promise<void>;
  fetchSheddingRecords: () => Promise<void>;
  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => Promise<void>;
  updateWeightRecord: (id: number, updates: Partial<WeightRecord>) => Promise<void>;
  deleteWeightRecord: (id: number) => Promise<void>;
  addSheddingRecord: (record: Omit<SheddingRecord, 'id'>) => Promise<void>;
  updateSheddingRecord: (id: number, updates: Partial<SheddingRecord>) => Promise<void>;
  deleteSheddingRecord: (id: number) => Promise<void>;
  calculateStd: (values: number[]) => number;
}

// 成长图表数据
export interface GrowthChartData {
  dates: string[];
  weights: number[];
  sheddingDates: string[];
}

// 繁殖记录
export interface Breeding {
  id: number;
  maleSnakeId: number;   // 公蛇ID
  femaleSnakeId: number; // 母蛇ID
  date: string;          // 配种日期
  result: string;        // 配种结果
  eggsCount?: number;    // 产卵数量
  hatchCount?: number;   // 孵化数量
  notes?: string;        // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
} 