import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../redux/reducer/sprint-reducer";
import Chart from 'chart.js/auto';
import { Pie } from "react-chartjs-2";
import { getStatisDealineAction, getStatisPriorityAction, getStatisStatusAction, getStatisTypeAction } from "../../../redux/action/issue-action";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss"

const ReportPage = () => {
  const { sprintId, projectId } = useParams();
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const statisType = useSelector((state) => state.issueReducer.statisType);
  const statisPriority = useSelector((state) => state.issueReducer.statisPriority);
  const statisStatus = useSelector((state) => state.issueReducer.statisStatus);

  const chartDataType = {
    labels: ['Tasks', 'Bugs'],
    datasets: [
      {
        data: [statisType.task, statisType.bug],
        backgroundColor: ['#B0E57C', '#F08080'],
      },
    ],
  };
  const chartDataPriority = {
    labels: ['Urgent', 'High', 'Normal', 'Low'],
    datasets: [
      {
        data: [statisPriority.urgent, statisPriority.high, statisPriority.normal, statisPriority.low],
        backgroundColor: ['#F08080', '#FFA500', '#36A2EB', '#808080'],
      },
    ],
  };
  const chartDataStatus = {
    labels: ['Completed', 'UnCompleted'],
    datasets: [
      {
        data: [statisStatus.completed, statisStatus.unCompleted],
        backgroundColor: ['#F08080', '#FFA500'],
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true, // Hiển thị tiêu đề
        text: 'Statistics about Type of Issue', // Tiêu đề cho biểu đồ
        font: {
          size: 18, // Cỡ chữ tiêu đề
          weight: 'bold', // Độ đậm của chữ tiêu đề
        },
      },
    },
  };
  
  //...
  
  // Tương tự cho các chart khác
  const chartOptionsPriority = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Statistics about Priority of Issue',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };
  
  const chartOptionsStatus = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Statistics about Status of Issue',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };


  useEffect(() => {
    dispatch(setProjectId(projectId));
    dispatch(setSprintId(sprintId));
    header.setHeader({
      title: "REPORT MANAGEMENT",
      breadCrumb: [
        { name: "Report", url: `/report/${projectId}/${sprintId}` },
      ],
    });
    if (sprintId) {
      dispatch(getStatisTypeAction(sprintId));
      dispatch(getStatisPriorityAction(sprintId));
      dispatch(getStatisStatusAction(sprintId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId, projectId]);
  
  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <Pie data={chartDataType} options={chartOptions}/>
      </div>
      <div className={styles.chart}>
        <Pie data={chartDataPriority} options={chartOptionsPriority}/>
      </div>
      <div className={styles.chart}>
        <Pie data={chartDataStatus} options={chartOptionsStatus}/>
      </div>
    </div>
  );
};

export default ReportPage;