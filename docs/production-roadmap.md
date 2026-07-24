# 轻量 React 企业模板核心层路线图

本文档用于指导当前项目完成一套轻量、透明、可维护的 React 企业项目基础模板。

目标不是复刻 Ant Design Pro，也不是预置所有生产能力，而是先建立七项可承载真实业务的核心能力：

1. 路由与菜单
2. 布局
3. 数据流
4. 请求
5. 权限
6. 样式
7. 测试与调试

在以上核心能力之上，模板允许提供少量 `ProTable`、`ProForm` 标准业务页面，用于验证路由、权限、请求和数据流是否真正形成闭环。页面模板只沉淀高频模式，不发展为通用低代码框架。

核心层完成后暂停架构扩张，优先用真实业务验证边界。OpenAPI、完整认证协议、E2E、CI/CD、可观测性等能力按实际需求另行规划。

## 1. Ant Design Pro 参考结论

本路线图参考 Ant Design Pro `v6.0.2` 及其 2026-07-15 的 `master` 代码。

Ant Design Pro 当前由三部分组成：

- 模板代码：路由树、页面、登录、权限规则、请求错误处理和布局插槽。
- `@umijs/max`：配置式路由、初始状态、权限、请求、数据流、Mock、国际化等插件能力。
- Pro Components：`ProLayout`、`PageContainer`、`ProTable`、`ProForm` 等 UI 组件。

当前项目基于 Vite，不复制 Umi 的配置协议和插件体系，只吸收以下设计思想：

- 路由、菜单、标题、面包屑和权限使用同一份静态元数据。
- 应用外壳与业务页面分离。
- 启动会话、客户端状态、服务端状态和页面状态职责分开。
- 请求经过统一 Client 和领域 Service。
- 权限判断使用可测试的纯函数。
- 主题优先使用 Ant Design Token。
- 测试和调试能力跟随核心模块建设，而不是最后补齐。

不照搬以下能力：

- Umi Max 的 `initialState`、`model`、`access`、`request` 等隐式插件协议。
- Umi 组件路径字符串、生成目录和运行时特殊导出。
- SettingDrawer、国际化、Tailwind、图表和大量演示页面。
- Umi Mock、request-record 和 OpenAPI 插件。
- 后端动态组件路由和复杂配置平台。

Ant Design Pro 自身提供 `simple` 脚本删除大量演示页面和依赖，这也说明完整仓库更适合作为能力参考，而不是轻量模板的直接起点。

## 2. 核心技术栈

| 领域       | 选型                     | 核心职责                       |
| ---------- | ------------------------ | ------------------------------ |
| UI         | React 19 + TypeScript    | 组件、页面和类型约束           |
| 构建       | Vite                     | 开发服务器、构建和按路由拆包   |
| 路由       | React Router             | 路由匹配、嵌套、懒加载和导航   |
| 组件       | Ant Design               | 基础组件、反馈和主题 Token     |
| 布局       | Pro Components           | `ProLayout` 和 `PageContainer` |
| 客户端状态 | Zustand                  | 会话和少量跨页面 UI 状态       |
| 服务端状态 | TanStack Query           | 缓存、去重、重试和失效         |
| HTTP       | Axios                    | 传输、认证 Header 和错误归一化 |
| 接口模拟   | MSW                      | 以真实 HTTP 接口形式提供 Mock  |
| 局部样式   | antd-style               | 与主题 Token 协同的组件样式    |
| 测试       | Vitest + Testing Library | 纯函数、Hooks 和关键组件行为   |
| 工程质量   | ESLint + Prettier        | 静态检查和格式统一             |

核心层暂不增加新的状态管理库、CSS 体系或请求封装库。

## 3. 核心设计边界

### 3.1 数据与状态

```text
React 本地状态   单个组件或页面内的交互状态
URL             分页、筛选、排序和可分享的页面状态
Zustand         当前会话和少量真正跨页面的客户端状态
TanStack Query  来自服务端的数据及其请求生命周期
```

禁止把 Query 数据复制到 Zustand，也不为普通页面状态创建全局 Store。

### 3.2 请求链路

```text
Page
  -> Query Hook
    -> Domain Service
      -> API Client
        -> HTTP
          -> MSW Mock API (development/test)
          -> Real Backend (production)
```

