import { create } from 'zustand'
import { Feeding, FeedingFormData, FeedingFilters } from '../types/feeding'
import { StorageService } from '../services/storage'

const feedingStorage = new StorageService<Feeding>('vivi-log:feedings')

interface FeedingState {
  feedings: Feeding[]
  loading: boolean
  error: string | null
  selectedFeeding: Feeding | null
  filters: FeedingFilters
  
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedFeeding: (feeding: Feeding | null) => void
  setFilters: (filters: FeedingFilters) => void
  
  // CRUD Operations
  fetchFeedings: () => Promise<void>
  getFeedingsBySnakeId: (snakeId: number) => Feeding[]
  addFeeding: (feeding: FeedingFormData) => Promise<void>
  updateFeeding: (id: number, updates: Partial<Feeding>) => Promise<void>
  deleteFeeding: (id: number) => Promise<void>
}

export const useFeedingStore = create<FeedingState>((set, get) => ({
  feedings: [],
  loading: false,
  error: null,
  selectedFeeding: null,
  filters: {},
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedFeeding: (feeding) => set({ selectedFeeding: feeding }),
  setFilters: (filters) => set({ filters }),
  
  fetchFeedings: async () => {
    try {
      set({ loading: true, error: null })
      const feedings = feedingStorage.getAll()
      set({ feedings })
    } catch (error) {
      set({ error: '获取喂食记录失败' })
    } finally {
      set({ loading: false })
    }
  },
  
  getFeedingsBySnakeId: (snakeId) => {
    const { feedings, filters } = get()
    return feedings.filter(feeding => {
      if (feeding.snakeId !== snakeId) return false
      if (filters.startDate && feeding.date < filters.startDate) return false
      if (filters.endDate && feeding.date > filters.endDate) return false
      if (filters.foodType && feeding.foodType !== filters.foodType) return false
      return true
    })
  },
  
  addFeeding: async (feeding) => {
    try {
      set({ loading: true, error: null })
      const newFeeding = feedingStorage.create({
        ...feeding,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      set(state => ({ feedings: [...state.feedings, newFeeding] }))
    } catch (error) {
      set({ error: '添加喂食记录失败' })
    } finally {
      set({ loading: false })
    }
  },
  
  updateFeeding: async (id, updates) => {
    try {
      set({ loading: true, error: null })
      const updatedFeeding = feedingStorage.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      if (updatedFeeding) {
        set(state => ({
          feedings: state.feedings.map(feeding => 
            feeding.id === id ? updatedFeeding : feeding
          )
        }))
      }
    } catch (error) {
      set({ error: '更新喂食记录失败' })
    } finally {
      set({ loading: false })
    }
  },
  
  deleteFeeding: async (id) => {
    try {
      set({ loading: true, error: null })
      const success = feedingStorage.delete(id)
      if (success) {
        set(state => ({
          feedings: state.feedings.filter(feeding => feeding.id !== id)
        }))
      }
    } catch (error) {
      set({ error: '删除喂食记录失败' })
    } finally {
      set({ loading: false })
    }
  }
})) 