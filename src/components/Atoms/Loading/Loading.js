import React from "react";
import { Space, Spin } from "antd";
const Loading = () => {
  return (
    <Space size="middle">
      <Spin size="large" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}/>
    </Space>
  );
};

export default Loading;
