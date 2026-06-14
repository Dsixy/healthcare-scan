# Vercel 部署指南

## 当前线上地址

**https://checker-gamma-five.vercel.app**

比 GitHub Pages 更简洁，推荐用这个链接发微信。

---

## 方式一：网页绑定 GitHub（推荐，自动部署）

1. 打开 [vercel.com/dashboard](https://vercel.com/dashboard)
2. 进入项目 **checker**（或新建 Import）
3. **Settings → Git** → Connect Git Repository
4. 选择 `Dsixy/healthcare-scan`
5. 若连接失败：GitHub → Settings → Applications → Vercel → 授权访问该仓库

绑定后，每次 `git push main` 会自动部署到 Vercel。

### 构建设置（一般自动识别，无需改）

| 项 | 值 |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 环境变量

在 **Settings → Environment Variables** 添加：

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_PUBLIC_URL` | `https://checker-gamma-five.vercel.app` | Production |

用于微信分享卡片图片地址。改域名后同步更新此项。

---

## 方式二：命令行手动部署

```bash
npx vercel login          # 首次登录
npx vercel --prod         # 部署到生产环境
```

---

## 改个更好看的域名

### 免费：Vercel 子域名

1. **Settings → Domains**
2. 可添加如 `healthcare-scan.vercel.app`（若未被占用）
3. 更新 `VITE_PUBLIC_URL` 为新地址后重新部署

### 付费：自己的域名

1. 购买域名后，在 Vercel **Domains** 添加
2. 按提示在 DNS 添加 CNAME 记录
3. 更新 `VITE_PUBLIC_URL` 并重新部署

---

## GitHub Pages 与 Vercel 并存

| 平台 | 地址 | 说明 |
|------|------|------|
| Vercel | `checker-gamma-five.vercel.app` | 根路径 `/`，封面图正常 |
| GitHub Pages | `dsixy.github.io/healthcare-scan/` | 需 `GITHUB_PAGES=true` 构建 |

日常分享用 **Vercel 链接**即可。
