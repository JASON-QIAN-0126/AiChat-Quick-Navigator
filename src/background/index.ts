// Background Service Worker
console.log('LLM Answer Navigator: Background service worker started');

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  // 获取当前活动的 tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      // 向 content script 发送消息
      let message;
      
      switch (command) {
        case 'prev-answer':
          message = { type: 'LLM_NAV_PREV_ANSWER' };
          break;
        case 'next-answer':
          message = { type: 'LLM_NAV_NEXT_ANSWER' };
          break;
        case 'toggle-ui':
          message = { type: 'LLM_NAV_TOGGLE_UI' };
          break;
        case 'toggle-pin':
          message = { type: 'LLM_NAV_TOGGLE_PIN' };
          break;
        default:
          return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, message).catch((error) => {
        console.error('Failed to send message to content script:', error);
      });
    }
  });
});