- 页面负责交互、展示和业务提示。
- Query Hook 负责缓存键、查询、Mutation 和缓存失效。
- Service 负责领域接口，不依赖 React。
- API Client 负责 Axios 配置、响应解包和错误归一化。
- MSW 在开发和测试环境拦截真实 HTTP 请求，页面、Query Hook 和 Service 不感知数据来自 Mock 还是真实后端。

### 3.3 路由与权限

```text
Route Metadata
  -> React Router
  -> ProLayout Menu
  -> Breadcrumb and Title
  -> Route Permission
```

前端权限只控制访问入口和 UI 展示，不能替代服务端鉴权。

### 3.4 样式

样式只允许三层：

1. `ConfigProvider`：全局品牌 Token 和主题算法。
2. `antd-style`：布局和组件级样式。
3. `styles/global.css`：Reset、根节点尺寸和极少量全局规则。

业务页面优先使用 Ant Design 布局能力，避免为简单间距创建全局类名。

## 4. 目标目录

核心层只保留必要目录，不提前创建 `features`、`adapters`、`generated` 等抽象：

```text
src/
├── api/
│   └── http.ts             # 最小 Axios Client
├── app/
│   ├── providers/          # Query 等全局 Provider
│   └── query-client.ts
├── components/             # 无业务含义的公共组件（含 Access）
├── hooks/                  # 跨页面 Hook（含 useAccess）
├── layouts/                # 应用外壳
├── mocks/
│   ├── browser.ts          # 开发环境 MSW Worker
│   ├── handlers/           # 按领域组织的模拟接口
│   └── data/               # Mock 数据与内存状态
├── pages/                  # 按路由组织的页面
├── router/
│   ├── routes.tsx          # 唯一路由元数据
│   ├── access.ts           # 权限纯函数和过滤逻辑
│   ├── AccessRoute.tsx     # 页面权限守卫
│   └── index.tsx           # Router 装配
├── services/               # 按领域组织的请求函数
├── stores/                 # 客户端全局状态
├── styles/
├── test/                   # 测试初始化和渲染工具
├── types/
└── utils/
```

页面私有组件、Query Hooks、Query Keys 和类型继续就近放在对应页面目录中；只有跨多个页面稳定复用后才提升到公共目录。

## 5. 当前状态

### 已完成并保留

- [x] Node、pnpm、环境变量和基础质量命令。
- [x] `ProLayout`、`PageContainer`、路由懒加载和统一 Loading。
- [x] 403、404、500 页面和 React Error Boundary。
- [x] 按路由拆包、单包构建和体积分析命令。
- [x] Axios Client 的 Token 注入和 401 处理。
- [x] TanStack Query Provider、默认策略和开发环境 Devtools。
- [x] Service 与页面 Query Hook 的基础分层示例。
- [x] Zustand 登录状态和受保护路由。
- [x] Ant Design Token、`antd-style` 和全局 CSS 基线。

### 当前缺口

- 存在未使用或超前设计的代码，需要在对应批次顺手收敛。

## 6. 实施路径

实施顺序按依赖关系组织。每个批次都必须独立可运行，并在完成后执行质量检查。

### 批次 A：统一路由、菜单与布局

#### 目标

先消除当前最明显的重复配置，让后续权限建立在稳定的路由模型上。

#### 任务

- [x] 新建 `src/router/routes.tsx`，集中维护路径、标题、图标、页面组件和菜单属性。
- [x] 从同一份元数据生成 React Router 路由和 ProLayout 菜单。
- [x] 支持嵌套路由、默认跳转、懒加载、菜单隐藏和独立布局页面。
- [x] 由匹配路由更新文档标题和面包屑，移除页面内重复标题逻辑。
- [x] 将登录、403、404、500 等特殊路由明确标记为不显示在菜单中。
- [x] 删除原有独立菜单配置，确保新增页面只修改一处。
- [x] 保持 `BasicLayout` 只负责 ProLayout 插槽和布局状态，不承担权限计算。
- [x] 清理未使用的路由、布局辅助代码。

#### 不做

- 后端动态路由。
- 可视化菜单配置平台。
- 运行时远程加载页面组件。
- SettingDrawer 和多套布局切换。

#### 验收

- 新增一个页面只需修改一份路由元数据。
- 刷新嵌套路由后菜单选中状态正确。
- 隐藏菜单的路由仍可直接访问。
- 登录页不渲染后台布局。

### 批次 B：收敛数据流与请求边界

#### 目标

让现有 TanStack Query、Service 和 Axios Client 形成清晰、可替换的最小闭环。

#### 建议依赖

```bash
pnpm add -D msw
pnpm exec msw init public --save
```

