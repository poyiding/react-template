# React Template

一套轻量的 React 企业项目基础模板，先完成核心层，不预置复杂企业能力。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Ant Design
- ESLint
- Prettier


## 环境要求

建议团队统一使用以下版本，避免不同机器上的依赖解析和构建结果不一致。

- Node.js：建议使用 20 LTS 或 22 LTS，最低要求 `>=20.9.0`
- pnpm：建议通过 Corepack 使用 `package.json` 中 `packageManager` 声明的版本；最低要求 `>=10.6.5`

本项目已在 `package.json` 中声明 `engines`，并通过 `packageManager` 指定 pnpm 版本。新电脑建议先启用 Corepack：

```bash
corepack enable
node -v
pnpm -v
```

## 推荐编辑器插件

VS Code / Cursor 打开项目后会提示安装 `.vscode/extensions.json` 中的推荐插件。

建议先安装：

- ESLint
- Prettier
- EditorConfig
- Vite
- Error Lens

## 启动

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

## 目录说明

```txt
src/api        接口请求与 http 实例
src/assets     静态资源
src/components 通用组件
src/hooks      通用 hooks
src/layouts    页面布局
src/pages      页面
src/router     路由配置
src/stores     全局状态
src/styles     全局样式
src/types      通用类型
src/utils      工具方法
```
