import { ExceptionPage } from "@/pages/Exception";

export function NotFoundPage() {
  return <ExceptionPage status="404" subTitle="你访问的页面不存在" />;
}
