
import { useContext, useEffect } from "react";
import HeaderContext from "../../../context/HeaderProvider";
import LoginPage from "../LoginPage/LoginPage";

const HomePage = () => {
  const header = useContext(HeaderContext);
  
  useEffect(() => {
    header.setHeader({
      title: "HOME PAGE",
      breadCrumb: [{ name: "Home", url: "/home" }],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <LoginPage/>
    </div>
  );
};

export default HomePage;
