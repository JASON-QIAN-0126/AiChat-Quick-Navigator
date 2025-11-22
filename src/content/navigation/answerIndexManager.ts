import type { SiteAdapter, PromptAnswerPair } from '../siteAdapters/index';

/**
 * Prompt-Answer 条目信息（扩展版）
 * 在原始配对基础上添加索引管理所需的信息
 */
export interface PromptAnswerItem extends PromptAnswerPair {
  /** 在文档中的相对位置 (0~1) */
  relativePosition?: number;
}

/**
 * 回答索引管理器（重构版）
 * 基于 Prompt-Answer 配对管理对话导航
 * 负责管理所有对话配对的索引和当前位置
 */
export class AnswerIndexManager {
  private items: PromptAnswerItem[] = [];
  private currentIndex: number = 0;
  private adapter: SiteAdapter;
  private root: Document | HTMLElement;
  
  // 位置缓存，减少getBoundingClientRect调用
  private positionCache: Map<number, { top: number, bottom: number, timestamp: number }> = new Map();
  private readonly CACHE_VALIDITY_MS = 500; // 缓存有效期500ms

  constructor(adapter: SiteAdapter, root: Document | HTMLElement) {
    this.adapter = adapter;
    this.root = root;
    this.refresh();
  }

  /**
   * 刷新对话配对列表
   * 重新查找所有 Prompt-Answer 配对并更新索引
   */
  refresh(): void {
    const pairs = this.adapter.getPromptAnswerPairs(this.root);
    
    // 转换为 PromptAnswerItem，已经包含 topOffset
    this.items = pairs.map(pair => ({
      ...pair,
      // relativePosition 稍后在需要时计算
    }));

    // 按 topOffset 排序（已经由适配器排序，这里再确认一次）
    this.items.sort((a, b) => a.topOffset - b.topOffset);
    
    // 计算相对位置
    this.updateRelativePositions();
    
    // 清除位置缓存
    this.positionCache.clear();
  }
  
  /**
   * 更新所有条目的相对位置（用于时间线节点位置映射）
   */
  private updateRelativePositions(): void {
    // 优先使用 scrollHeight，如果为 0 则给一个默认值防止除以零
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1000;
    
    this.items.forEach(item => {
      if (this.items.length === 1) {
        item.relativePosition = 0; // 只有一个节点时置顶
      } else {
        item.relativePosition = item.topOffset / documentHeight;
      }
    });
  }

