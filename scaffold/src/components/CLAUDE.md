# components/
> L2 | 父级: scaffold/src/

动画、UI 原语、产品 mockup 模板 — 场景组件的构建砖块

## 成员清单

- `Animations.tsx`: 动画原语 (FadeIn, ScaleIn, SplitText, Typewriter, CountUp), 基于 remotion spring/interpolate
- `Background.tsx`: 背景渲染组件
- `UI.tsx`: UI 原语 (GlassPanel, BrandIcon, GradientText, GradientBar), 无动画的静态视觉元素
- `MockupTemplates.tsx`: 产品 UI 模拟模板 (DataTable, KanbanBoard, TerminalWindow, AnalyticsDashboard, BrowserFrame), 场景级即插即用 mockup

## 依赖关系

```
theme.ts ← Animations.tsx (间接, 通过消费者)
theme.ts ← UI.tsx
theme.ts ← MockupTemplates.tsx
remotion  ← Animations.tsx, MockupTemplates.tsx
```

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
