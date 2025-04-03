import { create } from 'zustand'
import { Snake, Gender } from '../shared/types/snake'
import { snakeStorage } from '../services/storage'

interface SnakeState {
  // 状态
  snakes: Snake[]
  loading: boolean
  error: string | null
  selectedSnake: Snake | null

  // 操作方法
  fetchSnakes: () => Promise<void>
  getSnakeById: (id: number) => Snake | null
  addSnake: (snake: Omit<Snake, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSnake: (id: number, updates: Partial<Omit<Snake, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Snake | null>
  deleteSnake: (id: number) => Promise<void>
  setSelectedSnake: (snake: Snake | null) => void
}

export const useSnakeStore = create<SnakeState>((set, get) => ({
  // 初始状态
  snakes: [],
  loading: false,
  error: null,
  selectedSnake: null,

  // 获取所有蛇
  fetchSnakes: async () => {
    set({ loading: true, error: null })
    try {
      const snakes = snakeStorage.getAll()
      set({ snakes, loading: false })
    } catch (error) {
      set({ error: '获取数据失败', loading: false })
    }
  },

  // 根据 ID 获取蛇
  getSnakeById: (id: number) => {
    return get().snakes.find(snake => snake.id === id) || null
  },

  // 添加新蛇
  addSnake: async (snakeData) => {
    set({ loading: true, error: null })
    try {
      const now = new Date().toISOString()
      
      // 确保不会覆盖 code 字段
      const { code, ...restData } = snakeData as any;
      
      const newSnake = snakeStorage.create({
        ...restData,
        birthDate: snakeData.birthDate,
        createdAt: now,
        updatedAt: now,
      })
      
      console.log('Added new snake:', newSnake);
      
      set(state => ({ 
        snakes: [...state.snakes, newSnake],
        loading: false 
      }))
    } catch (error) {
      console.error('添加失败:', error);
      set({ error: '添加失败', loading: false })
    }
  },

  // 更新蛇信息
  updateSnake: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedSnake = snakeStorage.update(id, {
        ...updates,
        birthDate: updates.birthDate,
        updatedAt: new Date().toISOString(),
      })
      if (updatedSnake) {
        set(state => ({
          snakes: state.snakes.map(snake => 
            snake.id === id ? updatedSnake : snake
          ),
          selectedSnake: state.selectedSnake?.id === id ? updatedSnake : state.selectedSnake,
          loading: false
        }))
        return updatedSnake
      }
      return null
    } catch (error) {
      set({ error: '更新失败', loading: false })
      return null
    }
  },

  // 删除蛇
  deleteSnake: async (id) => {
    set({ loading: true, error: null })
    try {
      const success = snakeStorage.delete(id)
      if (success) {
        set(state => ({
          snakes: state.snakes.filter(snake => snake.id !== id),
          selectedSnake: state.selectedSnake?.id === id ? null : state.selectedSnake,
          loading: false
        }))
      }
    } catch (error) {
      set({ error: '删除失败', loading: false })
    }
  },

  // 设置选中的蛇
  setSelectedSnake: (snake) => {
    set({ selectedSnake: snake })
  },
})) 