# Healthy Minds Finder

确定性的治疗师查找小工具（不是 AI 聊天，不调用任何后端）。React + TypeScript + Vite。
同一套组件、主题、流程和匹配逻辑生成两个产物：

- `dist/index.html`：独立演示页（显示草稿数据和 TEST DEMO 横幅）
- `dist/widget.js`：嵌入 Squarespace 的单个经典脚本（内含 React、CSS 和数据；只显示 `approved` 的治疗师）

答案只保存在内存中：不使用 localStorage，不做统计，不发送任何答案。

## 命令

```bash
npm install
npm run dev       # http://localhost:5173/  开发（端口固定，被占用时报错而不是换端口）
npm run build     # 类型检查 + dist/index.html + dist/widget.js
npm run preview   # http://localhost:4173/  预览 dist 构建产物
npm test          # 匹配逻辑与流程状态的单元测试
```

## 流程

欢迎页 → 服务类型 →（仅“儿童/青少年”）年龄段 → 话题 → 结果

- 返回会保留答案；改服务类型时只清除失效的年龄答案。
- 结果按 `sortOrder` 排序，先显示 3 位，点 “Show more therapists” 每次多显示 3 位（数量在 `content.ts` 的 `settings.resultsPageSize`）。
- 没有匹配时显示 “Our team can help.” 页（预约 intake / 修改选项 / 浏览团队）。**不会放宽条件**，服务和年龄要求始终保留。
- 关闭面板不清空答案；“Start again” 才清空。

## 源文件（修改后必须重新 build 并部署 dist，线上才会变化）

| 文件 | 内容 |
|---|---|
| `src/config/content.ts` | 所有界面文案、选项标签、按钮、无障碍标签、通用链接（Owl Practice intake、团队页、Affordable therapy 页）、每页结果数 |
| `src/data/therapists.json` | 治疗师数据。前半部分是个人页资料：id、name、title、creds、approaches、focus、serves、langs、url、active、status、format、avail、fees；后半部分是匹配字段：reviewStatus、sortOrder、services、childMin/childMax、topics |
| `src/logic/filter.ts` | 纯匹配逻辑（无 React / DOM / 网络） |
| `src/logic/flow.ts` | 流程状态（useReducer）与下游答案失效规则 |
| `src/styles/theme.css` / `component.css` | 主题 token / 组件样式 |
| `src/components/*` | UI 组件（不含可编辑文案和链接） |
| `src/mount.tsx` | Shadow DOM 挂载 / 卸载（demo 与 widget 共用） |
| `src/embed.tsx` | widget.js 入口：生命周期、导航处理、`window.hmpFinder` |
| `index.html`、`src/demo.tsx`、`src/demo/demo.css` | 演示页 |

治疗师数据：

- 新增 / 修改 / 停用治疗师只改 `therapists.json`；停用设 `"active": false`（任何模式下都不显示）。
- 卡片显示：姓名；`creds` · `title` 的第一段（以 `|` 分隔）；“Practice focus:” 加 `focus` 的前 3 项（数量见 `content.ts` 的 `settings.cardFocusCount`）；`status`；“View profile →”。`approaches`、`serves`、`langs`、`format`、`avail`、`fees` 只保存，不显示。
- 匹配只看 `services`、`childMin`/`childMax`、`topics`，不会读取 `focus` 或 `serves` 的文字。修改个人页资料后，如有需要请同步检查匹配字段。
- `"reviewStatus": "draft"` 只在演示页出现；诊所审核后改为 `"approved"` 才会出现在正式网站。**目前 10 条全部是 draft，所以正式网站暂时只会显示“Our team can help.”页。**
- 话题 ID：A 压力/焦虑，G 悲伤/失去，R 关系，L 人生变化，M 情绪低落（X “不确定” 不写在治疗师上）。

## 部署到 GitHub Pages

仓库：https://github.com/shuxu1998/healthy-minds-finder

`.github/workflows/deploy.yml` 会在每次推送到 `main` 时自动运行 `npm ci`、`npm test`、`npm run build`，并把 `dist` 发布到 GitHub Pages。测试或构建失败时不会发布。

1. 首次使用：仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**（只需设置一次）。
2. 之后每次 `git push`，在仓库的 Actions 页可以看到部署进度，通常一两分钟完成。
3. 发布后：
   - 演示页：https://shuxu1998.github.io/healthy-minds-finder/
   - 小工具：https://shuxu1998.github.io/healthy-minds-finder/widget.js

所有路径都是相对路径，不需要自定义域名，也不假设部署在域名根目录。

## Squarespace Footer Code Injection

Settings → Advanced → Code Injection → Footer：

```html
<script
  src="https://shuxu1998.github.io/healthy-minds-finder/widget.js"
  defer
></script>
```

建议先只在一个加密码的测试页验证（可选属性 `data-pages`，逗号分隔路径，不写则全站显示）：

```html
<script src="https://shuxu1998.github.io/healthy-minds-finder/widget.js" data-pages="/finder-test" defer></script>
```

小工具不会自动打开面板。网站无需安装 React。

### 生命周期与导航

- 宿主元素 `#hmp-finder-host` 是 `<body>` 的直接子元素，使用 open Shadow DOM，CSS 注入在 shadow root 内，不修改网站全局样式。
- 重复执行脚本（例如 Footer 中重复粘贴）时，新脚本先销毁旧实例，页面上始终只有一个宿主、一个 React root、一组监听器。
- `window.hmpFinder.destroy()` 完全卸载（移除宿主、React root、observer、监听器）；`window.hmpFinder.mount()` 重新挂载（可重复调用）。
- 导航处理：一个 MutationObserver 只监听 `<html>` 和 `<body>` 的**直接子元素**（不监听子树）。如果 Squarespace 移除了宿主或替换了 `<body>`，会自动重新挂载；`popstate` / `pageshow` 时重新检查 `data-pages`。
- 局限：不修改 `history.pushState`。如果模板用 pushState 换页且不改动 `<body>` 的直接子元素，`data-pages` 的路径检查要等下一次 `popstate` / 刷新才会生效（不使用 `data-pages` 时无影响）。

## 主题 token

可在宿主元素或任意祖先元素上覆盖公开 token：

```css
#hmp-finder-host { --hmp-yellow: #FFE680; --hmp-title-size: 26px; }
```

公开 token 以 `--hmp-` 开头（完整列表见 `src/styles/theme.css`）。默认值只写在私有别名 `--_hmp-*` 中，因此继承来的值优先。
字体不随 widget 打包：网站已加载 arboria / ivypresto-display 时使用它们，否则回退到 system-ui / Georgia。按钮字距 0.15em 为 TODO，待与网站核对。

## 已知 TODO

- Kimberly Cartwright 的 `status` 为 “Currently on Leave” 但 `active` 为 true：会出现在结果里，卡片显示 “Currently on Leave”。如不希望显示，把 `active` 改为 false。
- 所有记录仍是 draft，需诊所逐条审核后改为 approved。
- Sarah Brown 的家庭治疗：资料原文为 “Family sessions for existing clients”，需诊所确认是否应对新来访者显示。
- Figma 需要登录，未能查看；布局依据现有实现与用户提供的截图。
