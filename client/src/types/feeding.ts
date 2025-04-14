export interface Feeding {
  id: number
  snakeId: number
  date: string
  foodType: string
  weight: number
  quantity: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface FeedingFormData {
  snakeId: number
  date: string
  foodType: string
  weight: number
  quantity: number
  notes?: string
}

export interface FeedingFilters {
  snakeId?: number
  startDate?: string
  endDate?: string
  foodType?: string
} 