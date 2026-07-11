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

项目统一使用以下开发环境：

- Node.js：`24.18.0`（24 LTS）
- pnpm：`11.10.0`

Node 版本同时记录在 `.nvmrc` 和 `.node-version` 中，分别兼容 nvm 以及 mise、asdf 等版本管理工具。`package.json` 的 `engines` 和 `.npmrc` 会拒绝不兼容的 Node 或 pnpm 版本。

使用 nvm 初始化环境：

```bash
nvm install
nvm use
corepack enable
corepack install
node -v
pnpm -v
```

版本输出应分别为 `v24.18.0` 和 `11.10.0`。请不要绕过 Corepack 全局安装其他 pnpm 版本。

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

## 提交规范

项目使用 Husky、lint-staged 和 commitlint 统一提交质量：

- `pre-commit`：对暂存的 JavaScript/TypeScript 文件执行 ESLint，对暂存的配置、样式和文档执行 Prettier 检查；存在错误或警告时禁止提交。
- `commit-msg`：校验提交信息是否符合 Conventional Commits。

提交信息格式：

```txt
<type>(<scope>): <subject>
```

常用类型包括 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore` 和 `revert`。例如：

```txt
feat(auth): add login page
fix(router): handle unknown routes
docs: update environment setup
```

安装依赖时会通过 `prepare` 脚本自动启用 Git Hooks，无需手动初始化。

## 常用命令

```bash
pnpm lint
pnpm lint:staged
pnpm typecheck
pnpm build
pnpm preview
```

## 生产级完善路线

项目计划沿用 React、Vite、React Router、Zustand 和 Axios，并参考 Ant Design Pro，引入 Pro Components、TanStack Query、测试与 Mock、OpenAPI 代码生成以及统一路由权限配置。

分阶段任务、优先级和验收标准见 [`docs/production-roadmap.md`](docs/production-roadmap.md)。

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
