import { useState, useContext, useEffect } from "react";
import { Breadcrumb, Layout, Image } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import icon from "../../assets/anh.jpg";
import HeaderContext from "../../context/HeaderProvider";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const { header } = useContext(HeaderContext);
  const [breadCrumb, setBreadCrumb] = useState({ title: "", data: [] });

  useEffect(() => {
    setBreadCrumb({
      title: header.title.toUpperCase(),
      data: header.breadCrumb,
    });
  }, [header]);
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>{breadCrumb.title}</Header>
      <div className={styles.breadcrumb}>
        <Breadcrumb className={styles["breadcrumb-item"]}>
          {breadCrumb.data.map((item, index) => (
            index === breadCrumb.data.length - 1 ? (
              <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
            ) :
            <Breadcrumb.Item key={index}>
              <Link to={item.url}>{item.name}</Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
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
