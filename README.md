<h1 align="center">AI Chat Prompt Navigator</h1>

<p align="center">
  <strong>Make AI Conversation Navigation Simple and Efficient</strong>
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

## 📖 What is this?

When using AI chat tools like ChatGPT, Claude, or Gemini, have you ever encountered these frustrations:

- 💬 **Conversations too long** - wanting to review a previous question but having to scroll endlessly
- 🔍 **Can't find key points** - important conversations buried in lengthy chat history
- ⏱️ **Time wasted** - repeatedly scrolling up and down through long conversations

**AI Chat Prompt Navigator** was created to solve these problems! It's a browser extension that lets you **quickly jump, mark highlights, and instantly locate** any question and answer in AI conversation pages.

## ✨ Key Features

### 🎯 **Side Timeline Navigation**
- Elegant **vertical timeline** on the right side of the page, each node represents a conversation turn
- **Hover preview** of prompt content (shows first 80 characters)
- **Click nodes** to instantly jump to corresponding position with highlighting
- Automatically tracks current viewing position, timeline nodes sync in real-time

### ⌨️ **Powerful Keyboard Shortcuts**
- **Alt + W / Alt + S**: Quickly switch to previous/next answer
- **Alt + A**: Mark/unmark current conversation (highlight important content)
- **Alt + D**: Show/hide timeline (collapse when you need to focus)
- Supports Mac and Windows, shortcuts are customizable

### 📌 **Smart Marking Feature**
- **Long-press node for 0.5 seconds** to mark important conversations
- Marked conversations display in **special colors** for easy retrieval
- Marking status **auto-saves**, persists after switching conversations
- Supports keyboard shortcut to quickly mark currently viewed conversation

### 🎨 **Theme Adaptive**
- Supports **Auto/Light/Dark/Skyblue/Lavender** theme modes
- Automatically follows system theme switching
- Timeline colors perfectly blend with page style

### 🌐 **Multi-Platform Support**
- ✅ **ChatGPT** (chatgpt.com)
- ✅ **Claude** (claude.ai)
- ✅ **Gemini** (gemini.google.com)
- 🔧 Supports custom URLs (add other AI chat websites in settings)

## 🚀 How to Use

### Install Extension
1. Download and install **AI Chat Prompt Navigator** extension
2. Open ChatGPT, Claude, or Gemini conversation page
3. Timeline navigation will automatically appear on the right side of the page

### Basic Operations
- **View conversations**: Hover over timeline nodes to preview prompt content
- **Quick jump**: Click any node to instantly jump to corresponding conversation
- **Mark highlights**: Long-press node for 0.5 seconds, or press `Alt + A` to mark current conversation
- **Keyboard navigation**: Use `Alt + W/S` to quickly switch between conversations

### Advanced Settings
1. Right-click the extension icon in browser toolbar
2. Select **"Options"** to enter settings page
3. You can:
   - Switch theme mode (Auto/Light/Dark/Skyblue/Lavender)
   - Enable/disable specific website support
   - Add custom AI chat website URLs

## 💡 Use Cases

- 📚 **Learning & Research**: Review previous questions and AI answers, quickly locate knowledge points
- 💼 **Work Efficiency**: Quickly find key information and decision points in long conversations
- 🎓 **Teaching & Demo**: When showing AI conversations to others, quickly jump to important content
- 📝 **Content Organization**: Mark important conversations for easy copying and organizing later

## 🛠️ Technical Notes

This extension is built with **TypeScript** and **Chrome Extension Manifest V3**, using a lightweight architecture that won't affect page performance. All data is stored locally to protect your privacy.

## 📦 Installation

### Chrome Web Store (Recommended)
Coming soon...

### Manual Installation (Developer Mode)
1. Clone or download this project
2. Run in the project root directory:
   ```bash
   npm install
   npm run build
   ```
3. Open Chrome browser and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select the `dist` folder in the project

---
