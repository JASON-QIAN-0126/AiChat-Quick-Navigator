/**
 * 滚动与高亮模块
 * 负责平滑滚动到指定回答并高亮显示
 */

const HIGHLIGHT_CLASS = 'llm-answer-nav-highlight';
let currentHighlightedNode: HTMLElement | null = null;
let stylesInjected = false;

/**
 * 注入高亮样式
 */
function injectStyles(): void {
  if (stylesInjected) return;
  
  const style = document.createElement('style');
  style.id = 'llm-answer-nav-styles';
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
      border: 3px solid #4CAF50;
      border-radius: 8px;
      pointer-events: none;
      animation: llm-nav-border-fade 2s ease-in-out forwards;
    }
    
    @keyframes llm-nav-highlight-pulse {
      0%, 100% {
        background-color: transparent;
      }
      50% {
        background-color: rgba(76, 175, 80, 0.1);
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
    
    /* 深色模式适配 */
    @media (prefers-color-scheme: dark) {
      .${HIGHLIGHT_CLASS}::before {
        border-color: #66BB6A;
      }
      
      @keyframes llm-nav-highlight-pulse {
        0%, 100% {
          background-color: transparent;
        }
        50% {
          background-color: rgba(102, 187, 106, 0.15);
        }
      }
    }
  `;
  
  document.head.appendChild(style);
  stylesInjected = true;
}

/**
 * 平滑滚动到指定回答
 * @param node - 目标回答节点
 * @param topOffset - 顶部偏移量（像素），用于避开页面顶栏等
 */
export function scrollToAnswer(node: HTMLElement, topOffset: number = 80): void {
  if (!node) {
    console.warn('⚠️ scrollToAnswer: 节点为空');
    return;
  }
  
  console.log('📍 滚动到回答节点:', {
    tag: node.tagName,
    text: node.textContent?.substring(0, 50) + '...',
    offsetTop: node.offsetTop
  });
  
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
    
    console.log('✅ 滚动命令已执行');
  } catch (error) {
    console.error('❌ 滚动失败:', error);
    
    // 备用方法：直接计算位置
    try {
      const rect = node.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - topOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      console.log('✅ 使用备用滚动方法');
    } catch (backupError) {
      console.error('❌ 备用滚动也失败:', backupError);
    }
  }
}

/**
 * 高亮指定的回答节点
 * @param node - 要高亮的回答节点
 */
export function highlightAnswer(node: HTMLElement): void {
  if (!node) return;
  
  // 确保样式已注入
  injectStyles();
  
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

