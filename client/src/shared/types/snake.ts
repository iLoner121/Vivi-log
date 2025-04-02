export type Gender = 'male' | 'female' | 'unknown';

export interface Snake {
  id?: number;
  name: string;
  code: string;
  species: string;
  gene?: string;
  gender: Gender;
  birthDate: Date;
  source: string;
  price?: number;
  length?: number;
  weight?: number;
  color?: string;
  pattern?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SnakeFormData extends Omit<Snake, 'birthDate' | 'createdAt' | 'updatedAt'> {
  birthDate: string;
}

export interface SnakeFilter {
  searchText?: string;
  species?: string;
  gender?: Gender;
  startDate?: Date;
  endDate?: Date;
} 