# ZJAI 公开发布页设计

## Tokens

- Font: `"Microsoft YaHei", Arial, sans-serif`
- Text: `#111827`; muted: `#64748b`; primary: `#2563eb`; primary hover: `#1d4ed8`; accent: `#0ea5e9`
- Surface: `#ffffff`; page background: `#f8fafc`; top background: `#eef6ff`; border: `#e5e7eb`; dark panel: `#0f172a`
- Hero text: `#dbeafe`; hero eyebrow: `#bae6fd`; hero border: `#7dd3fc`; hero chip: `#e0f2fe`; focus: `#93c5fd`
- Hover surface: `#f0f9ff`; hero shadow: `rgba(15,23,42,.12)`
- Radius: 6px controls; 8px cards; 10px release banner
- Shadow: `0 18px 50px rgba(15,23,42,.12)` for the hero panel only
- Spacing: 4px base; `8px`, `12px`, `16px`, `24px`, `32px`, `40px`, `48px`, `64px`; content width `1080px`
- Type: `12px`, `14px`, `16px`, `20px`, `28px`, `40px`

## Primitives

- Header: compact brand mark, product name, and release-channel label.
- Latest release card: version, release date, capability summary, primary download, and checksum-free installation hint.
- Section card: bordered white surface with an 8px radius and 24px inner spacing.
- Version row: only publicly released versions from v3.4.8 onward; version/date and an asynchronous same-origin `downloads.json` counter at the start. The value is the version's historical baseline plus GitHub Release downloads accrued after this release-page migration, refreshed every hour; release note and package link stay at the end; stack vertically below 680px.
- Footer: centered `ZJAI-PLUGIN · 公开安装包` label.

## Accessibility

- All downloads are standard links with descriptive accessible names.
- Color is never the only release-status signal.
- Focus uses a visible blue outline; reduced-motion users receive no non-essential transitions.
- Download counters use an `aria-live="polite"` status; API failure falls back to “暂不可用” without blocking the package link.
