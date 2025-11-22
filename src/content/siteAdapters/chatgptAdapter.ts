import type { SiteAdapter } from './index';

/**
 * ChatGPT 站点适配器
 */
export const chatgptAdapter: SiteAdapter = {
  name: 'ChatGPT',
  
  /**
   * 判断是否是 ChatGPT 对话页面
   */
  isSupported(location: Location): boolean {
    const { hostname, pathname } = location;
    
    // 检测是否是 ChatGPT 域名
    const isChatGPT = hostname === 'chatgpt.com' || hostname === 'chat.openai.com';
    
    // 检测是否是对话页面（路径包含 /c/ 或者是根路径）
    const isConversationPage = pathname === '/' || pathname.startsWith('/c/');
    
    return isChatGPT && isConversationPage;
  },
  
  /**
   * 在 ChatGPT 页面中查找所有 AI 回答节点
   * 
   * ChatGPT 的 DOM 结构说明：
   * - AI 回答通常在一个包含特定 data-* 属性的 div 中
   * - 可以通过 data-message-author-role="assistant" 来识别
   * - 或者通过其他特征来识别（可能需要根据实际页面结构调整）
   */
  findAllAnswers(root: Document | HTMLElement): HTMLElement[] {
    const answers: HTMLElement[] = [];
    const foundMethods: string[] = [];
    
    // 方法 1: 尝试通过 data-message-author-role 属性查找
    const messageElements = root.querySelectorAll('[data-message-author-role="assistant"]');
    if (messageElements.length > 0) {
      foundMethods.push(`data-message-author-role (${messageElements.length})`);
      messageElements.forEach(el => {
        if (el instanceof HTMLElement) {
          answers.push(el);
        }
      });
    }
    
    // 方法 2: 查找包含 assistant 回答的父容器（更通用的方法）
    if (answers.length === 0) {
      // 查找所有对话组
      const conversationTurns = root.querySelectorAll('[data-testid^="conversation-turn"]');
      conversationTurns.forEach(turn => {
        if (turn instanceof HTMLElement) {
          // 检查是否包含 assistant 标记
          const hasAssistant = turn.querySelector('[data-message-author-role="assistant"]') ||
                               turn.textContent?.includes('ChatGPT') ||
                               turn.querySelector('.bg-\\[\\#f7f7f8\\]'); // ChatGPT 的背景色
          
          if (hasAssistant) {
            answers.push(turn);
          }
        }
      });
      if (answers.length > 0) {
        foundMethods.push(`conversation-turn (${answers.length})`);
      }
    }
    
    // 方法 3: 通过结构特征查找（所有消息对的偶数项通常是 AI）
    if (answers.length === 0) {
      const allTurns = root.querySelectorAll('main [class*="group"]');
      allTurns.forEach((turn, index) => {
        if (turn instanceof HTMLElement) {
          // 偶数索引通常是 AI 回答（假设对话是用户-AI交替的）
          // 或者包含特定的样式特征
          const hasGrayBg = window.getComputedStyle(turn).backgroundColor.includes('247, 247, 248');
          if (index % 2 === 1 || hasGrayBg) {
            answers.push(turn);
          }
        }
      });
      if (answers.length > 0) {
        foundMethods.push(`structure-based (${answers.length})`);
      }
    }
    
    // 调试信息
    if (answers.length > 0) {
      console.log(`✅ ChatGPT Adapter: 找到 ${answers.length} 个 AI 回答节点 [方法: ${foundMethods.join(', ')}]`);
      console.log('第一个回答节点:', {
        tag: answers[0].tagName,
        classes: answers[0].className,
        dataAttrs: Array.from(answers[0].attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => `${attr.name}="${attr.value}"`)
      });
    } else {
      console.warn('⚠️ ChatGPT Adapter: 未找到任何 AI 回答节点，请检查页面结构');
    }
    
    return answers;
  }
};

