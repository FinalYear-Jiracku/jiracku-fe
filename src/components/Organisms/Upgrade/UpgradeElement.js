import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { postPayment } from "../../../api/payment-api";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../Molecules/CheckoutForm.js/CheckoutForm";

const stripePromise = loadStripe("pk_test_dI3Kmc0ZvkxZF5GimQnPPmDj00udeihYhB");

const UpgradeElenment = forwardRef((props, ref) => {
  const [openModal, setOpenModal] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

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

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const paymentIntentPost = () => {
    const data = {
      projectId: props.projectId,
    };
    postPayment(data).then((data) => setClientSecret(data.clientSecret));
  };

  useEffect(() => {
    if (!clientSecret) {
      paymentIntentPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret]);

  return (
    <Modal
      title="Upgrade Plan"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </Modal>
  );
});

export default UpgradeElenment;
