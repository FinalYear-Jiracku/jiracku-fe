import { useState, useEffect } from "react";
import { Input, Space } from "antd";
import useDebounce from "../../../hooks/UseDebounce";

const SeachBar = ({ onChangeEvent, placeholder, borderColor}) => {
  const [keySearch, setKeySearch] = useState({});
  const debouncedValue = useDebounce(keySearch?.target?.value.trim(), 500);
  const backgroundColorStyle = {
    borderColor: borderColor,
  };
  useEffect(() => {
    if (keySearch?.target?.value || keySearch?.target?.value === "") {
      onChangeEvent(keySearch?.target?.value.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  return (
    <div>
      <Space>
        <Input
          placeholder={placeholder}
          allowClear
          onChange={(value) => setKeySearch(value)}
          style={backgroundColorStyle}
        />
      </Space>
    </div>
  );
};

export default SeachBar;
