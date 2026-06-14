# HealthScan Pro

整蛊向 AI 全身体检 H5。上传脸照 → 假分析动画 → 生成详细体检报告。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

产物在 `dist/` 目录，是纯静态文件，可部署到任意静态托管。

---

## 分享到微信（让别人手机上用）

核心思路：**把网站部署到公网 HTTPS 地址 → 把链接发到微信 → 对方点开即用**。

微信里打开的是内置浏览器，本项目是 H5，**不需要**做微信小程序、也不需上架应用商店。

### 第一步：部署到公网（必须 HTTPS）

任选一种（都免费）：

#### 方案 A：Vercel（推荐，最简单）

1. 代码推到 GitHub（见下方「初始化 Git」）
2. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
3. Import 这个仓库，框架选 **Vite**，直接 Deploy
4. 得到地址，例如：`https://healthscan-xxx.vercel.app`

本地也可不绑 Git，安装 Vercel CLI 后：

```bash
npm i -g vercel
npm run build
vercel --prod
```

#### 方案 B：Cloudflare Pages

1. 代码推到 GitHub
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create project
3. 构建设置：`npm run build`，输出目录 `dist`
4. 得到 `https://xxx.pages.dev` 地址

#### 方案 C：国内访问更快

- **腾讯云静态网站托管** / **阿里云 OSS + CDN**
- **Gitee Pages**（需实名，构建后上传 `dist` 内容）

> 微信要求链接必须是 **https://**，`http://localhost` 只能本机调试，无法发给别人。

### 第二步：分享到微信

| 方式 | 做法 |
|------|------|
| **直接发链接** | 复制 `https://你的域名` 发到微信好友/群聊，对方点击即可 |
| **二维码** | 用 [草料二维码](https://cli.im/) 等工具把链接生成二维码，保存图片发群或打印 |
| **朋友圈** | 不适合直接贴链接；可发二维码图片，或发「私信发你链接」 |

链接卡片标题/摘要来自 `index.html` 里的 Open Graph 标签。分享预览图需把 `public/og.png`（建议 300×300 以上 PNG）部署后可通过 `https://你的域名/og.png` 访问。

### 第三步：手机自测清单

部署完成后，**用微信扫二维码或点链接**，确认：

- [ ] 首页能填年龄、性别、身高、体重
- [ ] 「拍照 / 选择照片」能调起相册或相机
- [ ] 分析动画进度正常
- [ ] 报告能展开/折叠，能「保存长图」

### 局域网临时调试（仅同一 WiFi）

不能发微信，但可让旁边的人先试：

```bash
npm run dev -- --host
```

终端会显示 `Network: http://192.168.x.x:5173/`，同一 WiFi 的手机浏览器可访问（微信内打 IP 有时受限，建议先用 Safari/Chrome 测）。

---

## 初始化 Git（部署前建议）

```bash
git init
git add .
git commit -m "Initial commit: HealthScan Pro H5"
```

在 GitHub 新建仓库后：

```bash
git remote add origin https://github.com/你的用户名/healthscan.git
git push -u origin main
```

---

## 说明

- 照片仅在浏览器本地处理，不上传服务器
- 报告仅供娱乐，非医疗诊断
- 微信内「分享」按钮在部分机型上不可用，可改用「保存长图」后手动发图
