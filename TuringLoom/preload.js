// 预加载脚本在渲染进程加载之前运行，并且可以访问两个环境的 API
// 它被打包成一个单独的文件，并通过 BrowserWindow 的 webPreferences.preload 选项加载

// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});