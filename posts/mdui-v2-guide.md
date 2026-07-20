---
title: MDUI v2 入门指南：从零开始构建 Material Design 界面
date: 2026-07-21
tags: ["前端", "MDUI", "Web Components", "UI框架"]
description: 本文介绍如何使用 MDUI v2 这套基于 Web Components 的组件库，快速构建符合 Material Design 3 规范的现代化 Web 界面。
cover: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200
---

# MDUI v2 入门指南

> MDUI 是一套基于 **Web Components** 开发的组件库，遵循 **Material Design 3** 设计规范。它无需任何框架即可使用，同时也完美支持 React、Vue、Angular 等主流前端框架。

## 为什么选择 MDUI v2？

在现代前端开发中，选择一个合适的 UI 组件库至关重要。MDUI v2 具有以下核心优势：

- **原生 Web Components**：不依赖任何框架，浏览器原生支持
- **Material Design 3**：紧跟 Google 最新设计规范
- **按需导入**：只加载需要的组件，体积可控
- **深色模式**：内置完善的深色主题和自动切换
- **动态配色**：支持从任意颜色生成完整配色方案
- **TypeScript 支持**：完整的类型定义，IDE 智能提示

## 快速开始

### 通过 CDN 引入

最简单的方式是通过 CDN 引入，适合快速原型开发或小型项目：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MDUI 示例</title>
  <!-- MDUI CSS -->
  <link rel="stylesheet" href="https://unpkg.com/mdui@2.1.3/mdui.css">
  <!-- MDUI JS -->
  <script src="https://unpkg.com/mdui@2.1.3/mdui.global.js"></script>
</head>
<body>
  <mdui-button variant="filled">你好，MDUI！</mdui-button>
</body>
</html>
```

### 通过 npm 安装

对于大型项目，推荐使用 npm 安装并进行按需导入：

```bash
npm install mdui
```

```js
// 导入 CSS（必须）
import 'mdui/mdui.css';

// 按需导入按钮组件
import 'mdui/components/button.js';

// 按需导入函数
import { snackbar } from 'mdui/functions/snackbar.js';
```

## 核心组件一览

MDUI v2 提供了丰富的组件，覆盖了日常开发的大部分需求：

| 组件类别 | 组件名称 | 说明 |
|---------|---------|------|
| 基础 | `mdui-button` | 按钮，支持多种变体 |
| 基础 | `mdui-icon` | 图标，支持 Material Icons |
| 输入 | `mdui-text-field` | 文本输入框 |
| 输入 | `mdui-checkbox` / `mdui-radio` / `mdui-switch` | 选择控件 |
| 输入 | `mdui-slider` / `mdui-range-slider` | 滑块 |
| 展示 | `mdui-card` | 卡片容器 |
| 展示 | `mdui-avatar` | 头像 |
| 展示 | `mdui-badge` | 徽标 |
| 展示 | `mdui-chip` | 标签/筛选器 |
| 导航 | `mdui-top-app-bar` | 顶部应用栏 |
| 导航 | `mdui-navigation-drawer` | 导航抽屉 |
| 导航 | `mdui-navigation-bar` | 底部导航栏 |
| 反馈 | `mdui-dialog` | 对话框 |
| 反馈 | `mdui-snackbar` | 底部提示 |
| 反馈 | `mdui-linear-progress` / `mdui-circular-progress` | 进度条 |
| 布局 | `mdui-collapse` | 折叠面板 |
| 布局 | `mdui-tabs` / `mdui-tab` / `mdui-tab-panel` | 选项卡 |
| 布局 | `mdui-list` / `mdui-list-item` | 列表 |

## 常用组件示例

### 按钮（Button）

MDUI 的按钮组件支持多种变体和样式：

```html
<!-- 不同变体 -->
<mdui-button variant="filled">Filled</mdui-button>
<mdui-button variant="tonal">Tonal</mdui-button>
<mdui-button variant="outlined">Outlined</mdui-button>
<mdui-button variant="text">Text</mdui-button>

<!-- 带图标 -->
<mdui-button variant="filled">
  <mdui-icon name="send" slot="icon"></mdui-icon>
  发送
</mdui-button>

<!-- 禁用状态 -->
<mdui-button variant="filled" disabled>禁用</mdui-button>
```

### 卡片（Card）

卡片是 Material Design 中最常用的容器组件：

```html
<mdui-card style="max-width: 360px; padding: 16px;">
  <div class="mdui-typescale-headline-small">卡片标题</div>
  <div class="mdui-typescale-body-medium" style="margin-top: 8px; opacity: 0.7;">
    这是卡片的内容区域，可以放置任何 HTML 内容。
  </div>
  <div style="margin-top: 16px; display: flex; gap: 8px;">
    <mdui-button variant="text">取消</mdui-button>
    <mdui-button variant="filled">确认</mdui-button>
  </div>
</mdui-card>
```

### 文本框（Text Field）

```html
<mdui-text-field 
  variant="outlined" 
  label="用户名" 
  placeholder="请输入用户名"
  helper="用户名将用于登录"
  required>
</mdui-text-field>

<mdui-text-field 
  variant="filled" 
  label="密码" 
  type="password"
  toggle-password>
</mdui-text-field>
```

### 对话框（Dialog）

```html
<mdui-dialog headline="确认删除？" description="此操作不可撤销">
  <mdui-button slot="action" variant="text">取消</mdui-button>
  <mdui-button slot="action" variant="filled">删除</mdui-button>
