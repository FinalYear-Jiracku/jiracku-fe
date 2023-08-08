import React, { useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../redux/reducer/sprint-reducer";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import StatisType from "../../../components/Organisms/Statistics/Type/StatisType";
import StatisPriority from "../../../components/Organisms/Statistics/Priority/StatisPriority";
import StatisStatus from "../../../components/Organisms/Statistics/Status/StatisStatus";
import StatisNumOfIssue from "../../../components/Organisms/Statistics/NumOfIssue/StatisNumOfIssue";
import StatisUser from "../../../components/Organisms/Statistics/User/StatisUser";
import { Card } from "antd";

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
      breadCrumb: [{ name: "Report", url: `/report/${projectId}` }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId, projectId]);

  return (
    <div className={styles.projects}>
      <Card className={styles.card}>
        <CreateButton
          content="Statistics Type"
          color="#155E75"
          action={() => refType?.current?.openModalHandle()}
        />
        <p>Statistics of the total Issues of Task and Bug</p>
      </Card>

      <Card className={styles.card}>
        <CreateButton
          content="Statistics Priority"
          color="#155E75"
          action={() => refPriority?.current?.openModalHandle()}
        />
        <p>Statistics of Total Issues of Urgent, High, Normal and Low</p>
      </Card>

      <Card className={styles.card}>
        <CreateButton
          content="Statistics Status"
          color="#155E75"
          action={() => refStatus?.current?.openModalHandle()}
        />
        <p>
          Statistics of the total number of completed and uncompleted Issues
        </p>
      </Card>

      <Card className={styles.card}>
        <CreateButton
          content="Statistics Sprint"
          color="#155E75"
          action={() => refNumOfIssue?.current?.openModalHandle()}
        />
        <p>Statistics of the total number of Issues of Each Sprint</p>
      </Card>

      <Card className={styles.card}>
        <CreateButton
          content="Statistics User"
          color="#155E75"
          action={() => refUser?.current?.openModalHandle()}
        />
        <p>Statistics of Total Issues of Each User</p>
      </Card>

      <StatisType ref={refType} />
      <StatisPriority ref={refPriority} />
      <StatisStatus ref={refStatus} />
      <StatisNumOfIssue ref={refNumOfIssue} />
      <StatisUser ref={refUser} />
    </div>
  );
};

export default ReportPage;
