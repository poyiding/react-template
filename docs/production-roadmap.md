# Vite 版精简 Ant Design Pro 完善路线图

本文档用于指导当前项目逐步演进为团队生产级 React 后台脚手架。目标不是复刻 Ant Design Pro 的全部能力，而是在保留 Vite 技术栈透明度和可控性的基础上，吸收其布局、页面模板、数据请求、权限和工程质量体系。当前实施范围只包含 P0 和 P1，P2 团队治理能力暂不考虑。

## 1. 目标技术栈

| 领域          | 选型                             | 职责                                |
| ------------- | -------------------------------- | ----------------------------------- |
| UI 框架       | React 19                         | 组件和页面渲染                      |
| 开发语言      | TypeScript                       | 严格类型约束                        |
| 构建工具      | Vite                             | 开发服务器、构建和拆包              |
| 路由          | React Router                     | 路由匹配、懒加载和导航              |
| UI 组件       | Ant Design                       | 基础 UI 组件和主题 Token            |
| 后台复合组件  | Pro Components                   | 布局、页面容器、表格和表单          |
| 客户端状态    | Zustand                          | 会话、主题和布局等客户端状态        |
| 服务端状态    | TanStack Query                   | 请求缓存、刷新、重试和失效          |
| HTTP 客户端   | Axios                            | 请求实例、认证和错误归一化          |
| API 生成      | Orval                            | 根据 OpenAPI 生成类型和 Query Hooks |
| 环境校验      | Zod                              | 启动时校验环境变量和运行时数据      |
| 接口 Mock     | MSW                              | 开发环境和测试环境接口模拟          |
| 单元/组件测试 | Vitest + Testing Library         | 工具、Hooks、Store 和组件测试       |
| 端到端测试    | Playwright                       | 核心用户流程测试                    |
| 代码质量      | ESLint + Prettier                | 静态检查和格式统一                  |
| 提交质量      | Husky + lint-staged + commitlint | 提交前检查和提交信息规范            |

## 2. 设计原则

1. 服务端数据使用 TanStack Query，不复制到 Zustand。
2. Zustand 只保存跨页面客户端状态，例如当前用户、主题和侧栏状态。
3. 搜索条件、分页和可分享的页面状态优先放入 URL。
4. 路由、菜单、面包屑、标题和权限使用同一份元数据。
5. API 生成代码与手写代码分离，禁止直接修改生成目录。
6. 公共抽象至少经过两个真实业务场景验证，避免提前设计万能组件。
7. 每个阶段必须独立可运行、可测试、可回滚，不进行一次性大重构。

## 3. 目标目录结构

目录暂时沿用 Ant Design Pro 风格，按“应用基础设施 + 路由页面”组织：

```text
src/
├── app/
│   ├── bootstrap/          # 应用启动和会话恢复
│   ├── providers/          # Query、主题、错误边界等 Provider
│   └── query-client.ts
├── api/
│   ├── client/             # Axios 实例、拦截器和错误模型
│   ├── generated/          # OpenAPI 自动生成，禁止手改
│   └── adapters/           # DTO 到领域模型的转换
├── components/             # 无具体业务含义的公共组件
├── config/                 # 应用、主题和环境配置
├── hooks/
├── layouts/
├── mocks/                  # MSW handlers 和模拟数据
├── pages/                  # 按路由组织的页面及页面私有组件
│   ├── Dashboard/
│   ├── Login/
│   ├── NotFound/
│   └── System/
│       ├── RoleManagement/
│       └── UserManagement/
├── router/
│   ├── routes.tsx          # 统一路由元数据
│   ├── guards.tsx
│   └── permissions.ts
├── stores/                 # 纯客户端全局状态
├── styles/
├── test/                   # 测试初始化和测试工具
├── types/
└── utils/
```

页面继续按 `pages` 组织。只被单个页面使用的组件、Hooks 和类型就近放在页面目录内；无具体业务含义且被多个页面复用的内容再提升到 `components`、`hooks` 或 `types`。暂不引入 `features` 目录，后续只有在出现跨多个路由复用的复杂业务能力时再评估。

## 4. 实施总览

