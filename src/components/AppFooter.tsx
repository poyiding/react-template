import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, token }) => ({
  footer: css`
    padding: 16px 24px;
    color: ${token.colorTextDescription};
    font-size: ${token.fontSizeSM}px;
    text-align: center;
  `,
  link: css`
    color: inherit;

    &:hover {
      color: ${token.colorText};
    }
  `,
}));

export function AppFooter() {
  const { styles } = useStyles();

  return (
    <footer className={styles.footer}>
      React Template © {new Date().getFullYear()} ·{" "}
      <a className={styles.link} href="https://pro.ant.design" rel="noreferrer" target="_blank">
        Ant Design Pro
      </a>
    </footer>
  );
}
