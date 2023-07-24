import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { sendEmail } from "../../../api/user-api";
import { MESSAGE } from "../../../constants/constants";
import InviteForm from "../../Molecules/InviteUser/InviteForm";



const InviteUser = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [openModal, setOpenModal] = useState(false);
 
  const openModalHandle = () => {
    setOpenModal(true);
  };
  const closeModalHandle = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  useImperativeHandle(ref, () => {
    return {
      openModalHandle,
      closeModalHandle,
    };
  });
  const onSubmitForm = async (item) => {
    messageApi.open({type:'loading',content:"Action In Progress",duration:4000})
    const inviteUser = {
      to: item.to === undefined ? "" : item.to,
      subject: "WELCOME TO JIRACKU",
      body: props.projectName,
      projectId : Number(projectId)
    };
    await sendEmail(inviteUser)
      .then((res) => {
        message.success(MESSAGE.INVITE_USER);
        setOpenModal(false);
        navigate(`/projects/${projectId}`);
      })
      .catch((error) => {
        
      });
  };

  return (
    <Modal
      title="Invite User"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      {contextHolder}
      <InviteForm
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default InviteUser;