| 阶段                | 优先级 | 主要结果                        | 前置依赖  |
| ------------------- | ------ | ------------------------------- | --------- |
| 0. 建立基线         | P0     | 可重复验证当前项目              | 无        |
| 1. 应用骨架与性能   | P0     | ProLayout、路由懒加载、异常兜底 | 阶段 0    |
| 2. 数据请求基础设施 | P0     | Axios 错误模型、TanStack Query  | 阶段 1    |
| 3. 认证与权限       | P0     | 会话恢复、统一权限模型          | 阶段 2    |
| 4. 统一路由元数据   | P0     | 路由生成菜单、面包屑和权限      | 阶段 3    |
| 5. 标准业务页面     | P1     | ProTable、ProForm 和详情模板    | 阶段 2、4 |
| 6. 测试与 Mock      | P1     | Vitest、Testing Library、MSW    | 阶段 2、3 |
| 7. OpenAPI 代码生成 | P1     | 类型和 Query Hooks 自动生成     | 阶段 2    |
| 8. CI 与交付        | P1     | 自动检查、构建、部署基线        | 阶段 6、7 |
| 9. 可观测性与安全   | P1     | 错误监控、安全和审计基线        | 阶段 3、8 |

---

## 5. 阶段 0：建立工程基线（P0）

### 目标

在增加依赖和调整架构之前，确保任何改造都能通过统一命令验证。

### 任务

- [ ] 增加 `format:check` 命令，供 CI 使用。
- [ ] 补充 `.prettierrc`、`.prettierignore` 和 `.editorconfig`。
- [ ] 明确支持的浏览器范围并配置 Browserslist。
- [ ] 增加 `.env.example`，说明全部公开环境变量。
- [ ] 清理构建产物，确认 `dist` 不进入版本控制。
- [ ] 在 README 中记录基础验证命令和 Node/pnpm 要求。
- [ ] 建立架构决策记录目录 `docs/adr/`。

### 推荐验证命令

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

### 验收标准

- 新环境按照 README 可以一次性安装并启动。
- 所有基线命令退出码为 0。
- 未配置必要环境变量时有清晰提示，而不是运行到请求阶段才失败。

---

## 6. 阶段 1：应用骨架、Pro Components 与性能（P0）

### 目标

先解决后台整体布局、页面容器、异常兜底和当前主包过大的问题。

### 建议依赖

```bash
pnpm add @ant-design/pro-components antd-style
```

### 任务

- [ ] 使用 `ProLayout` 替换当前手写的 `BasicLayout` 主体。
- [ ] 使用 `PageContainer` 统一页面标题、面包屑和操作区域。
- [ ] 保留项目品牌、主题 Token 和退出登录等自定义能力。
- [ ] 使用 React Router lazy route 或 `React.lazy` 实现页面级懒加载。
- [ ] 增加统一路由 Loading，避免每个页面自行实现。
- [ ] 增加 React Error Boundary 和统一 403/404/500 页面。
- [ ] 处理动态 Chunk 加载失败，提供刷新入口。
- [ ] 增加构建产物分析命令和 Chunk 体积预算。

### 实施边界

- 不在本阶段重构认证和权限协议。
- 不引入 Tailwind，样式继续使用 Ant Design Token、`antd-style` 和少量全局 CSS。
- 不封装二次 `ProLayout` 配置平台，只提取稳定的项目配置。

### 验收标准

- 登录页和后台页均可正常访问。
- 刷新嵌套路由不会丢失菜单选中状态。
- 页面切换采用按路由拆包，生产构建不再只有一个大型业务 Chunk。
- 页面异常不会导致整个应用白屏。
- Dashboard、用户管理、角色管理均使用统一页面容器。

---

## 7. 阶段 2：数据请求基础设施（P0）

### 目标

建立清晰的 HTTP 边界，并由 TanStack Query 统一管理服务端状态。

