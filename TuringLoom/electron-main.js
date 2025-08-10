import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被垃圾回收的时候，window对象将会自动关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '图灵机模拟器',
    webPreferences: {
      nodeIntegration: false, // 禁用Node集成
      contextIsolation: true, // 启用上下文隔离
      preload: path.join(__dirname, 'preload.js') // 预加载脚本，使用__dirname确保在打包环境中正确定位
    }
  });

  // 加载应用的index.html
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
     : url.format({
           pathname: path.join(app.getAppPath(), 'static/index.html'),
           protocol: 'file:',
           slashes: true
       });

   mainWindow.loadURL(startUrl)
    .then(() => {
      console.log('Window loaded successfully');
    })
    .catch((err) => {
      console.error('Failed to load window:', err);
      // 如果加载失败，显示错误信息
      mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(`Failed to load URL: ${errorCode} - ${errorDescription}`);
        mainWindow.webContents.executeJavaScript(`
          document.body.innerHTML = \`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: red;">
              <h1>加载失败</h1>
              <p>错误代码: ${errorCode}</p>
              <p>错误描述: ${errorDescription}</p>
            </div>
          \`;
        `);
      });
    });

  // 打开开发者工具
  // mainWindow.webContents.openDevTools();

  // 当window被关闭，这个事件会被触发。
  mainWindow.on('closed', () => {
    // 取消引用window对象，如果你的应用支持多窗口的话，
    // 通常会把多个window对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null;
  });
}

// Electron会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分API在ready事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 当所有窗口关闭时自动结束进程
  app.quit();
});

app.on('activate', () => {
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，
  // 通常在应用中重新创建一个窗口。
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。