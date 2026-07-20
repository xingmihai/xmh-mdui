---
title: MDUI v2 主题系统详解
date: 2026-07-15
tags: [技术, MDUI, 设计]
description: 深入了解 MDUI v2 的主题系统，包括亮色模式、暗色模式和动态配色。
cover: https://picsum.photos/seed/mdui/800/400
---

# MDUI v2 主题系统详解

MDUI v2 提供了完善的主题系统，支持 Material Design 3 的动态配色。

## 三种主题模式

- **亮色模式** (`mdui-theme-light`)
- **暗色模式** (`mdui-theme-dark`)
- **跟随系统** (`mdui-theme-auto`)

## 动态配色

使用 `setColorScheme` 函数可以从任意颜色生成完整的配色方案：

```javascript
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

setColorScheme('#0061a4');
```

## 设计令牌

MDUI 使用 CSS 自定义属性实现设计令牌，可以全局修改样式：

```css
:root {
  --mdui-shape-corner-large: 1.5rem;
}
```
