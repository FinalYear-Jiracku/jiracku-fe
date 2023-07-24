import { Button } from "antd";

const CreateButton = ({
  disabled,
  action,
  content,
  color,
}) => {
  const backgroundColorStyle = {
    color: color
  };
  return (
    <Button
      onClick={action}
      disabled={disabled}
      style={backgroundColorStyle}
    >
      {content}
    </Button>
  );
};

export default CreateButton;