#### 任务

- [x] 保留统一 `QueryClient`，只配置查询重试、缓存时间和窗口刷新等必要默认值。
- [x] Query Key 就近定义，删除尚无真实查询使用的 Detail Key 等超前设计。
- [x] 后端接口接入后，按实际响应结构读取错误码和错误信息，不在前端预定义错误分类。
- [x] 保持 Axios Client 只处理 Token 和 401 等通用行为，响应解包放在实际 Service 中。
- [x] 保持 Service 与 React、Zustand、TanStack Query 解耦。
- [x] 引入 MSW，把现有登录和用户内存 Mock 改造成 `/auth/login`、`/users` 等模拟后端接口。
- [x] 将 `auth`、`user` 等全部领域 Service 改为调用统一 `http` 实例，禁止直接导入 Mock 函数或数据。
- [x] 为每个 Service 显式声明请求参数和返回类型，并按接口契约完成必要的响应转换。
- [x] 在应用渲染前启动开发环境 MSW Worker，避免首批请求早于 Worker 初始化。
- [x] 使用独立环境开关控制 Mock；开发和测试环境可启用，生产环境默认关闭且不注册 Worker。
- [x] 页面、Query Hook 和 Service 不判断 Mock/真实环境，切换真实后端时只调整环境配置。
- [x] Mock handlers 按领域组织并保持与真实接口相同的 URL、HTTP Method、状态码和响应结构。
- [x] 页面只保留一套服务端请求生命周期，不混用组件内部请求机制与 TanStack Query。
- [x] 删除未使用的 `storage` 工具和重复类型。

#### 不做

- Orval 或其他 OpenAPI 生成。
- DTO Adapter 体系。
- 离线缓存、持久化 Query 和复杂乐观更新。

#### 验收

- 页面不直接调用 Axios 或 Mock。
- Service 不依赖 React。
- 所有领域 Service 均通过统一 `http` 实例发出请求，不再导入 `src/mocks/`。
- 开启 MSW 时，请求经过完整 HTTP 链路并返回 Mock 数据；关闭后可直接请求真实后端。
- 生产环境不注册 MSW Worker，也不启用 Mock handlers。
- Query 数据不进入 Zustand。
- Mutation 成功后只失效相关 Query。
- 取消请求不会显示为普通错误。

### 批次 C：最小认证与权限闭环

#### 目标

实现可连接真实后端的最小前端权限模型，不提前设计完整认证平台。

#### 任务

- [x] 为当前用户增加权限码列表，定义稳定的 `Permission` 联合类型。
- [x] 实现 `hasPermission`、`hasAnyPermission` 等无副作用纯函数。
- [x] 在路由元数据中声明页面权限。
- [x] 未登录访问受保护路由时跳转登录，并保留安全的站内回跳地址。
- [x] 已登录但无页面权限时进入 403。
- [x] 使用同一权限函数过滤菜单，避免显示不可访问入口。
- [x] 提供轻量 `Access` 组件或 `useAccess` Hook 处理按钮级权限。
- [x] 退出登录时清理会话和 Query 缓存。
- [x] 在文档中明确本地 Token 只用于模板演示，真实项目应按后端协议决定存储方式。

#### 不做

- RBAC 管理后台。
- Refresh Token 并发刷新队列。
- 多标签页会话同步。
- OAuth、SSO、MFA。
- 后端下发可执行路由。

上述能力必须在真实后端认证协议明确后再实现，模板不预设错误的安全方案。

#### Token 存储说明

模板将登录 Token 与用户信息持久化到 `localStorage`（Zustand `persist`），**仅用于本地演示与联调**。真实项目应按后端认证协议决定：

- 是否使用 HttpOnly Cookie、内存会话或短期 Token。
- 是否需要 Refresh Token、滑动过期或多标签页同步。
- 退出与 401 时如何清理本地状态。

前端隐藏菜单或按钮不能替代服务端鉴权；所有写操作与敏感读操作必须以服务端权限校验为准。

#### 权限控制示例

路由、菜单和按钮共用 `src/router/access.ts` 中的纯函数；权限码定义在 `src/types/auth.ts`。

**1. 页面权限（路由元数据）**

在 `src/router/routes.tsx` 为页面声明 `access`，由 `AccessRoute` 拦截：

```tsx
{
  access: "system:user:view",
  component: routeComponents.users,
  name: "用户管理",
  path: "users",
}
```

