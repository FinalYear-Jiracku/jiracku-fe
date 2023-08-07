import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Select } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./styles.module.scss";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { getStatisPriorityAction } from "../../../../redux/action/issue-action";
import { getStartSprintListAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";

const StatisPriority = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [sprint, setSprint] = useState(null);
  const statisPriority = useSelector((state) => state.issueReducer.statisPriority);
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

  const chartDataPriority = {
    labels: ['Urgent', 'High', 'Normal', 'Low'],
    datasets: [
      {
        data: [statisPriority.urgent, statisPriority.high, statisPriority.normal, statisPriority.low],
        backgroundColor: ['#F08080', '#FFA500', '#36A2EB', '#808080'],
      },
    ],
  };

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

  const fetchFilteredData = (selectedSprint) => {
    dispatch(getStatisPriorityAction(selectedSprint))
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
      title="Statis Priority"
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
        <Pie data={chartDataPriority} options={chartOptionsPriority}/>
      </div>
    </Modal>
  );
});

export default StatisPriority;
