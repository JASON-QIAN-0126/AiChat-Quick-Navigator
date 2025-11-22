<h1 align="center">AI Chat Prompt Navigator</h1>

<p align="center">
  <strong>让 AI 对话导航变得简单高效</strong>
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-README-green"></a>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/中文-README-blue"></a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ChatGPT-74aa9c?logo=openai&logoColor=white" alt="ChatGPT">
  <img src="https://img.shields.io/badge/Claude-191919?logo=anthropic&logoColor=white" alt="Claude">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?logo=google&logoColor=white" alt="Gemini">
</p>

---

### 📖 这是什么？

在使用 ChatGPT、Claude、Gemini 等 AI 聊天工具时，您是否遇到过这些困扰：

- 💬 **对话太长**，想回看之前的某个问题，却要不停滚动鼠标
- 🔍 **找不到重点**，重要的对话内容淹没在长长的聊天记录中
- ⏱️ **浪费时间**，在冗长的对话中反复上下翻找

**AI Chat Prompt Navigator** 就是为了解决这些问题而生！这是一款浏览器扩展，让您可以在 AI 对话页面中**快速跳转、标记重点、一键定位**任何一条提问和回答。

### ✨ 核心功能

#### 🎯 **侧边时间线导航**
- 页面右侧显示优雅的**垂直时间线**，每个节点代表一轮对话
- **鼠标悬停**即可预览提问内容（显示前 80 字符）
- **点击节点**立即跳转到对应位置，并高亮显示
- 自动跟踪当前浏览位置，时间线节点实时同步

#### ⌨️ **强大的快捷键支持**
- **Alt + W / Alt + S**：快速切换上一个/下一个回答
- **Alt + A**：标记/取消标记当前对话（重点内容一目了然）
- **Alt + D**：显示/隐藏时间线（需要专注时可以收起）
- 支持 Mac 和 Windows 系统，快捷键可自定义

#### 📌 **智能标记功能**
- **长按节点 0.5 秒**即可标记重要对话
- 标记的对话会以**特殊颜色**高亮显示，方便后续查找
- 标记状态**自动保存**，切换对话后依然保留
- 支持快捷键快速标记当前正在查看的对话

#### 🎨 **主题自适应**
- 支持**自动/浅色/深色/天蓝色/薰衣草**多种主题模式
- 自动跟随系统主题切换
- 时间线颜色与页面风格完美融合

#### 🌐 **多平台支持**
- ✅ **ChatGPT** (chatgpt.com)
- ✅ **Claude** (claude.ai)
- ✅ **Gemini** (gemini.google.com)
- 🔧 支持自定义 URL（可在设置中添加其他 AI 聊天网站）

### 🚀 如何使用

#### 安装扩展
1. 下载并安装 **AI Chat Prompt Navigator** 扩展
2. 打开 ChatGPT、Claude 或 Gemini 对话页面
3. 页面右侧会自动出现时间线导航

#### 基本操作
- **查看对话**：鼠标悬停在时间线节点上，预览提问内容
- **快速跳转**：点击任意节点，立即跳转到对应对话
- **标记重点**：长按节点 0.5 秒，或按 `Alt + A` 标记当前对话
- **键盘导航**：使用 `Alt + W/S` 在对话间快速切换

#### 高级设置
1. 右键点击浏览器工具栏中的扩展图标
2. 选择 **"选项"** 进入设置页面
3. 可以：
   - 切换主题模式（自动/浅色/深色/天蓝色/薰衣草）
   - 启用/禁用特定网站支持
   - 添加自定义 AI 聊天网站 URL

### 💡 使用场景

- 📚 **学习研究**：回顾之前的提问和 AI 回答，快速定位知识点
- 💼 **工作效率**：在长对话中快速找到关键信息和决策点
- 🎓 **教学演示**：向他人展示 AI 对话时，快速跳转到重要内容
- 📝 **内容整理**：标记重要对话，方便后续复制和整理

### 🛠️ 技术说明

本扩展基于 **TypeScript** 和 **Chrome Extension Manifest V3** 开发，采用轻量级架构，不会影响页面性能。所有数据均存储在本地，保护您的隐私安全。

### 📦 安装方式

#### Chrome 网上应用店（推荐）
即将上线，敬请期待...

#### 手动安装（开发者模式）
1. 克隆或下载本项目代码
2. 在项目根目录执行：
   ```bash
   npm install
   npm run build
   ```
3. 打开 Chrome 浏览器，进入 `chrome://extensions/`
4. 开启右上角的"开发者模式"
5. 点击"加载已解压的扩展程序"，选择项目中的 `dist` 文件夹

---

