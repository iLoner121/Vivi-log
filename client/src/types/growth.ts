export interface WeightRecord {
  id: number;
  snakeId: number;
  weight: number; // 体重（克）
  date: string; // 记录日期
  notes?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

export interface SheddingRecord {
  id: number;
  snakeId: number;
  date: string; // 蜕皮日期
  isComplete: boolean; // 是否完整蜕皮
  notes?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

export interface GrowthState {
  weightRecords: WeightRecord[];
  sheddingRecords: SheddingRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: WeightRecord | SheddingRecord | null;
  calculateGrowthRate: (weights: number[], dates: string[]) => number;
  predictNextShedding: () => { predictedDate: Date; confidence: number } | null;
  getGrowthChartData: (snakeId: number) => GrowthChartData;
  fetchWeightRecords: () => Promise<void>;
  fetchSheddingRecords: () => Promise<void>;
  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => Promise<void>;
  updateWeightRecord: (id: number, updates: Partial<WeightRecord>) => Promise<void>;
  deleteWeightRecord: (id: number) => Promise<void>;
  addSheddingRecord: (record: Omit<SheddingRecord, 'id'>) => Promise<void>;
  updateSheddingRecord: (id: number, updates: Partial<SheddingRecord>) => Promise<void>;
  deleteSheddingRecord: (id: number) => Promise<void>;
}

export interface GrowthChartData {
  dates: string[];
  weights: number[];
  sheddingDates: string[];
} 