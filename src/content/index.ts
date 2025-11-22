// Content Script
import { getActiveAdapter } from './siteAdapters/index';
import { AnswerIndexManager } from './navigation/answerIndexManager';
import { NavigatorUI } from './navigation/navigatorUI';
import { scrollToAndHighlight } from './navigation/scrollAndHighlight';

console.log('LLM Answer Navigator: Content script loaded');

let indexManager: AnswerIndexManager | null = null;
let navigatorUI: NavigatorUI | null = null;

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 导航到指定的回答
 */
function navigateToAnswer(index: number): void {
  if (!indexManager) {
    console.warn('⚠️ indexManager 未初始化');
    return;
  }
  
  indexManager.setCurrentIndex(index);
  const node = indexManager.getCurrentNode();
  
  console.log(`🎯 导航到第 ${index + 1}/${indexManager.getTotalCount()} 个回答`);
  
  if (node) {
    console.log('✅ 找到目标节点，开始滚动和高亮');
    // 使用滚动和高亮模块
    scrollToAndHighlight(node);
  } else {
    console.error('❌ 未找到目标节点');
  }
  
  // 更新 UI 显示
  updateUI();
}

/**
 * 导航到上一条回答
 */
function navigateToPrev(): void {
  console.log('⬆️ 触发：上一条回答');
  if (indexManager && indexManager.moveToPrev()) {
    navigateToAnswer(indexManager.getCurrentIndex());
  } else {
    console.log('ℹ️ 已经是第一条回答');
  }
}

/**
 * 导航到下一条回答
 */
function navigateToNext(): void {
  console.log('⬇️ 触发：下一条回答');
  if (indexManager && indexManager.moveToNext()) {
    navigateToAnswer(indexManager.getCurrentIndex());
  } else {
    console.log('ℹ️ 已经是最后一条回答');
  }
}

/**
 * 更新 UI 显示
 */
function updateUI(): void {
  if (navigatorUI && indexManager) {
    navigatorUI.updateIndex(
      indexManager.getCurrentIndex(),
      indexManager.getTotalCount()
    );
  }
}

/**
 * 处理滚动事件
 */
const handleScroll = debounce(() => {
  if (indexManager) {
    indexManager.updateCurrentIndexByScroll(window.scrollY);
    updateUI();
  }
}, 200);

/**
 * 初始化导航功能
 */
async function init() {
  // 获取当前页面适配的站点适配器
  const adapter = getActiveAdapter(window.location);
  
  if (!adapter) {
    console.log('LLM Answer Navigator: 当前页面不支持，跳过初始化');
    return;
  }
  
  console.log(`LLM Answer Navigator: ${adapter.name} 页面已检测到，准备初始化`);
  
  // 检查是否在配置中启用了该站点
  try {
    const result = await chrome.storage.sync.get('enable_chatgpt');
    const isEnabled = result.enable_chatgpt !== false; // 默认启用
    
    if (!isEnabled) {
      console.log('LLM Answer Navigator: ChatGPT 导航功能已在设置中关闭');
      return;
    }
  } catch (error) {
    console.error('读取配置失败:', error);
    // 如果读取配置失败，默认继续执行
  }
  
  // 初始化索引管理器
  indexManager = new AnswerIndexManager(adapter, document);
  
  console.log(`LLM Answer Navigator: 初始化完成，共 ${indexManager.getTotalCount()} 个回答`);
  
  // 初始化导航 UI
  navigatorUI = new NavigatorUI();
  navigatorUI.onPrev(navigateToPrev);
  navigatorUI.onNext(navigateToNext);
  updateUI();
  
  // 监听滚动事件
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // 监听 DOM 变化，以便在新回答出现时刷新
  const observer = new MutationObserver(debounce(() => {
    if (indexManager && indexManager.needsRefresh()) {
      indexManager.refresh();
      updateUI();
    }
  }, 1000));
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听来自 background 的消息（快捷键触发）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  
  if (message.type === 'LLM_NAV_PREV_ANSWER') {
    console.log('快捷键触发：导航到上一条回答');
    navigateToPrev();
    sendResponse({ success: true });
  } else if (message.type === 'LLM_NAV_NEXT_ANSWER') {
    console.log('快捷键触发：导航到下一条回答');
    navigateToNext();
    sendResponse({ success: true });
  }
  
  return true; // 保持消息通道打开
});

