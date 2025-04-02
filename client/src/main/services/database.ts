import { PrismaClient } from '@prisma/client';
import { app } from 'electron';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(app.getPath('userData'), 'dev.db')}`,
    },
  },
});

export const snakeService = {
  async getAll() {
    return prisma.snake.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    return prisma.snake.findUnique({
      where: { id },
    });
  },

  async create(data: any) {
    return prisma.snake.create({
      data,
    });
  },

  async update(id: number, data: any) {
    return prisma.snake.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.snake.delete({
      where: { id },
    });
  },
};

export default prisma; 