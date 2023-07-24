import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      className="w-full h-full"
      extra={
        <Button onClick={() => navigate("/projects")} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
