import { Snake } from '../../shared/types/snake';

// 开发环境检测
const isDev = process.env.NODE_ENV === 'development';

// 生成蛇编号：S + 三位数字（从S001开始）
const generateSnakeCode = (lastId: number): string => {
  const numStr = String(lastId).padStart(3, '0');
  return `S${numStr}`;
};

// 模拟数据持久化存储
class LocalStorageDB {
  private storageKey = 'vivi-log-snakes';
  private snakes: Snake[] = [];
  private nextId = 1;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.snakes = JSON.parse(data).map((s: any) => ({
          ...s,
          birthDate: s.birthDate,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt
        }));
        
        // 找出最大ID，用于自增ID计算
        this.nextId = this.snakes.reduce((max, snake) => Math.max(max, (snake.id || 0) + 1), 1);
      }
    } catch (error) {
      console.error('从LocalStorage加载数据失败:', error);
      this.snakes = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.snakes));
    } catch (error) {
      console.error('保存数据到LocalStorage失败:', error);
    }
  }

  getAll(): Snake[] {
    return [...this.snakes];
  }

  getById(id: number): Snake {
    const snake = this.snakes.find(s => s.id === id);
    if (!snake) throw new Error('爬宠不存在');
    return {...snake};
  }

  create(data: Omit<Snake, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Snake {
    const now = new Date().toISOString();
    const newId = this.nextId++;
    const newSnake: Snake = {
      ...data,
      id: newId,
      code: generateSnakeCode(newId),
      createdAt: now,
      updatedAt: now
    };
    this.snakes.push(newSnake);
    this.saveToStorage();
    return {...newSnake};
  }

  update(id: number, data: Partial<Omit<Snake, 'code'>>): Snake {
    const index = this.snakes.findIndex(s => s.id === id);
    if (index === -1) throw new Error('爬宠不存在');
    
    const now = new Date().toISOString();
    this.snakes[index] = {
      ...this.snakes[index],
      ...data,
      // 确保编号不被修改
      code: this.snakes[index].code,
      updatedAt: now
    };
    this.saveToStorage();
    return {...this.snakes[index]};
  }

  delete(id: number): void {
    const index = this.snakes.findIndex(s => s.id === id);
    if (index === -1) throw new Error('爬宠不存在');
    this.snakes.splice(index, 1);
    this.saveToStorage();
  }
}

// 创建持久化数据库实例
const localDb = new LocalStorageDB();

declare global {
  interface Window {
    api?: {
      invoke(channel: string, ...args: any[]): Promise<any>;
    };
  }
}

// 检查API是否可用，开发环境下不会抛出错误
const checkApi = () => {
  if (isDev) {
    if (!window.api) {
      console.warn('开发环境中 window.api 未初始化，使用 localStorage 存储数据');
      return false;
    }
  } else if (!window.api) {
    throw new Error('window.api 未初始化，请检查 preload 脚本是否正确加载');
  }
  return true;
};

export const snakeApi = {
  async getAll(): Promise<Snake[]> {
    if (isDev && !checkApi()) {
      console.log('开发环境使用 localStorage 存储的数据');
      return Promise.resolve(localDb.getAll());
    }
    return window.api!.invoke('snake:getAll');
  },

  async getById(id: number): Promise<Snake> {
    if (isDev && !checkApi()) {
      return Promise.resolve(localDb.getById(id));
    }
    return window.api!.invoke('snake:getById', id);
  },

  async create(data: Omit<Snake, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Snake> {
    if (isDev && !checkApi()) {
      return Promise.resolve(localDb.create(data));
    }
    return window.api!.invoke('snake:create', data);
  },

  async update(id: number, data: Partial<Omit<Snake, 'code'>>): Promise<Snake> {
    if (isDev && !checkApi()) {
      return Promise.resolve(localDb.update(id, data));
    }
    return window.api!.invoke('snake:update', id, data);
  },

  async delete(id: number): Promise<void> {
    if (isDev && !checkApi()) {
      return Promise.resolve(localDb.delete(id));
    }
    return window.api!.invoke('snake:delete', id);
  },
}; 