- 未登录访问受保护布局 → 跳转 `/login`，并保留安全的站内回跳地址。
- 已登录但缺少 `access` → 跳转 `/403`。
- 手工输入无权限 URL（如 `viewer` 访问 `/system/roles`）会进入 403。

**2. 菜单权限（同一规则过滤）**

`BasicLayout` 通过 `createAuthorizedLayoutRoute(user.permissions)` 过滤侧栏。父菜单在子项全部不可见时自动隐藏。无需在布局里手写权限分支。

**3. 功能按钮权限（`Access` / `useAccess`）**

用户管理页已接入示例：

```tsx
import { Access } from "@/components/Access";
import { useAccess } from "@/hooks/useAccess";

// 组件式：无权限时不渲染（或渲染 fallback）
<Access permission="system:user:create">
  <Button type="primary">新建用户</Button>
</Access>

<Access permission="system:user:delete">
  <Button danger>删除</Button>
</Access>

// Hook 式：用于列显隐等逻辑判断
const access = useAccess();
const canManageUser = access.canAny(["system:user:update", "system:user:delete"]);
```

**演示账号（MSW）**

| 账号     | 密码 | 权限效果                                                                              |
| -------- | ---- | ------------------------------------------------------------------------------------- |
| `admin`  | 任意 | 全部页面与按钮                                                                        |
| `viewer` | 任意 | 可见工作台、用户管理；无新建/编辑/删除；角色管理菜单隐藏，直访 `/system/roles` 为 403 |

#### 验收

- 匿名用户、已登录无权限用户和有权限用户得到不同且正确的结果。
- 菜单、路由和按钮使用同一权限规则。
- 手工输入无权限 URL 会进入 403。
- 隐藏按钮不能替代服务端鉴权，相关说明保留在文档中。

### 批次 D：标准业务页面模板

#### 目标

使用少量真实页面模式验证核心层，并为常见后台需求提供可复制的起点。

#### 第一批模板

- 查询列表：`PageContainer + ProTable`，包含搜索、分页、刷新和状态展示。
- 新增/编辑：`ModalForm` 或独立 `ProForm` 页面，包含校验、提交状态和错误反馈。
- 详情展示：按实际需要使用 `ProDescriptions`，不强制所有实体提供详情页。

#### 任务

- [x] 将用户管理页改造为首个完整示例，复用现有 Query Hooks 和 Service。
- [x] ProTable 使用受控数据模式，由 TanStack Query 管理请求生命周期，不同时使用 `ProTable.request` 发起同一请求。
- [x] 搜索、分页和排序参数统一进入 Query Key；适合分享的参数同步到 URL。
- [x] 使用 `ModalForm` 或 `ProForm` 完成新增、编辑，并由 Mutation 处理提交状态。
- [x] Mutation 成功后精确更新或失效相关 Query，不通过刷新整个页面同步数据。
- [x] 列表操作、表单入口和详情操作接入统一权限判断。
- [x] Loading、Empty、Error、无权限和提交中状态均有明确反馈。
- [x] 表格列、表单字段、Query Hooks 和页面类型保留在业务页面目录内。
- [x] 提供一个精简的标准表单示例，验证独立页面提交和离开提示等常见流程。

#### 不做

- 通用 CRUD 页面生成器。
- JSON Schema 驱动的表格或表单。
- 全局列配置、万能字段协议和低代码设计器。
- 为展示组件重复封装 ProTable、ProForm 的完整 API。

#### 验收

- 用户管理完整覆盖查询、新增、编辑和删除流程。
- ProTable 与 TanStack Query 只有一个请求状态来源。
- 页面可以作为复制起点，但删除示例页不会影响核心基础设施。
- 新增第二个业务页面时能复用约定，无需复制请求和权限基础代码。

### 批次 E：样式规范收口

#### 目标

形成足够支撑后台项目、但不会出现多套样式体系竞争的样式基线。

#### 任务

- [x] 将品牌色、圆角、字体等全局值集中到 `ConfigProvider`。
- [x] ProLayout 外观配置保持为少量常量，不建立运行时设置中心。
- [x] 组件样式统一使用 `antd-style`，并优先读取主题 Token。
- [x] 收敛 `global.css`，只保留 Reset、根节点、通用 Loading 和登录页基础样式。
- [x] 清理可由 Ant Design 组件属性或 Token 替代的硬编码颜色和间距。
- [x] 检查桌面端和窄屏下的布局、表格滚动和登录页表现。

#### 不做

