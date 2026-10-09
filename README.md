# Healthy Minds Finder

确定性的治疗师查找小工具（不是 AI 聊天）。React + TypeScript + Vite。
同一套组件、主题和逻辑同时生成：

- `dist/index.html`：给老板看的独立演示页（显示草稿数据和 TEST DEMO 横幅）
- `dist/widget.js`：嵌入 Squarespace 的单文件脚本（内含 React、CSS 和数据；只显示 `approved` 的治疗师）

> 状态：第二阶段视觉原型。结果页的匹配和治疗师卡片尚未实现（第三阶段）。

## 命令

```bash
npm install
npm run dev       # http://localhost:5173/  （端口固定，被占用时会报错而不是换端口）
npm run build     # 类型检查 + 生成 dist/index.html 和 dist/widget.js
npm run preview   # http://localhost:4173/  预览 dist 构建产物
npm test          # 单元测试（第三阶段添加）
```

## 源文件

| 文件 | 内容 |
|---|---|
| `src/config/content.ts` | 所有界面文案、选项标签、按钮、无障碍标签、通用链接（Owl Practice intake、团队页）、结果数量上限 |
| `src/data/therapists.json` | 治疗师数据：id、姓名、credentials、服务、年龄范围、话题、语言、个人页、active、reviewStatus、sortOrder |
| `src/logic/flow.ts` | 流程状态（useReducer），包括上游答案变化时清除失效的下游答案 |
| `src/logic/filter.ts` | 纯匹配逻辑（第三阶段） |
| `src/styles/theme.css` | 主题 token（颜色、字体、尺寸、间距、圆角、阴影、状态色） |
| `src/styles/component.css` | 组件样式，只使用 theme.css 的别名 |
| `src/components/*` | UI 组件，不含可编辑文案和链接 |
| `src/mount.tsx` | Shadow DOM 挂载 / 卸载（demo 与 widget 共用） |
| `src/embed.tsx` | widget.js 入口：生命周期、导航处理、`window.hmpFinder` |
| `src/demo.tsx`、`index.html`、`src/demo/demo.css` | 演示页 |

**这些都是源文件。修改后必须重新 `npm run build` 并重新部署 `dist`，线上网站才会变化。**

- 新增 / 修改 / 停用治疗师：只改 `therapists.json`（停用设 `"active": false`）。
- `credentials: null` 表示诊所尚未提供（TODO），界面不显示。
- 草稿记录（`"reviewStatus": "draft"`）只在演示页出现；审核后改为 `"approved"` 才会出现在正式网站。

## 主题 token

可在宿主元素或任意祖先元素上覆盖公开 token，例如：

```css
#hmp-finder-host { --hmp-yellow: #FFE680; --hmp-title-size: 26px; }
```

公开 token 以 `--hmp-` 开头（完整列表见 `src/styles/theme.css`）。默认值只写在私有别名 `--_hmp-*` 中，因此继承来的值优先。
字体不随 widget 打包：网站已加载 arboria / ivypresto-display 时使用它们，否则回退到 system-ui / Georgia。
