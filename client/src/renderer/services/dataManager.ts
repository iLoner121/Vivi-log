import { snakeStorage } from './storage';

// 存储键名前缀，用于识别系统相关的所有数据
const STORAGE_PREFIX = 'vivi-log:';

/**
 * 数据管理服务
 * 提供数据清理和导入导出功能
 */
export const dataManager = {
  /**
   * 清理所有系统数据
   */
  clearAllData: () => {
    try {
      // 获取所有 localStorage 键
      const keys = Object.keys(localStorage);
      
      // 删除所有以系统前缀开头的键
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
          console.log(`已删除: ${key}`);
        }
      });
      
      console.log('所有系统数据已清理');
      return true;
    } catch (error) {
      console.error('清理数据失败:', error);
      return false;
    }
  },
  
  /**
   * 导出所有数据为 JSON 字符串
   */
  exportData: () => {
    try {
      // 获取所有系统数据
      const data = {
        snakes: snakeStorage.getAll(),
        // 未来可以添加其他数据
        // feedings: feedingStorage.getAll(),
        // sheddings: sheddingStorage.getAll(),
        // breedings: breedingStorage.getAll(),
      };
      
      // 转换为 JSON 字符串
      const jsonString = JSON.stringify(data, null, 2);
      
      // 创建 Blob 对象
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vivi-log-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('数据导出成功');
      return true;
    } catch (error) {
      console.error('导出数据失败:', error);
      return false;
    }
  },
  
  /**
   * 从 JSON 字符串导入数据
   */
  importData: (jsonString: string) => {
    try {
      // 解析 JSON 字符串
      const data = JSON.parse(jsonString);
      
      // 清理现有数据
      dataManager.clearAllData();
      
      // 导入蛇类数据
      if (data.snakes && Array.isArray(data.snakes)) {
        data.snakes.forEach((snake: any) => {
          // 移除 id 和 code，让系统重新生成
          const { id, code, ...snakeData } = snake;
          snakeStorage.create(snakeData);
        });
      }
      
      // 未来可以添加其他数据的导入
      // if (data.feedings && Array.isArray(data.feedings)) {
      //   data.feedings.forEach((feeding: any) => {
      //     const { id, ...feedingData } = feeding;
      //     feedingStorage.create(feedingData);
      //   });
      // }
      
      console.log('数据导入成功');
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  },
  
  /**
   * 从文件导入数据
   */
  importFromFile: (file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const success = dataManager.importData(jsonString);
          resolve(success);
        } catch (error) {
          console.error('从文件导入数据失败:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('读取文件失败');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }
}; 