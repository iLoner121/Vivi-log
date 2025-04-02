import { Snake } from '../../shared/types/snake';

// 模拟数据，仅用于开发测试
const mockSnakes: Snake[] = [
  {
    id: 1,
    name: '小白',
    code: 'S001',
    species: '球蟒',
    gender: 'male',
    birthDate: new Date('2021-01-01'),
    source: '宠物店',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let nextId = 2;

// 开发环境下使用模拟数据
const isDev = process.env.NODE_ENV === 'development';

declare global {
  interface Window {
    api: {
      invoke(channel: string, ...args: any[]): Promise<any>;
    };
  }
}

const checkApi = () => {
  console.log('Checking window.api...');
  console.log('window.api:', window.api);
  if (!window.api) {
    throw new Error('window.api 未初始化，请检查 preload 脚本是否正确加载');
  }
};

export const snakeApi = {
  async getAll(): Promise<Snake[]> {
    if (isDev) {
      console.log('开发环境使用模拟数据');
      return Promise.resolve([...mockSnakes]);
    }
    return window.api.invoke('snake:getAll');
  },

  async getById(id: number): Promise<Snake> {
    if (isDev) {
      const snake = mockSnakes.find(s => s.id === id);
      if (!snake) throw new Error('爬宠不存在');
      return Promise.resolve({...snake});
    }
    return window.api.invoke('snake:getById', id);
  },

  async create(data: Omit<Snake, 'id' | 'createdAt' | 'updatedAt'>): Promise<Snake> {
    if (isDev) {
      const newSnake: Snake = {
        ...data,
        id: nextId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockSnakes.push(newSnake);
      return Promise.resolve({...newSnake});
    }
    return window.api.invoke('snake:create', data);
  },

  async update(id: number, data: Partial<Snake>): Promise<Snake> {
    if (isDev) {
      const index = mockSnakes.findIndex(s => s.id === id);
      if (index === -1) throw new Error('爬宠不存在');
      
      mockSnakes[index] = {
        ...mockSnakes[index],
        ...data,
        updatedAt: new Date()
      };
      return Promise.resolve({...mockSnakes[index]});
    }
    return window.api.invoke('snake:update', id, data);
  },

  async delete(id: number): Promise<void> {
    if (isDev) {
      const index = mockSnakes.findIndex(s => s.id === id);
      if (index === -1) throw new Error('爬宠不存在');
      mockSnakes.splice(index, 1);
      return Promise.resolve();
    }
    return window.api.invoke('snake:delete', id);
  },
}; 