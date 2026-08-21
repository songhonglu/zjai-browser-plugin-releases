# ZJAI 公开发布页设计

## 1. 方向与参考

- 默认浅色，使用暖白画布与墨蓝文字；深色采用近黑画布、青蓝/紫色径向光晕和低反射深色表面。
- 氛围参考 `vkr.me` 的多层暗色光与安静留白；层级参考 Vercel 的精确卡片边缘与克制阴影。只借鉴视觉规律，不复制其品牌或内容。
- 访客路径：识别产品与最新版本 → 下载或查看历史版本 → 阅读更新、安装步骤与历史记录。

## 2. Tokens

- Font: `"PingFang SC", "Microsoft YaHei", Arial, sans-serif`; technical labels use `ui-monospace, SFMono-Regular, Menlo, monospace`.
- Light: canvas `#f7f7f2`, canvasGlow `#eaf2ff`, surface `#ffffff`, surfaceSoft `#f2f5fa`, ink `#111827`, muted `#667085`, accent `#155eef`, accentStrong `#004eeb`, line `rgba(17,24,39,.12)`.
- Dark: canvas `#070a12`, canvasGlow `#111d35`, surface `rgba(14,20,33,.84)`, surfaceSoft `rgba(255,255,255,.06)`, ink `#f7f7f2`, muted `#aab6c8`, accent `#8fc7ff`, accentStrong `#c8e5ff`, line `rgba(255,255,255,.14)`.
- Focus: `#3b82f6`; hero text uses current theme ink/muted roles. Content width `1120px`; spacing uses a 4px base with `8/12/16/24/32/40/48/64/80px` steps.
- Radius: 8px controls, 18px surfaces, 999px status badge only. Card depth: `0 0 0 1px var(--line), 0 18px 50px rgba(17,24,39,.08)` in light and a matching dark shadow in dark.

## 3. Typography and layout

- Display title: 48px / 1.08 / 600 desktop, 36px mobile; letter spacing `-.04em`; use `text-wrap: balance`.
- Section title: 28px / 1.2 / 600; body 16px / 1.7 / 400; metadata 12px mono with tabular numbers.
- Header keeps the brand left and theme selection right. Hero is a single focal release card. Update highlights use a non-uniform grid; installation and history stay readable, card-bounded sections.

## 4. Primitives and states

- Theme selection is a two-button native `role="group"` control: `浅色` and `深色`. The active button has high contrast and `aria-pressed="true"`; the inactive button remains plainly visible.
- Primary download is a filled accent control; secondary navigation is tonal; release download is an underlined textual action.
- Cards are live HTML surfaces, never images. Download links and Worker-backed counters preserve their existing behavior.

## 5. Motion

- Theme change uses the browser View Transition API only where supported, with a 180ms opacity fade; otherwise it changes immediately. Reduced-motion always changes immediately.
- Button hover/press uses existing transform-only feedback; no decorative motion on non-interactive cards.

## 6. Responsive behavior

- 1280px: full header, non-uniform highlight grid, three-column install list.
- 768px: header and cards retain two-column rhythm where content permits.
- 375px: header stacks brand and theme selection; all content, version rows and install steps stack without clipping.

## 7. Accessibility constraints

- Default theme is always light. Only an explicit stored selection enables dark mode; system preference never overrides this default.
- Theme buttons are keyboard reachable with visible focus, informative pressed states, and 44px minimum hit areas.
- Theme persistence uses local storage defensively; blocked storage or invalid values fall back to light without blocking the page.
- Counters keep `aria-live="polite"`; failed counting never blocks a standard ZIP link.

## 8. Accepted debt

- No custom font or bitmap hero is loaded, to keep the static GitHub Pages route lightweight. The visual signature is CSS lighting and typography.
