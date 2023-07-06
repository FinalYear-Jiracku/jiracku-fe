import { useState, useContext, useEffect } from "react";
import { Breadcrumb, Layout, Image } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import icon from "../../assets/anh.jpg";
import HeaderContext from "../../context/HeaderProvider";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import GoogleAuthContext from "../../context/AuthProvider";
const { Header } = Layout;

const Navbar = () => {
  const { auth } = useContext(GoogleAuthContext);
  const { header } = useContext(HeaderContext);
  const [breadCrumb, setBreadCrumb] = useState({ title: "", data: [] });
  
  useEffect(() => {
    setBreadCrumb({
      title: header.title.toUpperCase(),
      data: header.breadCrumb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header]);
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>{breadCrumb.title}</Header>
      <div className={styles.breadcrumb}>
        <Breadcrumb
          className={styles["breadcrumb-item"]}
          items={breadCrumb.data.map((item, index) => ({
            title:
              index === breadCrumb.data.length - 1 ? (
                item.name
              ) : (
                <Link to={item.url}>{item.name}</Link>
              ),
            key: index,
          }))}
        />
        <div className={styles["image-logout"]}>
          {Object.keys(auth).length === 0 ? (
            <div></div>
          ) : (
            <>
              <Image src={icon} alt="icon" className={styles.icon} />
              <div>Gia Bao</div>
              <button className={styles["button-logout"]}>
                <LogoutOutlined className={styles.logout} />
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Navbar;
