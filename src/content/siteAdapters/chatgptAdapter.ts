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
    
    // 方法 1: 尝试通过 data-message-author-role 属性查找
    const messageElements = root.querySelectorAll('[data-message-author-role="assistant"]');
    if (messageElements.length > 0) {
      messageElements.forEach(el => {
        if (el instanceof HTMLElement) {
          answers.push(el);
        }
      });
      return answers;
    }
    
    // 方法 2: 如果方法 1 没找到，尝试通过 class 查找
    // ChatGPT 的回答通常在特定的容器中
    // 这里使用一个更宽泛的选择器作为备选方案
    const possibleAnswers = root.querySelectorAll('.group\\/conversation-turn, [class*="agent"]');
    possibleAnswers.forEach(el => {
      if (el instanceof HTMLElement) {
        // 进一步过滤，排除用户消息
        const isUserMessage = el.querySelector('[data-message-author-role="user"]');
        if (!isUserMessage) {
          answers.push(el);
        }
      }
    });
    
    // 方法 3: 如果以上都没找到，尝试查找包含代码块或长段落的元素
    // 这是一个更宽泛的备选方案
    if (answers.length === 0) {
      const allMessages = root.querySelectorAll('article, [class*="message"], [class*="response"]');
      allMessages.forEach(el => {
        if (el instanceof HTMLElement) {
          // 简单启发式：包含较多内容的可能是 AI 回答
          const textLength = el.textContent?.length || 0;
          if (textLength > 50) {
            answers.push(el);
          }
        }
      });
    }
    
    return answers;
  }
};

