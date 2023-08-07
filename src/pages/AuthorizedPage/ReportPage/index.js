import React, { useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../redux/reducer/sprint-reducer";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss"
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import StatisType from "../../../components/Organisms/Statistics/Type/StatisType";
import StatisPriority from "../../../components/Organisms/Statistics/Priority/StatisPriority";
import StatisStatus from "../../../components/Organisms/Statistics/Status/StatisStatus";
import StatisNumOfIssue from "../../../components/Organisms/Statistics/NumOfIssue/StatisNumOfIssue";
import StatisUser from "../../../components/Organisms/Statistics/User/StatisUser";

const ReportPage = () => {
  const { sprintId, projectId } = useParams();
  const dispatch = useDispatch();
  const refType = useRef(null);
  const refPriority = useRef(null);
  const refStatus = useRef(null);
  const refNumOfIssue = useRef(null);
  const refUser = useRef(null);
  const header = useContext(HeaderContext);

  useEffect(() => {
    dispatch(setProjectId(projectId));
    dispatch(setSprintId(sprintId));
    header.setHeader({
      title: "REPORT MANAGEMENT",
      breadCrumb: [
        { name: "Report", url: `/report/${projectId}` },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId, projectId]);
  
  return (
    <div className={styles.container}>
      <div>
      <CreateButton
          content="Statis Type"
          color="#155E75"
          action={() => refType?.current?.openModalHandle()}
        />
        <CreateButton
          content="Statis Priority"
          color="#155E75"
          action={() => refPriority?.current?.openModalHandle()}
        />
        <CreateButton
          content="Statis Status"
          color="#155E75"
          action={() => refStatus?.current?.openModalHandle()}
        />
        <CreateButton
          content="Statis Sprint"
          color="#155E75"
          action={() => refNumOfIssue?.current?.openModalHandle()}
        />
         <CreateButton
          content="Statis User"
          color="#155E75"
          action={() => refUser?.current?.openModalHandle()}
        />
      </div>
      <StatisType ref={refType}/>
      <StatisPriority ref={refPriority}/>
      <StatisStatus ref={refStatus}/>
      <StatisNumOfIssue ref={refNumOfIssue}/>
      <StatisUser ref={refUser}/>
    </div>
  );
};

export default ReportPage;