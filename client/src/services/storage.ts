import { Snake } from '../shared/types/snake';
import { Feeding, Shedding, Breeding } from '../types';

// 存储键名常量
const STORAGE_KEYS = {
  SNAKES: 'vivi-log:snakes',
  FEEDINGS: 'vivi-log:feedings',
  SHEDDINGS: 'vivi-log:sheddings',
  BREEDINGS: 'vivi-log:breedings',
} as const;

// 通用存储操作类
class StorageService<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // 获取所有数据
  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting data from ${this.key}:`, error);
      return [];
    }
  }

  // 根据 ID 获取数据
  getById(id: number): T | null {
    const items = this.getAll();
    return items.find((item: any) => item.id === id) || null;
  }

  // 创建新数据
  create(item: Omit<T, 'id'>): T {
    const items = this.getAll();
    const newItem = {
      ...item,
      id: this.generateId(items),
    } as T;
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  // 更新数据
  update(id: number, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    this.saveAll(items);
    return updatedItem;
  }

  // 删除数据
  delete(id: number): boolean {
    const items = this.getAll();
    const filteredItems = items.filter((item: any) => item.id !== id);
    if (filteredItems.length === items.length) return false;
    this.saveAll(filteredItems);
    return true;
  }

  // 保存所有数据
  protected saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving data to ${this.key}:`, error);
    }
  }

  // 生成新的 ID
  protected generateId(items: T[]): number {
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map((item: any) => item.id));
    return maxId + 1;
  }
}

// 蛇类存储服务，扩展了通用存储服务
class SnakeStorageService extends StorageService<Snake> {
  constructor() {
    super(STORAGE_KEYS.SNAKES);
  }

  // 重写创建方法，添加自动生成编号的逻辑
  create(item: Omit<Snake, 'id'>): Snake {
    const items = this.getAll();
    const newCode = this.generateSnakeCode(items);
    const newItem = {
      ...item,
      id: this.generateId(items),
      code: newCode,
    } as Snake;
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  // 重写更新方法，保留原有编号
  update(id: number, updates: Partial<Omit<Snake, 'id' | 'code'>>): Snake | null {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return null;

    // 保留原有的编号
    const { code, ...restUpdates } = updates as any;
    const updatedItem = { ...items[index], ...restUpdates };
    items[index] = updatedItem;
    this.saveAll(items);
    return updatedItem;
  }

  // 生成蛇的编号 (S001, S002, ...)
  private generateSnakeCode(items: Snake[]): string {
    if (items.length === 0) return 'S001';
    
    // 提取所有编号中的数字部分
    const codes = items.map(item => {
      const match = item.code.match(/S(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    // 找出最大编号
    const maxCode = Math.max(...codes);
    
    // 生成新编号，确保是三位数
    const newCode = maxCode + 1;
    return `S${newCode.toString().padStart(3, '0')}`;
  }
}

// 导出具体的存储服务实例
export const snakeStorage = new SnakeStorageService();
export const feedingStorage = new StorageService<Feeding>(STORAGE_KEYS.FEEDINGS);
export const sheddingStorage = new StorageService<Shedding>(STORAGE_KEYS.SHEDDINGS);
export const breedingStorage = new StorageService<Breeding>(STORAGE_KEYS.BREEDINGS);

// 导出存储服务类（用于测试或创建新的存储实例）
export { StorageService, SnakeStorageService }; 