### 建议依赖

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools zod
```

Devtools 只在开发环境加载。

### 任务

- [ ] 创建全局 `QueryClient` 和 `QueryClientProvider`。
- [ ] 规定 Query Key 工厂写法，避免页面内散落字符串数组。
- [ ] 定义 `ApiError`，统一网络错误、HTTP 错误和业务错误。
- [ ] 修正 Axios 响应拦截后的 TypeScript 返回类型。
- [ ] 统一超时、取消请求、请求 ID 和错误日志处理。
- [ ] 规定重试策略：查询可有限重试，写操作默认不自动重试。
- [ ] 规定缓存时间、失效刷新和窗口聚焦刷新策略。
- [ ] 添加开发环境 React Query Devtools。
- [ ] 建立查询和 Mutation 示例，优先改造用户管理页。
- [ ] 用 Zod 校验环境变量。

### 推荐职责边界

```text
Axios          传输、Header、超时、错误归一化
TanStack Query 缓存、去重、重试、刷新、Mutation 状态
页面组件       用户交互、展示状态和业务提示
Zustand        会话、主题、布局等客户端状态
```

### 验收标准

- 同一 Query Key 的并发请求会被合并或复用。
- 列表新增、编辑、删除后能够准确失效相关缓存。
- 页面不再手写重复的 `loading/error/data` 请求状态逻辑。
- 所有请求错误可以归一化为稳定的 `ApiError`。
- 生产环境不会包含 Query Devtools。

---

## 8. 阶段 3：生产级认证与权限（P0）

### 目标

将当前 Mock 登录升级为可连接真实后端的认证和授权基础设施。

### 任务：认证

- [ ] 定义登录、退出、刷新 Token、获取当前用户接口。
- [ ] 增加应用启动会话恢复状态，例如 `unknown/authenticated/anonymous`。
- [ ] 会话恢复完成前展示启动页，避免错误跳转登录页。
- [ ] 实现 Access Token 过期后的单次刷新队列。
- [ ] 多请求同时返回 401 时只发起一次刷新请求。
- [ ] 刷新失败后清理缓存、会话并跳转登录页。
- [ ] 登录后校验回跳地址，只允许应用内部路径。
- [ ] 明确 Token 存储策略，并在 ADR 中记录安全取舍。

推荐后端支持 Refresh Token 的 `HttpOnly + Secure + SameSite` Cookie。前端不应持久化 Refresh Token。

### 任务：权限

- [ ] 定义稳定的权限码类型和命名规则。
- [ ] 实现 `hasPermission` 和 `hasAnyPermission` 等纯函数。
- [ ] 实现路由权限守卫。
- [ ] 实现菜单权限过滤。
- [ ] 实现按钮级 `Access` 组件或 `useAccess` Hook。
- [ ] 补充无权限的 403 页面。
- [ ] 明确前端权限只控制 UI，服务端必须重复鉴权。

权限码示例：

```ts
type Permission =
  | "system:user:view"
  | "system:user:create"
  | "system:user:update"
  | "system:user:delete"
  | "system:role:view";