  /**
   * 计算元素相对于文档顶部的偏移量
   */
  private getTopOffset(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  /**
   * 获取所有 Prompt-Answer 条目
   */
  getItems(): PromptAnswerItem[] {
    return this.items;
  }
  
  /**
   * 获取对话配对总数
   */
  getTotalCount(): number {
    return this.items.length;
  }

  /**
   * 获取当前索引（从 0 开始）
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 设置当前索引
   * @param index - 新的索引值（从 0 开始）
   */
  setCurrentIndex(index: number): void {
    if (this.items.length === 0) {
      this.currentIndex = 0;
      return;
    }

    // 防止越界
    if (index < 0) {
      this.currentIndex = 0;
    } else if (index >= this.items.length) {
      this.currentIndex = this.items.length - 1;
    } else {
      this.currentIndex = index;
    }
  }

  /**
   * 根据索引获取条目
   * @param index - 索引值（从 0 开始）
   * @returns 对应的条目，如果索引无效则返回 null
   */
  getItemByIndex(index: number): PromptAnswerItem | null {
    if (index < 0 || index >= this.items.length) {
      return null;
    }
    return this.items[index];
  }
  
  /**
   * 获取当前条目
   */
  getCurrentItem(): PromptAnswerItem | null {
    return this.getItemByIndex(this.currentIndex);
  }

  /**
   * 获取指定索引的节点（兼容旧接口）
   * @param index - 索引值（从 0 开始）
   * @returns 对应的问题节点，如果索引无效则返回 null
   * @deprecated 建议使用 getItemByIndex 获取完整条目信息
   */
  getNodeByIndex(index: number): HTMLElement | null {
    const item = this.getItemByIndex(index);
    return item ? item.promptNode : null;
  }

  /**
   * 获取当前节点（兼容旧接口）
   * @deprecated 建议使用 getCurrentItem 获取完整条目信息
   */
  getCurrentNode(): HTMLElement | null {
    return this.getNodeByIndex(this.currentIndex);
  }

  /**
   * 跳转到上一个对话
   * @returns 是否成功跳转（如果已经是第一个则返回 false）
   */
  moveToPrev(): boolean {
    if (this.currentIndex > 0) {
      this.setCurrentIndex(this.currentIndex - 1);
      return true;
    }
    return false;
  }

  /**
   * 跳转到下一个对话
   * @returns 是否成功跳转（如果已经是最后一个则返回 false）
   */
  moveToNext(): boolean {
    if (this.currentIndex < this.items.length - 1) {
      this.setCurrentIndex(this.currentIndex + 1);
      return true;
    }
    return false;
  }

  /**
   * 获取节点的缓存位置信息（如果缓存有效）
   * @param index - 节点索引
   * @returns 缓存的位置信息，如果缓存失效则返回null
   */
  private getCachedPosition(index: number): { top: number, bottom: number } | null {
    const cached = this.positionCache.get(index);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_VALIDITY_MS) {
      // 缓存过期，删除
      this.positionCache.delete(index);
      return null;
    }
    
    return { top: cached.top, bottom: cached.bottom };
  }
  
  /**
   * 缓存节点的位置信息
   * @param index - 节点索引
   * @param rect - getBoundingClientRect结果
   */
  private cachePosition(index: number, rect: DOMRect): void {
    this.positionCache.set(index, {
      top: rect.top,
      bottom: rect.bottom,
      timestamp: Date.now()
    });
  }

  /**
   * 根据当前滚动位置更新当前索引
   * 优化逻辑：实时检测 DOM 位置，找到视口中最相关的 Prompt
   * @param scrollY - 当前滚动位置（window.scrollY）
   */
  updateCurrentIndexByScroll(scrollY: number): void {
    if (this.items.length === 0) {
      return;
    }

    const windowHeight = window.innerHeight;
    
    // 实时检测每个 Prompt 的位置
    // 我们要找的是：最后一个"顶部在视口中线及其上方"的节点
    // 意图：用户正在阅读的内容，通常属于那个"标题还在上面"的章节
    const viewportCenter = windowHeight / 2;
    let activeIndex = 0;
    
    // 找到所有位于中线以上的节点
    for (let i = 0; i < this.items.length; i++) {
      const node = this.items[i].promptNode;
      if (!node) continue;
      
      // 尝试使用缓存
      let cachedPos = this.getCachedPosition(i);
      let rectTop: number;
      
      if (cachedPos) {
        rectTop = cachedPos.top;
      } else {
        // 缓存失效或不存在，重新计算
        const rect = node.getBoundingClientRect();
        this.cachePosition(i, rect);
        rectTop = rect.top;
      }
      
      // 如果节点的顶部在视口中线之前 (rect.top < viewportCenter)
      // 说明这个节点已经进入视野或者已经在上面了
      if (rectTop < viewportCenter) {
        activeIndex = i;
      } else {
        // 一旦遇到一个节点在中线下面，后面的肯定也都在下面，直接结束
        break;
      }
    }
    
    // 只有当索引真正改变时才更新
    if (this.currentIndex !== activeIndex) {
      this.currentIndex = activeIndex;
    }
  }

  /**
   * 检查是否需要刷新对话列表
   * 如果页面上的对话数量发生变化，返回 true
   */
  needsRefresh(): boolean {
    const currentPairs = this.adapter.getPromptAnswerPairs(this.root);
    return currentPairs.length !== this.items.length;
  }
}

