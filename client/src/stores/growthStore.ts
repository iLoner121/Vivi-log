import { create } from 'zustand';
import { GrowthState, WeightRecord, SheddingRecord, GrowthChartData } from '../types/growth';
import { StorageService } from '../services/storage';

const STORAGE_KEY = {
  WEIGHT_RECORDS: 'vivi-log:weight_records',
  SHEDDING_RECORDS: 'vivi-log:shedding_records',
};

const weightStorage = new StorageService<WeightRecord>(STORAGE_KEY.WEIGHT_RECORDS);
const sheddingStorage = new StorageService<SheddingRecord>(STORAGE_KEY.SHEDDING_RECORDS);

export const useGrowthStore = create<GrowthState>((set, get) => ({
  weightRecords: [],
  sheddingRecords: [],
  loading: false,
  error: null,
  selectedRecord: null,

  // 计算标准差
  calculateStd: (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  },

  // 获取体重记录
  fetchWeightRecords: async () => {
    try {
      set({ loading: true, error: null });
      const records = weightStorage.getAll();
      set({ weightRecords: records, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取体重记录失败', loading: false });
    }
  },

  // 获取蜕皮记录
  fetchSheddingRecords: async () => {
    try {
      set({ loading: true, error: null });
      const records = sheddingStorage.getAll();
      set({ sheddingRecords: records, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取蜕皮记录失败', loading: false });
    }
  },

  // 获取指定蛇的体重记录
  getWeightRecordsBySnakeId: (snakeId: number) => {
    const { weightRecords } = get();
    return weightRecords.filter(record => record.snakeId === snakeId);
  },

  // 获取指定蛇的蜕皮记录
  getSheddingRecordsBySnakeId: (snakeId: number) => {
    const { sheddingRecords } = get();
    return sheddingRecords.filter(record => record.snakeId === snakeId);
  },

  // 添加体重记录
  addWeightRecord: async (record: Omit<WeightRecord, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const { weightRecords } = get();
      const newRecord = weightStorage.create(record);
      set({ weightRecords: [...weightRecords, newRecord], loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '添加体重记录失败', loading: false });
    }
  },

  // 添加蜕皮记录
  addSheddingRecord: async (record: Omit<SheddingRecord, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const { sheddingRecords } = get();
      const newRecord = sheddingStorage.create(record);
      set({ sheddingRecords: [...sheddingRecords, newRecord], loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '添加蜕皮记录失败', loading: false });
    }
  },

  // 更新体重记录
  updateWeightRecord: async (id: number, updates: Partial<WeightRecord>) => {
    try {
      set({ loading: true, error: null });
      const { weightRecords } = get();
      const updatedRecord = weightStorage.update(id, updates);
      if (!updatedRecord) {
        throw new Error('未找到要更新的记录');
      }
      const updatedRecords = weightRecords.map(record =>
        record.id === id ? updatedRecord : record
      );
      set({ weightRecords: updatedRecords, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '更新体重记录失败', loading: false });
    }
  },

  // 更新蜕皮记录
  updateSheddingRecord: async (id: number, updates: Partial<SheddingRecord>) => {
    try {
      set({ loading: true, error: null });
      const { sheddingRecords } = get();
      const updatedRecord = sheddingStorage.update(id, updates);
      if (!updatedRecord) {
        throw new Error('未找到要更新的记录');
      }
      const updatedRecords = sheddingRecords.map(record =>
        record.id === id ? updatedRecord : record
      );
      set({ sheddingRecords: updatedRecords, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '更新蜕皮记录失败', loading: false });
    }
  },

  // 删除体重记录
  deleteWeightRecord: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const { weightRecords } = get();
      const success = weightStorage.delete(id);
      if (!success) {
        throw new Error('未找到要删除的记录');
      }
      const updatedRecords = weightRecords.filter(record => record.id !== id);
      set({ weightRecords: updatedRecords, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '删除体重记录失败', loading: false });
    }
  },

  // 删除蜕皮记录
  deleteSheddingRecord: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const { sheddingRecords } = get();
      const success = sheddingStorage.delete(id);
      if (!success) {
        throw new Error('未找到要删除的记录');
      }
      const updatedRecords = sheddingRecords.filter(record => record.id !== id);
      set({ sheddingRecords: updatedRecords, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '删除蜕皮记录失败', loading: false });
    }
  },

  // 计算生长率
  calculateGrowthRate: (weights: number[], dates: string[]): number => {
    if (weights.length < 2) return 0;
    
    const growthRates = [];
    for (let i = 1; i < weights.length; i++) {
      const days = (new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime()) / (1000 * 60 * 60 * 24);
      const growthRate = (weights[i] - weights[i-1]) / days;
      growthRates.push(growthRate);
    }
    
    return get().calculateStd(growthRates);
  },

  // 预测下次蜕皮时间
  predictNextShedding: () => {
    const { sheddingRecords, calculateStd } = get();
    if (sheddingRecords.length < 2) {
      return null;
    }

    const sortedRecords = [...sheddingRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const intervals = [];
    for (let i = 1; i < sortedRecords.length; i++) {
      const prevDate = new Date(sortedRecords[i - 1].date);
      const currDate = new Date(sortedRecords[i].date);
      const interval = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const lastShedding = new Date(sortedRecords[sortedRecords.length - 1].date);
    const nextShedding = new Date(lastShedding.getTime() + avgInterval * 24 * 60 * 60 * 1000);

    return {
      predictedDate: nextShedding,
      confidence: 1 - (calculateStd(intervals) / avgInterval) // 简单的置信度计算
    };
  },

  // 获取生长图表数据
  getGrowthChartData: (snakeId: number): GrowthChartData => {
    const { weightRecords, sheddingRecords } = get();
    
    // 获取指定蛇的体重记录
    const snakeWeightRecords = weightRecords
      .filter(record => record.snakeId === snakeId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 获取指定蛇的蜕皮记录
    const snakeSheddingRecords = sheddingRecords
      .filter(record => record.snakeId === snakeId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      dates: snakeWeightRecords.map(record => record.date),
      weights: snakeWeightRecords.map(record => record.weight),
      sheddingDates: snakeSheddingRecords.map(record => record.date)
    };
  },
})); 