```

### 验收标准

- 未登录用户不能进入受保护页面。
- 已登录但无权限的用户看到 403，而不是 404 或空白页。
- 刷新浏览器后不会因为 Store 尚未恢复而错误跳转。
- Token 刷新并发场景有自动化测试覆盖。
- 隐藏按钮不能替代后端鉴权，相关规范写入文档。

---

## 9. 阶段 4：统一路由、菜单、面包屑与权限（P0）

### 目标

消除当前路由和菜单分别维护的问题，形成唯一配置源。

### 路由元数据建议

```ts
type AppRoute = {
  id: string;
  path: string;
  title: string;
  icon?: React.ReactNode;
  permission?: Permission;
  hideInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  children?: AppRoute[];
  lazy?: () => Promise<{ Component: React.ComponentType }>;
};
```

### 任务

- [ ] 将路由路径、标题、图标和权限合并到统一配置。
- [ ] 从配置生成 React Router 路由对象。
- [ ] 从配置生成 ProLayout 菜单数据。
- [ ] 从匹配路由生成面包屑和文档标题。
- [ ] 根据权限过滤菜单和阻止路由访问。
- [ ] 支持菜单隐藏但路由可访问的详情页。
- [ ] 为非法重复路由 ID 和路径增加开发期检查。
- [ ] 为路由转换和权限过滤编写单元测试。

### 注意事项

- 先采用前端静态路由 + 后端权限码，不急于实现后端动态路由。
- 如果未来需要动态菜单，后端应返回菜单数据或权限，不应返回可执行组件路径。
- 业务页面仍通过受控映射加载，避免服务端数据直接决定任意模块导入。

### 验收标准

- 新增页面只需要修改一处路由配置。
- 菜单、面包屑、文档标题和权限保持一致。
- 详情页可以隐藏菜单项，同时正确显示所属模块面包屑。

---

## 10. 阶段 5：标准业务页面模板（P1）

### 目标

沉淀团队真正高频的后台页面模式，提高业务交付速度。

### 第一批模板

- [ ] 查询列表：`PageContainer + ProTable`。
- [ ] 新增/编辑：`ModalForm` 或独立 `ProForm` 页面。
- [ ] 详情页：`ProDescriptions`。
- [ ] 状态展示：统一枚举、Tag 和文案映射。
- [ ] 删除操作：权限控制、二次确认和 Mutation 状态。
- [ ] 批量操作：选中状态、权限和结果反馈。

### 通用约定

- 分页、排序和筛选尽量同步到 URL。
- 表格列配置属于业务 Feature，不放入全局公共目录。
- 日期、金额和枚举使用统一格式化工具。
- Mutation 成功后精准失效 Query，不直接刷新整个页面。
- 表单 DTO 和领域模型分离，提交前完成显式转换。

### 验收标准

- 用户管理完成真实的查询、新增、编辑、删除流程。
- 角色管理复用页面模式，但没有复制请求和状态处理代码。
- 页面具备 Loading、Empty、Error、无权限和提交中状态。
- 公共封装的 API 数量和复杂度可控，不形成万能组件。

---

## 11. 阶段 6：测试与 Mock 体系（P1）

### 目标

让认证、权限、请求和核心业务流程具备可重复验证能力。

### 建议依赖

```bash
pnpm add -D vitest @vitest/coverage-v8 jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event msw playwright
```

### 测试分层

| 层级        | 工具                     | 优先覆盖                          |
| ----------- | ------------------------ | --------------------------------- |
| 单元测试    | Vitest                   | 权限、格式化、错误转换、路由转换  |
| Hooks/Store | Vitest + Testing Library | 会话恢复、Store 行为、Query Hooks |
| 组件测试    | Testing Library + MSW    | 登录、表格、表单、异常状态        |
| E2E         | Playwright               | 登录、权限、用户 CRUD、退出登录   |

### 任务

- [ ] 配置 Vitest、DOM 环境和全局测试初始化。
- [ ] 创建自定义 `render`，统一注入 Router、Query 和 Ant Design Provider。
- [ ] 使用 MSW 同时服务开发 Mock 和测试 Mock。
- [ ] 为 HTTP 错误归一化编写单元测试。
- [ ] 为权限纯函数和路由过滤编写单元测试。
- [ ] 为登录、会话恢复和 Token 刷新编写集成测试。
- [ ] 为用户 CRUD 编写组件测试。
- [ ] 使用 Playwright 覆盖核心冒烟流程。
- [ ] 建立覆盖率配置，排除生成代码和类型声明。

### 初期覆盖率建议

```text
全项目语句覆盖率：>= 70%
核心基础设施：>= 85%
生成代码：不参与统计
```

覆盖率是风险提示，不应成为编写低价值测试的目标。

### 验收标准

- 测试不依赖真实后端或公网。
- 测试之间没有共享登录状态和缓存污染。
- 核心流程在 CI 中稳定运行。
- 失败测试能清晰指出具体业务行为，而不是只比较大快照。

---

## 12. 阶段 7：OpenAPI 类型与请求生成（P1）

### 目标

以后端 OpenAPI 文档为契约，减少手写 DTO、请求函数和 Query Hook。

### 推荐选型

优先使用 Orval，原因是它可以基于 Axios 生成 TanStack Query Hooks，并支持自定义 HTTP 实例和 MSW Mock。

```bash
pnpm add -D orval
```

### 任务

- [ ] 与后端确定 OpenAPI 文档地址、版本和发布机制。
- [ ] 创建 `orval.config.ts`。
- [ ] 使用现有 Axios 实例作为生成代码的 mutator。
- [ ] 生成 DTO、请求函数、Query Hooks 和可选 MSW handlers。
- [ ] 将生成文件固定到 `src/api/generated/`。
- [ ] 增加 `api:generate` 和 `api:check` 命令。
- [ ] 在生成目录加入禁止手改说明和 ESLint 例外配置。
- [ ] 约定生成代码升级和破坏性变更处理流程。
- [ ] 根据需要增加 Adapter，避免后端 DTO 直接污染领域模型。

### 生成边界

应自动生成：

- DTO 类型
- 接口请求函数
- Query Key
- Query/Mutation Hooks
- 可选 Mock handlers

应手写维护：

- Axios 实例和认证策略
- 领域模型
- DTO 转换逻辑
- Query 组合逻辑
- 页面交互和业务规则

### 验收标准

- 修改 OpenAPI 后能够通过单一命令稳定重新生成。
- CI 能发现文档与已提交生成代码不一致。
- 页面不再手写与 OpenAPI 重复的接口类型。
- 生成代码不会绕过统一认证和错误处理。

---

## 13. 阶段 8：CI/CD 与生产交付（P1）

### 目标

建立从 Pull Request 到可部署产物的自动质量门禁。

### PR 流水线

```text
pnpm install --frozen-lockfile
  -> format:check
  -> lint
  -> typecheck
  -> test + coverage
  -> api:check
  -> build
  -> Playwright smoke
