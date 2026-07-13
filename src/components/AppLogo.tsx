import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    color: ${token.colorWhite};
    font-weight: ${token.fontWeightStrong};
    line-height: 1;
    text-align: center;
    background: ${token.colorPrimary};
    border-radius: ${token.borderRadius}px;
  `,
}));

export function AppLogo() {
  const { styles } = useStyles();

  return <div className={styles.logo}>R</div>;
}
