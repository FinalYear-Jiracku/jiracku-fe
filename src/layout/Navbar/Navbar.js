import { Breadcrumb, Layout, Image } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import icon from "../../assets/anh.jpg";
import styles from "./styles.module.scss";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Layout
      className={styles.layout}
    >
      <Header className={styles.header}>PROJECT MANAGEMENT</Header>
      <div className={styles.breadcrumb}>
        <Breadcrumb
          className={styles['breadcrumb-item']}
          items={[
            {
              title: "Home",
            },
            {
              title: <a href="abc">Application Center</a>,
            },
            {
              title: <a href="abc">Application List</a>,
            },
            {
              title: "An Application",
            },
          ]}
        />
        <div className={styles["image-logout"]}>
          <Image src={icon} alt="icon" className={styles.icon} />
          <div>Gia Bao</div>
          <button className={styles["button-logout"]}>
            <LogoutOutlined className={styles.logout} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Navbar;
