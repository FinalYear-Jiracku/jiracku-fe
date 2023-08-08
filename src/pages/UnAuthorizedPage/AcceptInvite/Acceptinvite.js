import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss"

const AcceptInvite = () => {
  const { inviteToken } = useParams();
  const acceptEmail = async () => {
    await axios
      .get(`http://localhost:4206/api/users/accept/${inviteToken}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  };

  useEffect(() => {
    acceptEmail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className={styles.success}>You have just accepted the invitation</div>;
};

export default AcceptInvite;
