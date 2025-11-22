import { themes, type ThemeType, DEFAULT_THEME, type Theme } from './themes';

/**
 * 导航 UI 管理器
 * 负责创建和管理页面右下角的悬浮导航面板
 */
export class NavigatorUI {
  private container: HTMLDivElement;
  private prevButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private indexDisplay: HTMLSpanElement;
  
  private onPrevCallback: (() => void) | null = null;
  private onNextCallback: (() => void) | null = null;
  
  private currentIndex: number = 0;
  private totalCount: number = 0;
  private currentTheme: ThemeType = DEFAULT_THEME;
  private isHidden: boolean = false;

  constructor() {
    this.container = this.createContainer();
    this.prevButton = this.createButton('↑', '上一条回答');
    this.nextButton = this.createButton('↓', '下一条回答');
    this.indexDisplay = this.createIndexDisplay();
    
    this.setupUI();
    this.attachToPage();
    this.loadTheme();
  }

  /**
   * 创建容器元素
   */
  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'llm-answer-navigator';
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;
    
    return container;
  }

  /**
   * 创建按钮
   */
  private createButton(text: string, title: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.dataset.originalTitle = title; // 保存原始标题
    button.style.cssText = `
      padding: 8px 16px;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      transition: all 0.2s ease;
      user-select: none;
    `;
    
    button.addEventListener('mouseenter', () => {
      if (!button.disabled) {
        button.dataset.hovered = 'true';
        button.style.transform = 'scale(1.05)';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      button.dataset.hovered = 'false';
      button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mousedown', () => {
      if (!button.disabled) {
        button.style.transform = 'scale(0.95)';
      }
    });
    
    button.addEventListener('mouseup', () => {
      if (!button.disabled && button.dataset.hovered === 'true') {
        button.style.transform = 'scale(1.05)';
      }
    });
    
    return button;
  }

  /**
   * 创建索引显示元素
   */
  private createIndexDisplay(): HTMLSpanElement {
    const display = document.createElement('span');
    display.style.cssText = `
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      padding: 4px 0;
      user-select: none;
    `;
    
    return display;
  }

  /**
   * 组装 UI
   */
  private setupUI(): void {
    // 添加按钮事件监听
    this.prevButton.addEventListener('click', () => {
      if (this.onPrevCallback) {
        this.onPrevCallback();
      }
    });
    
    this.nextButton.addEventListener('click', () => {
      if (this.onNextCallback) {
        this.onNextCallback();
      }
    });
    
    // 组装元素
    this.container.appendChild(this.prevButton);
    this.container.appendChild(this.indexDisplay);
    this.container.appendChild(this.nextButton);
    
    this.updateDisplay();
  }

  /**
   * 将 UI 添加到页面
   */
  private attachToPage(): void {
    document.body.appendChild(this.container);
  }

  /**
   * 更新索引显示
   */
  private updateDisplay(): void {
    if (this.totalCount === 0) {
      this.indexDisplay.textContent = '加载中...';
      this.prevButton.disabled = true;
      this.nextButton.disabled = true;
      this.prevButton.style.opacity = '0.5';
      this.nextButton.style.opacity = '0.5';
      this.prevButton.style.cursor = 'not-allowed';
      this.nextButton.style.cursor = 'not-allowed';
    } else {
      this.indexDisplay.textContent = `${this.currentIndex + 1} / ${this.totalCount}`;
      
      // 向上按钮：始终可用
      this.prevButton.disabled = false;
      this.prevButton.style.opacity = '1';
      this.prevButton.style.cursor = 'pointer';
      
      // 更新向上按钮的提示文字
      if (this.currentIndex === 0) {
        this.prevButton.title = this.totalCount === 1 
          ? '滚动到顶部' 
          : '已经是第一条（点击滚动到顶部）';
      } else {
        this.prevButton.title = this.prevButton.dataset.originalTitle || '上一条回答';
      }
      
      // 向下按钮：只有在有多条对话且不是最后一条时可用
      this.nextButton.disabled = this.currentIndex === this.totalCount - 1;
      this.nextButton.style.opacity = this.nextButton.disabled ? '0.5' : '1';
      this.nextButton.style.cursor = this.nextButton.disabled ? 'not-allowed' : 'pointer';
    }
  }

  /**
   * 更新当前索引和总数
   */
  updateIndex(currentIndex: number, totalCount: number): void {
    this.currentIndex = currentIndex;
    this.totalCount = totalCount;
    this.updateDisplay();
  }

  /**
   * 注册「上一条」回调
   */
  onPrev(callback: () => void): void {
    this.onPrevCallback = callback;
  }

  /**
   * 注册「下一条」回调
   */
  onNext(callback: () => void): void {
    this.onNextCallback = callback;
  }

  /**
   * 显示 UI
   */
  show(): void {
    this.container.style.opacity = '1';
    this.container.style.pointerEvents = 'auto';
  }

  /**
   * 隐藏 UI
   */
  hide(): void {
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean): void {
    if (loading) {
      this.indexDisplay.textContent = '加载中...';
      this.prevButton.disabled = true;
      this.nextButton.disabled = true;
      this.prevButton.style.opacity = '0.5';
      this.nextButton.style.opacity = '0.5';
      this.prevButton.style.cursor = 'not-allowed';
      this.nextButton.style.cursor = 'not-allowed';
    } else {
      this.updateDisplay();
    }
  }

  /**
   * 移除 UI
   */
  destroy(): void {
    this.container.remove();
  }

  /**
   * 加载主题配置
   */
  private async loadTheme(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get('ui_theme');
      const themeName = (result.ui_theme as ThemeType) || DEFAULT_THEME;
      this.setTheme(themeName);
    } catch (error) {
      console.error('加载主题失败:', error);
      this.setTheme(DEFAULT_THEME);
    }
  }

  /**
   * 设置主题
   */
  setTheme(themeName: ThemeType): void {
    const theme = themes[themeName] || themes[DEFAULT_THEME];
    this.currentTheme = themeName;
    
    // 更新容器样式
    this.container.style.background = theme.background;
    this.container.style.borderColor = theme.border;
    
    // 更新按钮样式
    this.updateButtonTheme(this.prevButton, theme);
    this.updateButtonTheme(this.nextButton, theme);
    
    // 更新文字颜色
    this.indexDisplay.style.color = theme.textColor;
    
    console.log(`🎨 主题已切换为: ${theme.name}`);
  }

  /**
   * 更新按钮主题
   */
  private updateButtonTheme(button: HTMLButtonElement, theme: Theme): void {
    button.style.background = theme.primary;
    
    // 重新绑定悬停效果
    const oldButton = button.cloneNode(true) as HTMLButtonElement;
    button.parentNode?.replaceChild(button, oldButton);
    
    button.addEventListener('mouseenter', () => {
      if (!button.disabled) {
        button.style.background = theme.primaryHover;
        button.style.transform = 'scale(1.05)';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (!button.disabled) {
        button.style.background = theme.primary;
      }
      button.style.transform = 'scale(1)';
    });
  }

  /**
   * 切换显示/隐藏
   */
  toggle(): void {
    this.isHidden = !this.isHidden;
    if (this.isHidden) {
      this.container.style.opacity = '0';
      this.container.style.pointerEvents = 'none';
      this.container.style.transform = 'translateX(120%)';
      console.log('🙈 导航面板已隐藏');
    } else {
      this.container.style.opacity = '1';
      this.container.style.pointerEvents = 'auto';
      this.container.style.transform = 'translateX(0)';
      console.log('👁️ 导航面板已显示');
    }
  }

  /**
   * 获取隐藏状态
   */
  getHiddenState(): boolean {
    return this.isHidden;
  }
}

