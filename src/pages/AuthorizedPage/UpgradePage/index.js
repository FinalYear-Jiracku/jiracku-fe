import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { upgradeProject } from "../../../api/project-api";
import { useDispatch } from "react-redux";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import HeaderContext from "../../../context/HeaderProvider";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";


const UpgradeProject = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const header = useContext(HeaderContext);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const upgrade = async () => {
    const upgradeProjectData = {
        id: projectId === undefined ? "" : projectId,
        updatedBy: userDetail?.email === undefined ? "" : userDetail?.email,
      };
      await upgradeProject(upgradeProjectData)
      .then((res) => res)
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClick = () => {
    navigate(`/projects/${projectId}`);
  }

  useEffect(() => {
   dispatch(setProjectId(projectId))
   dispatch(getUserDetailAction());
   header.setHeader({
    title: "UPGRADED",
    breadCrumb: [
      { name: "Upgraded", url: `` },
    ],
   });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if(userDetail?.email !== undefined){
        upgrade()
       }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userDetail?.email])


  return(
    <div>
        You have just upgraded Project
        Click button to Retrun Sprint Page
        <Button onClick={() => handleClick()}>Sprint Page</Button>
    </div>

  ) ;
};

export default UpgradeProject;
