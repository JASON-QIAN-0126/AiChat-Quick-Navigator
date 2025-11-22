/**
 * 滚动与高亮模块
 * 负责平滑滚动到指定回答并高亮显示
 */

import { themes, resolveTheme, DEFAULT_THEME_MODE, type ThemeType, type ThemeMode } from './themes';

const HIGHLIGHT_CLASS = 'llm-answer-nav-highlight';
let currentHighlightedNode: HTMLElement | null = null;
let stylesInjected = false;
let cachedThemeMode: ThemeMode | null = null;
let cachedThemeType: ThemeType | null = null;

/**
 * 注入高亮样式
 */
async function injectStyles(forceUpdate: boolean = false): Promise<void> {
  try {
    if (cachedThemeMode === null) {
      const result = await chrome.storage.sync.get('ui_theme');
      cachedThemeMode = (result.ui_theme as ThemeMode) || DEFAULT_THEME_MODE;
    }
  } catch (error) {
    console.error('加载主题失败:', error);
    cachedThemeMode = DEFAULT_THEME_MODE;
  }

  const actualTheme = resolveTheme(cachedThemeMode || DEFAULT_THEME_MODE);
  if (!forceUpdate && stylesInjected && cachedThemeType === actualTheme) {
    return;
  }

  cachedThemeType = actualTheme;
  const theme = themes[actualTheme];

  let style = document.getElementById('llm-answer-nav-styles') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'llm-answer-nav-styles';
    document.head.appendChild(style);
  }

  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      position: relative;
      animation: llm-nav-highlight-pulse 1s ease-in-out;
    }
    
    .${HIGHLIGHT_CLASS}::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border: 3px solid ${theme.highlightBorder};
      border-radius: 8px;
      pointer-events: none;
      animation: llm-nav-border-fade 2s ease-in-out forwards;
    }
    
    @keyframes llm-nav-highlight-pulse {
      0%, 100% {
        background-color: transparent;
      }
      50% {
        background-color: ${theme.highlightBackground};
      }
    }
    
    @keyframes llm-nav-border-fade {
      0% {
        opacity: 1;
        border-width: 3px;
      }
      100% {
        opacity: 0.3;
        border-width: 2px;
      }
    }
  `;

  stylesInjected = true;
}

/**
 * 平滑滚动到指定回答
 * @param node - 目标回答节点
 * @param topOffset - 顶部偏移量（像素），用于避开页面顶栏等
 */
export function scrollToAnswer(node: HTMLElement, topOffset: number = 80): void {
  if (!node) {
    return;
  }
  
  try {
    // 方法 1: 使用 scrollIntoView（最可靠）
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    
    // 微调位置以避开顶栏
    setTimeout(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > topOffset) {
        window.scrollTo({
          top: currentScroll - topOffset,
          behavior: 'smooth'
        });
      }
    }, 100);
  } catch (error) {
    // 备用方法：直接计算位置
    try {
      const rect = node.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - topOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } catch (backupError) {
      // 静默失败
    }
  }
}

/**
 * 高亮指定的回答节点
 * @param node - 要高亮的回答节点
 */
export async function highlightAnswer(node: HTMLElement): Promise<void> {
  if (!node) return;
  
  // 确保样式已注入
  await injectStyles();
  
  // 移除之前的高亮
  if (currentHighlightedNode && currentHighlightedNode !== node) {
    removeHighlight(currentHighlightedNode);
  }
  
  // 添加高亮 class
  node.classList.add(HIGHLIGHT_CLASS);
  currentHighlightedNode = node;
  
  // 2 秒后自动移除高亮动画（保留边框）
  setTimeout(() => {
    // 不完全移除，让边框保持淡显示
  }, 2000);
}

/**
 * 移除节点的高亮
 * @param node - 要移除高亮的节点
 */
function removeHighlight(node: HTMLElement): void {
  if (!node) return;
  node.classList.remove(HIGHLIGHT_CLASS);
}

/**
 * 清除所有高亮
 */
export function clearAllHighlights(): void {
  const highlightedNodes = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  highlightedNodes.forEach(node => {
    if (node instanceof HTMLElement) {
      removeHighlight(node);
    }
  });
  currentHighlightedNode = null;
}

if (chrome?.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.ui_theme) {
      cachedThemeMode = (changes.ui_theme.newValue as ThemeMode) || DEFAULT_THEME_MODE;
      injectStyles(true);
    }
  });
}

/**
 * 滚动并高亮指定的回答节点
 * @param node - 目标回答节点
 * @param topOffset - 顶部偏移量
 */
export function scrollToAndHighlight(node: HTMLElement, topOffset: number = 80): void {
  if (!node) return;
  
  scrollToAnswer(node, topOffset);
  
  // 延迟高亮，等待滚动完成
  setTimeout(() => {
    highlightAnswer(node);
  }, 300);
}

