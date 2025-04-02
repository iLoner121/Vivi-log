import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { setupSnakeIPC } from './ipc/snake';
import http from 'http';

let mainWindow: BrowserWindow | null = null;

// 尝试获取 Vite 开发服务器的实际端口
async function getVitePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    // 尝试从 5173 开始，最多尝试 10 个端口
    const tryPort = (port: number, maxAttempts: number = 10) => {
      if (port > 5173 + maxAttempts) {
        reject(new Error('无法找到可用的 Vite 开发服务器端口'));
        return;
      }

      const server = http.createServer();
      
      server.once('error', () => {
        // 端口被占用，尝试下一个端口
        tryPort(port + 1);
      });

      server.once('listening', () => {
        server.close();
        resolve(port);
      });

      server.listen(port);
    };

    tryPort(5173);
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
  });

  // 根据环境加载不同的URL
  if (process.env.NODE_ENV === 'development') {
    try {
      const port = await getVitePort();
      console.log(`Vite 开发服务器运行在端口: ${port}`);
      await mainWindow.loadURL(`http://localhost:${port}`);
      mainWindow.webContents.openDevTools();
    } catch (error) {
      console.error('Failed to load URL:', error);
      // 如果加载失败，等待 1 秒后重试
      setTimeout(createWindow, 1000);
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  setupSnakeIPC();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 