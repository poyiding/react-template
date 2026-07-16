import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Alert,
  App as AntdApp,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
} from "antd";
import { useState } from "react";

import type { CreateUserInput, User, UserListParams } from "@/types/user";

import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from "./useUserQueries";

const initialParams: UserListParams = {
  page: 1,
  pageSize: 10,
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "操作失败";
}

export function UserManagementPage() {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<CreateUserInput>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [params, setParams] = useState<UserListParams>(initialParams);
  const usersQuery = useUsersQuery(params);
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const openCreateModal = () => {
    setEditingUser(null);
    form.setFieldsValue({
      role: "普通用户",
      status: "enabled",
    });
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      username: user.username,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleMutationError = (error: unknown) => {
    message.error(getErrorMessage(error));
  };

  const handleSubmit = (values: CreateUserInput) => {
    const callbacks = {
      onError: handleMutationError,
      onSuccess: () => {
        message.success(editingUser ? "用户更新成功" : "用户创建成功");
        closeModal();
      },
    };

    if (editingUser) {
      updateMutation.mutate({ ...values, id: editingUser.id }, callbacks);
      return;
    }

    createMutation.mutate(values, callbacks);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onError: handleMutationError,
      onSuccess: () => message.success("用户删除成功"),
    });
  };

  const handleSearch = () => {
    setParams((current) => ({
      ...current,
      keyword: keyword.trim() || undefined,
      page: 1,
    }));
  };

  const columns: TableProps<User>["columns"] = [
    {
      dataIndex: "name",
      key: "name",
      title: "姓名",
    },
    {
      dataIndex: "username",
      key: "username",
      title: "用户名",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "邮箱",
    },
    {
      dataIndex: "role",
      key: "role",
      title: "角色",
    },
    {
      dataIndex: "status",
      key: "status",
      render: (status: User["status"]) =>
        status === "enabled" ? <Tag color="success">启用</Tag> : <Tag>停用</Tag>,
      title: "状态",
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => dateFormatter.format(new Date(createdAt)),
      title: "创建时间",
    },
    {
      key: "actions",
      render: (_, user) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openEditModal(user)}>
            编辑
          </Button>
          <Popconfirm
            description="删除后无法恢复。"
            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(user.id)}
          >
            <Button danger icon={<DeleteOutlined />} type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: "操作",
      width: 180,
    },
  ];

  return (
    <PageContainer
      content="该页面演示 Query 缓存、请求取消以及 Mutation 后的精确缓存失效。"
      extra={
        <Button icon={<PlusOutlined />} type="primary" onClick={openCreateModal}>
          新建用户
        </Button>
      }
    >
      <Card>
        <Space.Compact style={{ marginBottom: 16 }}>
          <Input
            allowClear
            placeholder="搜索姓名、用户名或邮箱"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => usersQuery.refetch()}>
            刷新
          </Button>
        </Space.Compact>

        {usersQuery.isError ? (
          <Alert
            showIcon
            action={
              <Button size="small" onClick={() => usersQuery.refetch()}>
                重试
              </Button>
            }
            description={getErrorMessage(usersQuery.error)}
            message="用户列表加载失败"
            style={{ marginBottom: 16 }}
            type="error"
          />
        ) : null}

        <Table<User>
          columns={columns}
          dataSource={usersQuery.data?.list ?? []}
          loading={usersQuery.isPending || usersQuery.isFetching}
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            showSizeChanger: true,
            total: usersQuery.data?.total ?? 0,
            onChange: (page, pageSize) => setParams((current) => ({ ...current, page, pageSize })),
          }}
          rowKey="id"
        />
      </Card>

      <Modal
        destroyOnHidden
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        open={modalOpen}
        title={editingUser ? "编辑用户" : "新建用户"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form<CreateUserInput>
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={handleSubmit}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效邮箱" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true, message: "请输入角色" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "启用", value: "enabled" },
                { label: "停用", value: "disabled" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