</mdui-dialog>
```

## 主题与配色

### 深色模式

MDUI 内置了完善的深色模式支持，只需在 `<html>` 标签上添加对应类名：

```html
<!-- 浅色模式 -->
<html class="mdui-theme-light">

<!-- 深色模式 -->
<html class="mdui-theme-dark">

<!-- 自动跟随系统 -->
<html class="mdui-theme-auto">
```

也可以通过 JavaScript 动态切换：

```js
import { setTheme } from 'mdui/functions/setTheme.js';

// 设置为深色模式
setTheme('dark');

// 设置为浅色模式
setTheme('light');

// 设置为自动模式
setTheme('auto');
```

### 动态配色

MDUI 支持从任意颜色生成完整的配色方案：

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// 根据 #0061a4 生成配色方案
setColorScheme('#0061a4');

// 也可以指定目标元素
setColorScheme('#ff5722', {
  target: document.querySelector('.my-container')
});

// 自定义颜色组
setColorScheme('#0061a4', {
  customColors: [
    { name: 'error', value: '#e53935' },
    { name: 'success', value: '#43a047' }
  ]
});
```

甚至可以从图片中提取主色调：

```js
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

const image = new Image();
image.src = 'wallpaper.jpg';

getColorFromImage(image).then(color => {
  setColorScheme(color);
});
```

## 设计令牌（Design Tokens）

MDUI 使用 CSS 自定义属性（CSS Variables）实现设计令牌，你可以轻松自定义全局样式：

```css
/* 修改圆角大小 */
:root {
  --mdui-shape-corner-medium: 0.5rem;
  --mdui-shape-corner-large: 1rem;
}

/* 修改动画时长 */
:root {
  --mdui-motion-duration-short2: 80ms;
  --mdui-motion-duration-medium2: 250ms;
}

/* 修改状态层不透明度 */
:root {
  --mdui-state-layer-hover: 0.12;
  --mdui-state-layer-pressed: 0.16;
}
```

## 响应式断点

MDUI 提供了一套响应式断点，方便进行适配：

| 断点名称 | 默认值 | 说明 |
|---------|--------|------|
| `xs` | `0px` | 超小屏幕 |
| `sm` | `600px` | 小屏幕 |
| `md` | `840px` | 中等屏幕 |
| `lg` | `1080px` | 大屏幕 |
| `xl` | `1440px` | 超大屏幕 |
| `xxl` | `1920px` | 超超大屏幕 |

在 JavaScript 中可以使用 `breakpoint` 函数进行断点判断：

```js
import { breakpoint } from 'mdui/functions/breakpoint.js';

// 判断当前是否大于等于 md 断点
if (breakpoint().gte('md')) {
  console.log('当前是大屏幕');
}
```

## 与框架集成

### React

```jsx
import { useEffect, useRef } from 'react';
import 'mdui/mdui.css';
import 'mdui/components/switch.js';

function App() {
  const switchRef = useRef(null);

  useEffect(() => {
    const handleChange = (e) => {
      console.log('Switch state:', e.target.checked);
    };
    switchRef.current?.addEventListener('change', handleChange);
    return () => {
      switchRef.current?.removeEventListener('change', handleChange);
    };
  }, []);

  return <mdui-switch ref={switchRef}></mdui-switch>;
}
```

### Vue

在 `vite.config.js` 中配置：

```js
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('mdui-'),
        },
      },
    }),
  ],
};
```

## 实用函数

MDUI 除了组件外，还提供了一些实用的工具函数：

| 函数 | 说明 |
|------|------|
| `snackbar()` | 显示底部提示条 |
| `dialog()` | 程序化打开对话框 |
| `alert()` / `confirm()` / `prompt()` | 系统弹窗 |
| `setTheme()` / `getTheme()` | 主题操作 |
| `setColorScheme()` / `removeColorScheme()` | 配色方案 |
| `setLocale()` / `getLocale()` / `loadLocale()` | 多语言 |
| `breakpoint()` | 响应式断点 |
| `throttle()` | 节流函数 |
| `observeResize()` | 监听元素尺寸变化 |

### Snackbar 示例

```js
import { snackbar } from 'mdui/functions/snackbar.js';

snackbar({
  message: '操作成功',
  action: '撤销',
  onActionClick: () => console.log('已撤销')
});
```

## 总结

MDUI v2 是一套功能完善、设计精美的 Web Components 组件库。无论你是进行原生 JavaScript 开发，还是使用 React、Vue、Angular 等框架，都能轻松集成 MDUI 来构建现代化的 Web 应用。

它的核心优势在于：

1. **零框架依赖** — 基于标准 Web Components，任何项目都能使用
2. **Material Design 3** — 紧跟最新设计规范
3. **完善的主题系统** — 深色模式、动态配色一应俱全
4. **优秀的开发体验** — TypeScript 支持、IDE 智能提示、详细的文档

如果你正在寻找一套轻量、美观、易用的 UI 组件库，不妨试试 MDUI v2。

---

**参考链接：**

- [MDUI 官方文档](https://www.mdui.org/zh-cn/docs/2/)
- [MDUI GitHub](https://github.com/zdhxiong/mdui)
- [Material Design 3 规范](https://m3.material.io/)
