// Options page script
console.log('Options page loaded');

// 配置键
const CONFIG_KEYS = {
  ENABLE_CHATGPT: 'enable_chatgpt',
  UI_THEME: 'ui_theme'
};

// 获取默认主题（根据系统模式）
function getDefaultTheme(): string {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'green';
}

// 加载配置
async function loadSettings(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get([
      CONFIG_KEYS.ENABLE_CHATGPT,
      CONFIG_KEYS.UI_THEME
    ]);
    
    const enableChatGPT = result[CONFIG_KEYS.ENABLE_CHATGPT] !== false; // 默认启用
    const uiTheme = result[CONFIG_KEYS.UI_THEME] || getDefaultTheme(); // 默认根据系统模式
    
    const checkbox = document.getElementById('enable-chatgpt') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = enableChatGPT;
    }
    
    const themeSelect = document.getElementById('ui-theme') as HTMLSelectElement;
    if (themeSelect) {
      themeSelect.value = uiTheme;
    }
    
    console.log('设置已加载:', { enableChatGPT, uiTheme });
  } catch (error) {
    console.error('加载设置失败:', error);
  }
}

// 保存配置
async function saveSetting(key: string, value: any): Promise<void> {
  try {
    await chrome.storage.sync.set({ [key]: value });
    showSaveStatus();
    console.log('设置已保存:', { [key]: value });
  } catch (error) {
    console.error('保存设置失败:', error);
  }
}

// 显示保存状态提示
function showSaveStatus(): void {
  const status = document.getElementById('save-status');
  if (status) {
    status.classList.add('success');
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载设置
  loadSettings();
  
  // 监听 ChatGPT 开关变化
  const chatgptCheckbox = document.getElementById('enable-chatgpt') as HTMLInputElement;
  if (chatgptCheckbox) {
    chatgptCheckbox.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      saveSetting(CONFIG_KEYS.ENABLE_CHATGPT, target.checked);
    });
  }
  
  // 监听主题选择变化
  const themeSelect = document.getElementById('ui-theme') as HTMLSelectElement;
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      saveSetting(CONFIG_KEYS.UI_THEME, target.value);
      
      // 通知所有标签页更新主题
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'LLM_NAV_THEME_CHANGED',
              theme: target.value
            }).catch(() => {
              // 忽略错误（某些标签页可能没有 content script）
            });
          }
        });
      });
    });
  }
});