- Tailwind、Less、Sass。
- 多品牌主题和在线主题编辑器。
- 默认暗色模式和复杂主题持久化。

#### 验收

- 全局品牌调整只需修改主题配置。
- 页面不依赖大量全局类名。
- 不存在三套以上并行的样式方案。
- 布局在常见桌面和移动宽度下可用。

### 批次 F：测试与调试闭环

#### 目标

为核心边界提供低成本回归能力，不追求测试数量和覆盖率数字。

#### 建议依赖

```bash
pnpm add -D vitest @vitest/coverage-v8 happy-dom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event
```

#### 任务

- [x] 配置 Vitest、DOM 环境和测试初始化。
- [x] 在测试环境补齐 `matchMedia`、`ResizeObserver` 等 Ant Design 必要 API。
- [x] 创建最小自定义 `render`，按需注入 Router、Query 和 Ant Design Provider。
- [x] 为路由转菜单、菜单隐藏和嵌套路由转换编写单元测试。
- [x] 为权限纯函数、菜单过滤和路由拒绝编写测试。
- [x] 为 Axios Token、401 处理和 Query 重试判断编写测试。
- [x] 为登录跳转、403 和退出清理编写关键组件测试。
- [x] 复用 MSW handlers 测试成功、业务失败、401 和网络异常等请求场景。
- [x] 为 ProTable 查询参数、ProForm 提交和 Mutation 后缓存失效编写关键行为测试。
- [x] 保留 React Query Devtools 仅在开发环境懒加载。
- [x] 保留 Error Boundary、Chunk 加载失败恢复和构建体积分析。
- [x] 增加 `test` 和 `test:watch` 命令，并纳入核心完成检查。

测试应随批次 A 至 E 同步添加；批次 F 负责统一测试工具和补齐缺口，而不是最后重新测试整个项目。

#### 不做

- Playwright E2E。
- 强制全项目覆盖率阈值。
- 大量快照测试和跨浏览器矩阵。

#### 验收

- 测试不依赖真实后端和公网。
- 测试之间没有共享会话和 Query 缓存。
- 失败信息描述具体行为。
- 生产构建不包含 Devtools 和测试代码。

## 7. 每个批次的完成定义

每完成一个批次，必须满足：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

在测试基线尚未建立前，批次 A 至 E 中的 `pnpm test` 可暂时跳过，但对应核心逻辑必须在批次 F 补齐测试。

同时确认：

- 没有新增未使用的依赖和抽象。
- 没有把服务端数据复制到客户端 Store。
- 没有把环境密钥、真实账号或 Token 提交到仓库。
- 文档与实际代码状态一致。
- 新增能力有明确业务消费者，不为假设场景提前设计。

## 8. 核心层完成标准

满足以下条件后，核心层视为完成：

- 路由、菜单、标题、面包屑和权限来自同一份元数据。
- ProLayout 能稳定承载登录页以外的后台页面。
- 本地状态、URL、Zustand 和 TanStack Query 边界清晰。
- 页面请求统一经过 Query Hook、Service 和 API Client。
- 所有 Mock 数据均通过 MSW 模拟接口返回，Service 只调用统一 `http` 实例。
- 开发 Mock 与真实后端使用同一接口契约，切换数据源不需要修改页面、Query Hook 或 Service。
- 匿名、无权限和有权限三种访问状态形成闭环。
- 至少包含一个 ProTable CRUD 页面和一个 ProForm 标准表单示例。
- 标准页面模板复用核心层能力，但不依赖通用页面生成器。
- 样式统一使用 Ant Design Token、`antd-style` 和少量全局 CSS。
- 路由、权限和请求核心逻辑具备自动化测试。
- 开发环境具备 Query Devtools、错误边界和构建分析能力。
- 所有质量命令通过。

达到该标准后，不立即继续增加基础设施。应先在至少一个真实项目或两个真实业务模块中验证，再决定后续投入。

## 9. 核心层之后按需评估

以下能力不属于当前路线图：

- 完整登录会话恢复、Refresh Token 队列和 SSO。
- Playwright 端到端测试。
- OpenAPI 类型与请求生成。
- 国际化、暗色主题、多品牌和微前端。
- CI/CD、容器部署和依赖更新机器人。
- Sentry、性能监控、审计和安全响应头。
- 模板 CLI、代码生成器、共享包和版本升级治理。

只有在核心层稳定且真实项目出现明确需求后，才为其中某项创建独立方案，避免再次把基础模板演进为重量级平台。
