/**
 * 主题配置
 */

export interface TimelineTheme {
  name: string;
  activeColor: string;      // 激活节点的颜色
  activeShadow: string;     // 激活节点的阴影颜色
}

export const themes: Record<string, TimelineTheme> = {
  light: {
    name: '亮色 (默认绿)',
    activeColor: '#4CAF50',
    activeShadow: 'rgba(76, 175, 80, 0.5)'
  },
  dark: {
    name: '暗色',
    activeColor: '#E0E0E0', // 浅灰/白，适合深色背景
    activeShadow: 'rgba(255, 255, 255, 0.3)'
  },
  blue: {
    name: '天蓝',
    activeColor: '#2196F3',
    activeShadow: 'rgba(33, 150, 243, 0.5)'
  },
  lavender: {
    name: '薰衣草',
    activeColor: '#9C88FF',
    activeShadow: 'rgba(156, 136, 255, 0.5)'
  }
};

export type ThemeType = keyof typeof themes;
export type ThemeMode = ThemeType | 'auto';

/**
 * 根据系统主题获取对应的主题
 */
export function getSystemTheme(): ThemeType {
  // 检测系统是否使用暗色模式
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * 根据模式解析实际主题
 */
export function resolveTheme(mode: ThemeMode): ThemeType {
  if (mode === 'auto') {
    return getSystemTheme();
  }
  // 如果是不存在的 mode，回退到 light
  if (!themes[mode]) {
    return 'light';
  }
  return mode as ThemeType;
}

export const DEFAULT_THEME_MODE: ThemeMode = 'auto';
