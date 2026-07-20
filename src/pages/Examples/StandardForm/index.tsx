import {
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useMutation } from "@tanstack/react-query";
import { App as AntdApp, Card, Modal } from "antd";
import { useState } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";

type StandardFormValues = {
  description?: string;
  name: string;
  owner: string;
  priority: "high" | "normal" | "low";
};

async function submitForm(values: StandardFormValues) {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  return values;
}

export function StandardFormPage() {
  const { message } = AntdApp.useApp();
  const [dirty, setDirty] = useState(false);
  const mutation = useMutation({ mutationFn: submitForm });
  const blocker = useBlocker(dirty);

  useBeforeUnload((event) => {
    if (dirty) event.preventDefault();
  });

  return (
    <PageContainer content="独立页面表单包含校验、提交状态、错误反馈与未保存离开确认。">
      <Card>
        <ProForm<StandardFormValues>
          layout="vertical"
          initialValues={{ priority: "normal" }}
          submitter={{ submitButtonProps: { loading: mutation.isPending } }}
          onValuesChange={() => setDirty(true)}
          onFinish={async (values) => {
            try {
              await mutation.mutateAsync(values);
              setDirty(false);
              message.success("表单提交成功");
              return true;
            } catch (error) {
              message.error(error instanceof Error ? error.message : "表单提交失败");
              return false;
            }
          }}
        >
          <ProFormText
            name="name"
            label="项目名称"
            width="lg"
            rules={[{ required: true, message: "请输入项目名称" }]}
          />
          <ProFormText
            name="owner"
            label="负责人"
            width="md"
            rules={[{ required: true, message: "请输入负责人" }]}
          />
          <ProFormSelect
            name="priority"
            label="优先级"
            width="sm"
            options={[
              { label: "高", value: "high" },
              { label: "普通", value: "normal" },
              { label: "低", value: "low" },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="description"
            label="说明"
            width="lg"
            fieldProps={{ maxLength: 200, showCount: true }}
          />
        </ProForm>
      </Card>
      <Modal
        open={blocker.state === "blocked"}
        title="离开当前页面？"
        okText="离开"
        cancelText="继续编辑"
        onOk={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      >
        当前表单有未保存的修改，离开后修改将丢失。
      </Modal>
    </PageContainer>
  );
}
