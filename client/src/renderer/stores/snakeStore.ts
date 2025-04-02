import { create } from 'zustand';
import { Snake, SnakeFilter } from '../../shared/types/snake';

interface SnakeState {
  snakes: Snake[];
  loading: boolean;
  filter: SnakeFilter;
  selectedSnake: Snake | null;
  setSnakes: (snakes: Snake[]) => void;
  addSnake: (snake: Snake) => void;
  updateSnake: (snake: Snake) => void;
  deleteSnake: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: SnakeFilter) => void;
  setSelectedSnake: (snake: Snake | null) => void;
}

export const useSnakeStore = create<SnakeState>((set) => ({
  snakes: [],
  loading: false,
  filter: {},
  selectedSnake: null,
  setSnakes: (snakes) => set({ snakes }),
  addSnake: (snake) => set((state) => ({ snakes: [...state.snakes, snake] })),
  updateSnake: (snake) =>
    set((state) => ({
      snakes: state.snakes.map((s) => (s.id === snake.id ? snake : s)),
    })),
  deleteSnake: (id) =>
    set((state) => ({
      snakes: state.snakes.filter((s) => s.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setFilter: (filter) => set({ filter }),
  setSelectedSnake: (snake) => set({ selectedSnake: snake }),
})); 