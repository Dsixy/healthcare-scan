# 自定义域名（可选）

若希望分享链接不出现 `github.io`，可绑定自己的域名。

## 步骤

1. 购买域名（如 `fujian-health.example.com`，约几十元/年）
2. 在域名 DNS 添加记录：
   - 类型：`CNAME`
   - 主机记录：`www`（或 `@` 视服务商而定）
   - 记录值：`dsixy.github.io`
3. 在本仓库 `public/` 下新建文件 `CNAME`，内容一行：
   ```
   www.你的域名.com
   ```
4. GitHub 仓库 → **Settings → Pages → Custom domain** 填入域名并保存
5. 构建时设置环境变量（GitHub Actions Secrets 或本地）：
   ```
   VITE_PUBLIC_URL=https://www.你的域名.com
   ```
6. 重新部署后，微信分享链接改为新域名即可

## 免费替代

- 继续用 `https://dsixy.github.io/healthcare-scan/`，页面内已统一为「福健健康体检中心」品牌，链接本身不显示 GitHub 字样
- 或使用短链服务（如 dwz.cn）把长链接缩短，分享时更简洁
