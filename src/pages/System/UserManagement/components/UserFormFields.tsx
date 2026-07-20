import { ProFormSelect, ProFormText } from "@ant-design/pro-components";

export function UserFormFields() {
  return (
    <>
      <ProFormText name="name" label="姓名" rules={[{ required: true, message: "请输入姓名" }]} />
      <ProFormText
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        rules={[{ required: true, type: "email", message: "请输入有效邮箱" }]}
      />
      <ProFormText name="role" label="角色" rules={[{ required: true, message: "请输入角色" }]} />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: "启用", value: "enabled" },
          { label: "停用", value: "disabled" },
        ]}
        rules={[{ required: true, message: "请选择状态" }]}
      />
    </>
  );
}
