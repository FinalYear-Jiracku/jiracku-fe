import Layout from "antd/es/layout/layout";
import React from "react";
import styles from "./styles.module.scss"
const { Footer } = Layout;

const Footers = () => {
  return (
    <Layout>
      <Footer
        className={styles.footer}
      >
        Jiracku ©2023 Created by Dinh Gia Bao
      </Footer>
    </Layout>
  );
};

export default Footers;
