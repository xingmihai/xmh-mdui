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



graph TD
    Start([画面帧输入]) --> CheckName{1. 前置哨兵: Name Box 是否有字?}
    CheckName -- 无文字 --> Exit([Fail-Fast 退出: 非对话场景])
    CheckName -- 有文字 --> CheckTitle{2. 检测 Title 称号框}

    CheckTitle -- 存在 --> AddTitleOffset[累加 Title 偏置: Y + 25] --> CheckAlias
    CheckTitle -- 不存在 --> CheckAlias{3. 检测 Alias 别名框}

    CheckAlias -- 存在 --> AddAliasOffset[累加 Alias 偏置: Y + 30] --> ApplyCoords
    CheckAlias -- 不存在 --> ApplyCoords[计算出最终的 dl 正文 Bounding Box]

    ApplyCoords --> CheckDL2{4. 反向高位检测 dl2 行?}
    CheckDL2 -- 存在 --> TwoLines[当前一定为双行对话] --> DetectChoices
    CheckDL2 -- 不存在 --> OneLine[单行对话, 仅识别 dl1] --> DetectChoices

    DetectChoices{5. 反向高位检测 Choice3?}
    DetectChoices -- 存在 --> C3[判定为 3 个分支选项]
    DetectChoices -- 否 --> CheckC2{6. 检测 Choice2?}
    CheckC2 -- 存在 --> C2[判定为 2 个分支选项]
    CheckC2 -- 否 --> CheckC1{7. 检测 Choice1?}
    CheckC1 -- 存在 --> C1[1 个分支选项]
    CheckC1 -- 否 --> C0[无分支纯对话场景]
