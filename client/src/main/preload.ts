import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script is running...');

// 确保 API 被正确导出
contextBridge.exposeInMainWorld('api', {
  invoke: (channel: string, ...args: any[]) => {
    console.log('Preload: 调用 IPC 通道:', channel, '参数:', args);
    return ipcRenderer.invoke(channel, ...args);
  },
});

console.log('API has been exposed to window object'); 