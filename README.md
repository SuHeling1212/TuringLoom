# TuringLoom - 图灵机模拟器

一个美观、功能丰富的图灵机可视化模拟器，支持 JavaFX、Electron 桌面应用和 Web 三种运行方式。

---

## 项目简介

TuringLoom 是一个基于 React + TypeScript + Tailwind CSS + Spring Boot 构建的图灵机可视化模拟器。它提供了直观的图形界面，让用户能够轻松创建、编辑和运行图灵机程序，是学习计算理论和形式语言课程的理想工具。

## 核心功能

- **规则编辑** - 可视化创建、编辑、删除图灵机规则，支持状态转换、符号读写、移动方向等配置
- **多纸带支持** - 支持创建多条独立纸带，每条纸带可单独设置初始内容和名称
- **规则导入/导出** - 支持将规则配置导出为 JSON 文件，也可从 JSON 文件导入规则
- **国际化** - 完整支持中文/英文界面切换，自动保存语言偏好
- **模拟控制** - 提供单步执行、自动运行、速度调节、重置等完整的模拟控制功能
- **可视化** - 实时显示纸带状态、读写头位置、当前状态，动画效果流畅
- **通配符规则** - 支持 `readAny` 和 `stateAny` 通配符，匹配任意符号或状态

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 3.4 |
| 动画库 | Framer Motion |
| 后端框架 | Spring Boot 4.0 |
| 运行环境 | Java 26 |
| 桌面框架 | JavaFX / Electron |
| 包管理器 | pnpm / Maven |

## 项目结构

```
TuringLoom/
├── TuringLoom/                    # 前端项目 (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/            # React 组件
│   │   │   └── turing-machine/    # 图灵机核心组件
│   │   │       ├── ControlPanel.tsx  # 控制面板
│   │   │       ├── RuleEditor.tsx    # 规则编辑器
│   │   │       └── TapeSimulator.tsx # 纸带模拟器
│   │   ├── lib/                   # 工具库
│   │   │   ├── api.ts             # 后端 API 调用
│   │   │   ├── locales.ts         # 国际化文本
│   │   │   ├── types.ts           # TypeScript 类型定义
│   │   │   └── utils.ts           # 工具函数
│   │   ├── pages/
│   │   │   └── Home.tsx           # 主页面
│   │   ├── App.tsx                # 应用入口
│   │   └── main.tsx               # React 渲染入口
│   ├── examples/                  # 示例规则文件
│   │   └── hello-world.json       # Hello World 示例
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── turing-machine-core/           # Java 核心库
│   ├── src/main/java/com/follarce/
│   │   ├── TuringMachineApi.java  # 核心 API
│   │   ├── machine/
│   │   │   └── TuringMachine.java # 图灵机执行引擎
│   │   └── model/
│   │       ├── MachineConfiguration.java
│   │       ├── MoveDirection.java
│   │       ├── TapeState.java
│   │       └── TuringMachineRule.java
│   └── pom.xml
│
├── turing-machine-server/         # Spring Boot 后端服务
│   ├── src/main/java/com/follarce/server/
│   │   ├── TuringMachineServerApplication.java
│   │   ├── controller/
│   │   │   └── TuringMachineController.java  # REST API
│   │   ├── dto/
│   │   │   ├── MachineRequest.java
│   │   │   └── MachineResponse.java
│   │   ├── model/                 # 数据模型
│   │   └── service/
│   │       └── TuringMachineService.java  # 业务逻辑
│   └── pom.xml
│
├── turing-machine-desktop/        # JavaFX 桌面应用
│   ├── src/main/java/com/follarce/desktop/
│   │   └── DesktopApplication.java  # 桌面应用入口
│   ├── src/main/resources/
│   │   ├── application.yml        # 应用配置
│   │   └── static/                # 前端构建产物
│   └── pom.xml
│
├── turing-machine-electron/       # Electron 桌面应用
│   ├── main.js                    # Electron 主进程
│   ├── preload.js                 # 预加载脚本
│   ├── package.json               # 项目配置
│   ├── build.sh                   # 构建脚本
│   ├── start.sh                   # 启动脚本
│   └── dist.sh                    # 打包脚本
│
├── start.sh                       # 前端开发启动脚本
├── start-all.sh                   # 前后端同时启动脚本
├── run.sh                         # 后端服务启动脚本
├── run-desktop.sh                 # JavaFX 桌面应用启动脚本
├── run-electron.sh                # Electron 桌面应用启动脚本
└── 读我.md                        # 中文文档
```

## 运行方式

### 方式一：JavaFX 桌面应用

```bash
# 确保已安装 Java 26+ 和 Maven
cd turing-machine-desktop
mvn clean package -DskipTests
java --enable-native-access=ALL-UNNAMED -jar target/turing-machine-desktop-1.0.0.jar
```

或使用启动脚本：

```bash
./run-desktop.sh
```

### 方式二：Electron 桌面应用（内置 Java，无需安装）

```bash
# 确保已安装 Node.js 18+ 和 pnpm
cd turing-machine-electron
./build-full.sh    # 完整构建（包含嵌入式 JRE）
```

或使用启动脚本：

```bash
./run-electron.sh
```

打包分发（用户无需安装 Java）：

```bash
cd turing-machine-electron
./build-full.sh        # 一键构建所有平台
# 或单独打包
pnpm dist:mac          # macOS (DMG + ZIP)
pnpm dist:win          # Windows (安装包 + 便携版)
pnpm dist:linux        # Linux (AppImage + DEB)
```

### 方式三：Web 开发模式

```bash
# 终端 1：启动后端服务
cd turing-machine-server
mvn spring-boot:run

# 终端 2：启动前端开发服务器
cd TuringLoom
pnpm install
pnpm dev
```

### 方式四：Web 生产模式

```bash
# 构建前端
cd TuringLoom
pnpm build

# 启动后端服务（自动提供前端页面）
cd turing-machine-server
mvn spring-boot:run
# 访问 http://localhost:8888
```

## 规则配置说明

每条图灵机规则包含以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | string | 规则名称 |
| `tapeIndex` | number | 目标纸带索引（从 0 开始） |
| `currentState` | string | 当前状态（如 `q0`） |
| `readSymbol` | string | 读取的符号（单个字符） |
| `readAny` | boolean | 匹配任意符号 |
| `stateAny` | boolean | 匹配任意状态 |
| `writeSymbol` | string | 写入的符号（单个字符） |
| `moveDirection` | 'left' \| 'right' \| 'stay' | 读写头移动方向 |
| `newState` | string | 转换后的新状态 |
| `shouldHalt` | boolean | 是否停机 |

## 使用指南

1. **创建纸带** - 点击右上角「新建纸带」按钮
2. **设置初始内容** - 在纸带输入框中输入初始符号序列
3. **添加规则** - 在左侧规则编辑面板中创建转换规则
4. **运行模拟** - 点击「单步」逐条执行，或点击「运行」自动执行
5. **导入/导出** - 使用控制面板保存或加载规则配置

## 作者

**SuHeling**

## 许可证

本项目基于 MIT 许可证开源。
