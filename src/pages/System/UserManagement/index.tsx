import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { PageContainer, ProTable, type ProColumns } from "@ant-design/pro-components";
import { App as AntdApp, Button, Popconfirm, Space } from "antd";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Access } from "@/components/Access";
import type { User, UserListParams, UserStatus } from "@/types/user";

import { UserDetailModal } from "./components/UserDetailModal";
import { UserFormModal } from "./components/UserFormModal";
import { useDeleteUserMutation, useUsersQuery } from "./useUserQueries";

const defaultParams: UserListParams = { page: 1, pageSize: 10 };
const dateFormatter = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" });

function readParams(searchParams: URLSearchParams): UserListParams {
  const page = Number(searchParams.get("page")) || defaultParams.page;
  const pageSize = Number(searchParams.get("pageSize")) || defaultParams.pageSize;
  const name = searchParams.get("name") || undefined;
  const username = searchParams.get("username") || undefined;
  const status = searchParams.get("status") as UserStatus | null;
  const sortField = searchParams.get("sortField") as UserListParams["sortField"];
  const sortOrder = searchParams.get("sortOrder") as UserListParams["sortOrder"];
  return {
    page,
    pageSize,
    name,
    sortField: sortField || undefined,
    sortOrder: sortOrder || undefined,
    status: status || undefined,
    username,
  };
}

export function UserManagementPage() {
  const { message } = AntdApp.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const params = useMemo(() => readParams(searchParams), [searchParams]);
  const usersQuery = useUsersQuery(params);
  const deleteMutation = useDeleteUserMutation();

  const updateParams = (next: Partial<UserListParams>) => {
    const merged = { ...params, ...next };
    const values = Object.entries(merged).filter(
      ([, value]) => value !== undefined && value !== "",
    );
    setSearchParams(new URLSearchParams(values.map(([key, value]) => [key, String(value)])));
  };

  const columns: ProColumns<User>[] = [
    {
      dataIndex: "name",
      title: "姓名",
      fieldProps: { placeholder: "请输入姓名" },
      sorter: true,
      sortOrder: params.sortField === "name" ? params.sortOrder : null,
    },
    {
      dataIndex: "username",
      title: "用户名",
      fieldProps: { placeholder: "请输入用户名" },
    },
    {
      dataIndex: "status",
      title: "状态",
      valueType: "select",
      valueEnum: {
        enabled: { text: "启用", status: "Success" },
        disabled: { text: "停用", status: "Default" },
      },
    },
    { dataIndex: "email", title: "邮箱", search: false },
    { dataIndex: "role", title: "角色", search: false },
    {
      dataIndex: "createdAt",
      title: "创建时间",
      search: false,
      sorter: true,
      sortOrder: params.sortField === "createdAt" ? params.sortOrder : null,
      render: (_, user) => dateFormatter.format(new Date(user.createdAt)),
    },
    {
      title: "操作",
      search: false,
      valueType: "option",
      width: 220,
      render: (_, user) => (
        <Space>
          <Access permission="system:user:view">
            <Button icon={<EyeOutlined />} type="link" onClick={() => setDetailUser(user)}>
              详情
            </Button>
          </Access>
          <Access permission="system:user:update">
            <Button icon={<EditOutlined />} type="link" onClick={() => setEditingUser(user)}>
              编辑
            </Button>
          </Access>
          <Access permission="system:user:delete">
            <Popconfirm
              title="确定删除该用户吗？"
              description="删除后无法恢复。"
              okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
              onConfirm={() =>
                deleteMutation.mutate(user.id, {
                  onSuccess: () => message.success("用户删除成功"),
                })
              }
            >
              <Button danger icon={<DeleteOutlined />} type="link">
                删除
              </Button>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer content="用户查询、编辑和删除均由 Query 与 Mutation 管理请求生命周期。">
      <ProTable<User>
        rowKey="id"
        columns={columns}
        dataSource={usersQuery.data?.list ?? []}
        loading={usersQuery.isPending || usersQuery.isFetching}
        search={{ labelWidth: "auto" }}
        form={{
          initialValues: { name: params.name, status: params.status, username: params.username },
        }}
        options={{ reload: () => usersQuery.refetch(), density: false, setting: false }}
        toolBarRender={() => [<UserFormModal key="create" />]}
        onSubmit={(values) =>
          updateParams({
            name: String(values.name || "").trim() || undefined,
            page: 1,
            status: (values.status as UserStatus) || undefined,
            username: String(values.username || "").trim() || undefined,
          })
        }
        onReset={() =>
          updateParams({ name: undefined, page: 1, status: undefined, username: undefined })
        }
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: usersQuery.data?.total ?? 0,
          showSizeChanger: true,
        }}
        onChange={(pagination, _, sorter) => {
          const current = Array.isArray(sorter) ? sorter[0] : sorter;
          updateParams({
            page: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            sortField: current?.field as UserListParams["sortField"],
            sortOrder: current?.order || undefined,
          });
        }}
        locale={{ emptyText: "暂无用户" }}
      />
      <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} />
      <UserDetailModal user={detailUser} onClose={() => setDetailUser(null)} />
    </PageContainer>
  );
}
