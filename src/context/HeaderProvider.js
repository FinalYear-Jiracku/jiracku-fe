import { createContext, useState } from "react";

const HeaderContext = createContext({});

export const HeaderProvider = ({ children }) => {
  const [header, setheader] = useState({
    title: "",
    breadCrumb: [],
  });
  return (
    <HeaderContext.Provider value={{ header, setheader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderContext;