```

### 任务

- [ ] 增加 CI 工作流并缓存 pnpm store。
- [ ] 强制使用锁定的 Node 和 pnpm 版本。
- [ ] 上传单元测试覆盖率和 E2E 失败截图。
- [ ] 增加构建体积预算检查。
- [ ] 增加依赖漏洞和许可证检查。
- [ ] 配置 Renovate 或 Dependabot。
- [ ] 提供多阶段 Dockerfile。
- [ ] 提供 Nginx/Caddy SPA fallback 示例。
- [ ] 配置 HTML 短缓存和带哈希资源长期缓存。
- [ ] 增加环境配置、健康检查和回滚说明。

### 验收标准

- 不通过质量门禁的变更不能合并到主分支。
- 任意环境都由同一套可追踪流程构建。
- 刷新 `/system/users` 等前端路由不会返回服务器 404。
- 构建产物不包含测试工具、Devtools 或真实 Source Map 公网暴露。

---

## 14. 阶段 9：可观测性与安全基线（P1）

### 可观测性任务

- [ ] 接入 Sentry 或团队统一错误监控平台。
- [ ] 上报 React 渲染异常、未处理 Promise 和接口异常。
- [ ] 上报版本号、环境、用户匿名标识和请求 ID。
- [ ] 上传私有 Source Map，并从公开产物中移除。
- [ ] 建立关键性能指标和慢请求监控。
- [ ] 建立登录、权限拒绝和高风险操作审计事件。

### 安全任务

- [ ] 配置 CSP、`X-Content-Type-Options`、`Referrer-Policy` 等响应头。
- [ ] 审计 `dangerouslySetInnerHTML` 和富文本渲染入口。
- [ ] 外链统一使用安全的 `rel` 属性。
- [ ] 日志中禁止记录密码、Token 和敏感个人信息。
- [ ] Cookie 认证场景增加 CSRF 防护。
- [ ] 上传文件在前后端同时验证类型和大小。
- [ ] 高风险操作增加二次确认和服务端审计。
- [ ] 明确依赖漏洞修复时限。

### 验收标准

- 生产异常可以定位到版本、用户流程和源代码位置。
- 安全响应头通过部署环境验证。
- 敏感数据不会出现在日志、错误上报和 URL 中。

---

## 15. 暂不纳入基础模板的能力

以下能力应由业务需要驱动，不建议默认安装：

- 国际化：团队确有多语言项目时引入。
- Tailwind CSS：团队统一采用原子化 CSS 后引入。
- 微前端：存在独立团队、独立部署和运行时集成需求时引入。
- SSR/SSG：后台 SPA 通常没有必要。
- WebSocket：由实时业务场景决定。
- 图表、富文本、地图：按页面懒加载，不作为基础依赖。
- 低代码 JSON 页面生成器：维护成本高，不作为默认架构。
- 后端动态组件路由：存在安全和版本耦合风险，不推荐。
- 团队模板治理：版本发布、脚手架 CLI、生成器、共享包和升级机制暂归为 P2，待 P0/P1 稳定后再评估。

## 16. 每阶段通用完成定义

每个阶段完成时，都应满足以下条件：

- [ ] `pnpm format:check` 通过。
- [ ] `pnpm lint` 通过且无警告。
- [ ] `pnpm typecheck` 通过。
- [ ] 相关自动化测试通过。
- [ ] `pnpm build` 通过且没有新增未解释的体积警告。
- [ ] README 或对应文档已更新。
- [ ] 没有把环境密钥、真实账号或敏感数据提交到仓库。
- [ ] 重要架构取舍已记录到 ADR。

## 17. 推荐的近期执行批次

为了控制单次改动规模，建议按以下批次开始：

### 批次 A：工程基线

完成阶段 0，补齐格式化、环境示例和基线文档。

### 批次 B：后台外壳

安装 Pro Components，完成 ProLayout、PageContainer、异常页面和路由懒加载。

### 批次 C：请求层

引入 TanStack Query，重构 Axios 错误模型，并用用户列表验证 Query/Mutation 流程。

### 批次 D：认证权限

接入真实认证协议，实现会话恢复、Token 刷新和统一权限码。

### 批次 E：路由统一

将路由、菜单、面包屑、标题和权限合并为单一配置源。

完成以上五个批次后，项目已经具备承载真实业务的核心基础。随后再集中完善测试、OpenAPI、CI/CD 和可观测性。
