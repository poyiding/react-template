import { Spin } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  loading: css`
    display: grid;
    min-height: 240px;
    place-items: center;
  `,
}));

export function RouteLoading() {
  const { styles } = useStyles();

  return (
    <div aria-label="页面加载中" className={styles.loading} role="status">
      <Spin size="large" />
    </div>
  );
}
