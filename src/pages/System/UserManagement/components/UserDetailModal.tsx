import { ProDescriptions } from "@ant-design/pro-components";
import { Modal, Tag } from "antd";

import type { User } from "@/types/user";

type UserDetailModalProps = {
  user: User | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  return (
    <Modal footer={null} open={Boolean(user)} title="用户详情" onCancel={onClose}>
      <ProDescriptions<User>
        column={1}
        bordered
        dataSource={user ?? undefined}
        columns={[
          { dataIndex: "name", title: "姓名" },
          { dataIndex: "username", title: "用户名" },
          { dataIndex: "email", title: "邮箱" },
          { dataIndex: "role", title: "角色" },
          {
            dataIndex: "status",
            title: "状态",
            render: (_, current) =>
              current?.status === "enabled" ? <Tag color="success">启用</Tag> : <Tag>停用</Tag>,
          },
          {
            dataIndex: "createdAt",
            title: "创建时间",
            render: (_, current) =>
              current ? dateFormatter.format(new Date(current.createdAt)) : "-",
          },
        ]}
      />
    </Modal>
  );
}
