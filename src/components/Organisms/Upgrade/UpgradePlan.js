import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Button, Card, Modal } from "antd";
import styles from "./styles.module.scss";
import UpgradeElenment from "./UpgradeElement";


const UpgradePlan = forwardRef((props, ref) => {
  const [openModal, setOpenModal] = useState(false);
  const refUpgrade = useRef();
 
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

  return (
    <Modal
      title="Upgrade Plan"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <div className={styles["upgrade-card-container"]}>
        <Card className={styles["upgrade-card"]}>
          <h3>Free Plan</h3>
          <h3>All Basic</h3>
          <h2>0 Vnd</h2>
          <h3>Your current Plan</h3>
        </Card>
        <Card className={styles["upgrade-card"]}>
          <h3>Unlimited Plan</h3>
          <h3>Advanced feature</h3>
          <h2>50000 Vnd</h2>
          <Button type="primary" onClick={() => refUpgrade?.current?.openModalHandle()}>
            Upgrade Now
          </Button>
        </Card>
      </div>
      <UpgradeElenment ref={refUpgrade}/>
    </Modal>
  );
});

export default UpgradePlan;
