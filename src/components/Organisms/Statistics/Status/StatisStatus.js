import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Select } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./styles.module.scss";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { getStatisStatusAction } from "../../../../redux/action/issue-action";
import { getStartSprintListAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";


const StatisStatus = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [sprint, setSprint] = useState(null);
  const statisStatus = useSelector((state) => state.issueReducer.statisStatus);
  const startSprintList = useSelector(
    (state) => state.sprintReducer.startSprintList
  );
  const renderSprint = startSprintList?.map((data) => ({
    value: data.id,
    label: data.name,
  }));

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

  const chartDataStatus = {
    labels: ['Completed', 'UnCompleted'],
    datasets: [
      {
        data: [statisStatus.completed, statisStatus.unCompleted],
        backgroundColor: ['#F08080', '#FFA500'],
      },
    ],
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


  const fetchFilteredData = (selectedSprint) => {
    dispatch(getStatisStatusAction(selectedSprint))
      .then((response) => response)
      .finally(() => {});
  };
  
  const filterSprint = (value) => {
    setSprint(value);
    fetchFilteredData(value);
  };
  useEffect(() => {
    if (sprint) {
      fetchFilteredData(sprint);
    }
    dispatch(getStartSprintListAction(`${projectId}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint]);

  return (
    <Modal
      title="Statis Status"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <div>
        <Select
          value={sprint}
          options={renderSprint}
          className={styles.select}
          onChange={filterSprint}
        />
        <Pie data={chartDataStatus} options={chartOptionsStatus}/>
      </div>
    </Modal>
  );
});

export default StatisStatus;
