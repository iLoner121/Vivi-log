import { ipcMain } from 'electron';
import { snakeService } from '../services/database';

export function setupSnakeIPC() {
  // 获取所有爬宠
  ipcMain.handle('snake:getAll', async () => {
    try {
      console.log('正在获取爬宠列表...');
      const result = await snakeService.getAll();
      console.log('获取爬宠列表成功:', result);
      return result;
    } catch (error) {
      console.error('获取爬宠列表失败:', error);
      throw error;
    }
  });

  // 获取单个爬宠
  ipcMain.handle('snake:getById', async (_, id: number) => {
    try {
      console.log('正在获取爬宠详情, ID:', id);
      const result = await snakeService.getById(id);
      console.log('获取爬宠详情成功:', result);
      return result;
    } catch (error) {
      console.error('获取爬宠详情失败:', error);
      throw error;
    }
  });

  // 创建爬宠
  ipcMain.handle('snake:create', async (_, data: any) => {
    try {
      console.log('正在创建爬宠, 数据:', data);
      const result = await snakeService.create(data);
      console.log('创建爬宠成功:', result);
      return result;
    } catch (error) {
      console.error('创建爬宠失败:', error);
      throw error;
    }
  });

  // 更新爬宠
  ipcMain.handle('snake:update', async (_, id: number, data: any) => {
    try {
      console.log('正在更新爬宠, ID:', id, '数据:', data);
      const result = await snakeService.update(id, data);
      console.log('更新爬宠成功:', result);
      return result;
    } catch (error) {
      console.error('更新爬宠失败:', error);
      throw error;
    }
  });

  // 删除爬宠
  ipcMain.handle('snake:delete', async (_, id: number) => {
    try {
      console.log('正在删除爬宠, ID:', id);
      const result = await snakeService.delete(id);
      console.log('删除爬宠成功:', result);
      return result;
    } catch (error) {
      console.error('删除爬宠失败:', error);
      throw error;
    }
  });
} 