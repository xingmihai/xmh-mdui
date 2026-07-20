---
title: GitHub 仓库卡片展示
date: 2026-07-21
tags: ["MDUI", "GitHub", "组件"]
description: 展示如何在 MDUI 博客中嵌入带有 GitHub 仓库信息的交互式卡片，包含头像、Stars、Forks、License 徽章。
---

# GitHub 仓库卡片

> 以下展示了如何在博客文章中嵌入美观的 GitHub 仓库信息卡片，使用 MDUI 组件 + Shields 徽章实现。

## 卡片效果

<mdui-card class="friend-card" style="max-width: 480px; padding: 20px; margin: 16px 0; cursor: pointer;" onclick="window.open('https://github.com/xingmihai/xmh-mdui', '_blank')">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
    <mdui-avatar src="https://github.com/xingmihai.png" style="width: 56px; height: 56px;" alt="xingmihai"></mdui-avatar>
    <div style="flex: 1; min-width: 0;">
      <div class="mdui-typescale-title-large" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        xingmihai / xmh-mdui
      </div>
      <div class="mdui-typescale-body-small" style="opacity: 0.6; margin-top: 4px;">
        MDUI v2 个人博客主题
      </div>
    </div>
    <mdui-icon name="open_in_new" style="opacity: 0.4;"></mdui-icon>
  </div>
  <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
    <img src="https://img.shields.io/github/stars/xingmihai/xmh-mdui?style=social" alt="Stars" style="height: 20px; min-height: auto;">
    <img src="https://img.shields.io/github/forks/xingmihai/xmh-mdui?style=social" alt="Forks" style="height: 20px; min-height: auto;">
    <img src="https://img.shields.io/github/license/xingmihai/xmh-mdui" alt="License" style="height: 20px; min-height: auto;">
  </div>
</mdui-card>

## 代码实现

将以下代码复制到你的 Markdown 文章中即可：

```html
<mdui-card class="friend-card" style="max-width: 480px; padding: 20px; margin: 16px 0; cursor: pointer;" onclick="window.open('https://github.com/xingmihai/xmh-mdui', '_blank')">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
    <mdui-avatar src="https://github.com/xingmihai.png" style="width: 56px; height: 56px;" alt="xingmihai"></mdui-avatar>
    <div style="flex: 1; min-width: 0;">
      <div class="mdui-typescale-title-large" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        xingmihai / xmh-mdui
      </div>
      <div class="mdui-typescale-body-small" style="opacity: 0.6; margin-top: 4px;">
        MDUI v2 个人博客主题
      </div>
    </div>
    <mdui-icon name="open_in_new" style="opacity: 0.4;"></mdui-icon>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <img src="https://img.shields.io/github/stars/xingmihai/xmh-mdui?style=social" alt="Stars" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/forks/xingmihai/xmh-mdui?style=social" alt="Forks" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/license/xingmihai/xmh-mdui" alt="License" loading="lazy" style="height: 20px;">
  </div>
</mdui-card>
```

## 通用模板

如果你想展示其他仓库，只需替换以下变量：

| 变量 | 示例值 | 说明 |
|------|--------|------|
| `用户名` | `xingmihai` | GitHub 用户名 |
| `仓库名` | `xmh-mdui` | 仓库名称 |
| `头像URL` | `https://github.com/xingmihai.png` | GitHub 头像地址 |
| `描述` | `MDUI v2 个人博客主题` | 仓库简介 |

### 替换后的通用代码

```html
<mdui-card class="friend-card" style="max-width: 480px; padding: 20px; margin: 16px 0; cursor: pointer;" onclick="window.open('https://github.com/用户名/仓库名', '_blank')">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
    <mdui-avatar src="https://github.com/用户名.png" style="width: 56px; height: 56px;" alt="用户名"></mdui-avatar>
    <div style="flex: 1; min-width: 0;">
      <div class="mdui-typescale-title-large" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        用户名 / 仓库名
      </div>
      <div class="mdui-typescale-body-small" style="opacity: 0.6; margin-top: 4px;">
        仓库描述
      </div>
    </div>
    <mdui-icon name="open_in_new" style="opacity: 0.4;"></mdui-icon>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <img src="https://img.shields.io/github/stars/用户名/仓库名?style=social" alt="Stars" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/forks/用户名/仓库名?style=social" alt="Forks" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/license/用户名/仓库名" alt="License" loading="lazy" style="height: 20px;">
  </div>
</mdui-card>
```

## 更多 Shields 徽章

除了 Stars、Forks、License，你还可以添加更多徽章：

```html
<!-- 最新 Release 版本 -->
<img src="https://img.shields.io/github/v/release/用户名/仓库名" alt="Release">

<!-- 最后提交时间 -->
<img src="https://img.shields.io/github/last-commit/用户名/仓库名" alt="Last Commit">

<!-- 代码语言占比 -->
<img src="https://img.shields.io/github/languages/top/用户名/仓库名" alt="Top Language">

<!-- 仓库大小 -->
<img src="https://img.shields.io/github/repo-size/用户名/仓库名" alt="Repo Size">

<!-- Issues 数量 -->
<img src="https://img.shields.io/github/issues/用户名/仓库名" alt="Issues">

<!-- PR 数量 -->
<img src="https://img.shields.io/github/issues-pr/用户名/仓库名" alt="Pull Requests">
```

## 完整效果示例（多仓库）

<mdui-card class="friend-card" style="max-width: 480px; padding: 20px; margin: 16px 0; cursor: pointer;" onclick="window.open('https://github.com/xingmihai/xmh-mdui', '_blank')">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
    <mdui-avatar src="https://github.com/xingmihai.png" style="width: 56px; height: 56px;" alt="xingmihai"></mdui-avatar>
    <div style="flex: 1; min-width: 0;">
      <div class="mdui-typescale-title-large" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        xingmihai / xmh-mdui
      </div>
      <div class="mdui-typescale-body-small" style="opacity: 0.6; margin-top: 4px;">
        MDUI v2 个人博客主题
      </div>
    </div>
    <mdui-icon name="open_in_new" style="opacity: 0.4;"></mdui-icon>
  </div>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <img src="https://img.shields.io/github/stars/xingmihai/xmh-mdui?style=social" alt="Stars" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/forks/xingmihai/xmh-mdui?style=social" alt="Forks" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/license/xingmihai/xmh-mdui" alt="License" loading="lazy" style="height: 20px;">
    <img src="https://img.shields.io/github/last-commit/xingmihai/xmh-mdui" alt="Last Commit" loading="lazy" style="height: 20px;">
  </div>
</mdui-card>
