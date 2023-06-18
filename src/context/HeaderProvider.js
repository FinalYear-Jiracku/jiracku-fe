import { createContext, useState } from "react";
const HeaderContext = createContext({});

export const HeaderProvider = ({ children }) => {
  const [header, setHeader] = useState({ title: "", breadCrumb: [] });
  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderContext;
