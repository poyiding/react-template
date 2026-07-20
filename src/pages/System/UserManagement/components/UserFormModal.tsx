import { PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { App as AntdApp, Button } from "antd";

import { Access } from "@/components/Access";
import type { CreateUserInput, User } from "@/types/user";

import { useCreateUserMutation, useUpdateUserMutation } from "../useUserQueries";
import { UserFormFields } from "./UserFormFields";

type UserFormModalProps = {
  user?: User | null;
  onClose?: () => void;
};

export function UserFormModal({ user, onClose }: UserFormModalProps) {
  const { message } = AntdApp.useApp();
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const isCreate = user === undefined;

  const modal = (
    <ModalForm<CreateUserInput>
      key={user?.id ?? "create"}
      title={isCreate ? "新建用户" : "编辑用户"}
      open={isCreate ? undefined : Boolean(user)}
      trigger={
        isCreate ? (
          <Button icon={<PlusOutlined />} type="primary">
            新建用户
          </Button>
        ) : undefined
      }
      initialValues={user ?? { role: "普通用户", status: "enabled" }}
      modalProps={{ destroyOnHidden: true }}
      onOpenChange={(open) => {
        if (!open && !isCreate) onClose?.();
      }}
      onFinish={async (values) => {
        try {
          if (user) {
            await updateMutation.mutateAsync({ ...values, id: user.id });
          } else {
            await createMutation.mutateAsync(values);
          }

          message.success(isCreate ? "用户创建成功" : "用户更新成功");
          if (!isCreate) onClose?.();
          return true;
        } catch {
          return false;
        }
      }}
    >
      <UserFormFields />
    </ModalForm>
  );

  return isCreate ? <Access permission="system:user:create">{modal}</Access> : modal;
}
