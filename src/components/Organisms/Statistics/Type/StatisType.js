import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Select } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./styles.module.scss";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { getStatisTypeAction } from "../../../../redux/action/issue-action";
import { getDropdownSprintListAction, getStartSprintListAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";

const StatisType = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [sprint, setSprint] = useState(null);
  const statisType = useSelector((state) => state.issueReducer.statisType);
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

  const chartDataType = {
    labels: ["Tasks", "Bugs"],
    datasets: [
      {
        data: [statisType.task, statisType.bug],
        backgroundColor: ["#B0E57C", "#F08080"],
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

  const fetchFilteredData = (selectedSprint) => {
    dispatch(getStatisTypeAction(selectedSprint))
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
      title="Statis Type"
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
        <Pie data={chartDataType} options={chartOptions}/>
      </div>
    </Modal>
  );
});

export default StatisType;
