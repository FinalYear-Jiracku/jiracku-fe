import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

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
  }, []);
  return <div>AcceptEmail</div>;
};

export default AcceptInvite;
