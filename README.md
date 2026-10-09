# Healthy Minds Finder

独立演示网站 + 可嵌入 Squarespace Footer 的小工具。代码、样式、治疗师资料分开维护。无语言筛选。公开演示使用 draft 数据并显示 TEST DEMO。

## 最快上线看效果

1. 打开 https://app.netlify.com/drop 并登录自己的 Netlify 账户，以便管理网站。
2. 将本项目中的 public 文件夹拖进去。必须是 public，不是 src，也不是整个仓库文件夹。
3. 得到一个 netlify.app 地址。这是独立演示网站，可发给老板，不会修改诊所网站。
4. 手动拖放不执行构建，包中的 public 已生成。如果修改源文件，先运行 python3 build.py 再拖放。

演示站默认可公开访问。noindex 只是请求搜索引擎不收录，不是访问密码。不要上传病人资料或未公开内容。Netlify 套餐和用量以你的账户显示为准。

## 上传 GitHub

1. 登录 GitHub，New repository，名称 healthy-minds-finder，可选 Private。
2. 创建时勾选 Add a README file 以方便进入文件界面。
3. Add file → Upload files。把解压后 repo 文件夹里的 src、public、build.py、netlify.toml、README.md 等拖入；不是上传 zip，也不要多套一层目录。
4. Commit changes。仓库根目录应直接看到 src、public、build.py、netlify.toml。
5. 可以用包内 README 替换初始化 README。GitHub 仓库地址用于管理，不放进 script src。

## GitHub 连接 Netlify

在 Netlify 选择 Add new project → Import an existing project → GitHub，授权该仓库并选择它。Base directory 留空；Build command 为 python3 build.py；Publish directory 为 public。netlify.toml 已包含这些配置。部署后打开网站测试。

如果你先做了 Drop 演示，可以在现有项目里连接 Git 仓库，或新建 Git 项目并使用新地址；不要把旧项目地址误当成新项目地址。连接后，对部署分支的提交会自动构建更新演示站。

## Squarespace Footer 小范围验证

先只在独立演示站验证，不必立即操作正式诊所网站。

之后在 Squarespace Core 的 Code Injection → Footer 加以下代码，用实际 Netlify 地址替换占位符：

```html
<script defer
  src="https://YOUR-DEMO.netlify.app/widget.js"
  data-pages="/finder-test">
</script>
```

创建 /finder-test 页面并加页面密码。data-pages 限制小工具只在这个路径初始化；访问主页不会显示，但全站 Footer 的外部脚本请求仍可能发生。这不是隔离部署，正式网站最早的测试也可以使用该测试页自身的 Code Block 放这段加载代码。

移除先前粘贴的旧演示代码，避免同时安装两种版本。脚本会自动挂载，不再依赖 HTML anchor。多次加载会停止旧实例；正常 DOM 导航变化时按路径检查挂载状态。具体 Squarespace 模板仍需实测。

Footer 的 src 指向部署后的 widget.js，不是 GitHub 仓库页，也不是 index.html。将 data-pages 改为 / 表示首页，改为 * 表示所有路径。测试时保留 /finder-test。

## 固定版本

给老板看的演示网址可跟随最新部署。正式诊所网站选用 Netlify 某次部署的 Deploy permalink 加 /widget.js，例如：

https://DEPLOY-ID--YOUR-SITE.netlify.app/widget.js

必须从 Netlify 复制真实 permalink，不要自行猜测 DEPLOY-ID。它锁定一次部署，与随后主分支更新分开；保留该部署，删除后链接可能不可用。需要升级时先测新部署，再改 Footer 的 src。恢复旧 permalink 可回滚。

## 源文件

- src/therapists.json：人员、标签、语言展示、active、reviewStatus、sortOrder。
- src/config.json：demoMode、公共链接和版本。
- src/matcher.mjs：筛选逻辑。
- src/widget.js：交互源码模板。
- src/widget.css：组件样式。
- build.py：构建外部可加载的 public/widget.js，内含CSS和数据，不依赖远程fetch。
- public/index.html、public/demo.css：给老板看的演示网页，与正式诊所网页独立。

新增人员改 JSON，离职设 active=false。生产前逐条审核记录，再将其 reviewStatus 改为 approved，最后把 demoMode 改为 false 并构建。未经审核的草案不会在生产模式展示。

## 验证状态

筛选规则42种组合、年龄边界、停用以及draft排除已检查；外部脚本语法已检查。尚未在真实浏览器或Squarespace模板中完成交互验证。请测试打开、下一步、返回、关闭、重新打开、3条示例路径、手机滚动、个人页及预约链接。测试不提交预约。

参考：https://docs.netlify.com/start/quickstarts/deploy-from-repository/ 和 https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/
