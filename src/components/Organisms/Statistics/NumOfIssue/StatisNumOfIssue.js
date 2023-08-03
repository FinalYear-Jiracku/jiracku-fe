import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getStatisNumOfIssueAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";


const StatisNumOfIssue = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const statisNumOfIssue = useSelector((state) => state.sprintReducer.statisNumOfIssue);

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
  
  const sprintNames = statisNumOfIssue?.map(sprint => sprint.sprintName);
  const totalIssues = statisNumOfIssue?.map(sprint => sprint.numOfIssue);

  const chartData = {
    labels: sprintNames,
    datasets: [
      {
        label: 'Total Issues',
        data: totalIssues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu nền của cột
        borderColor: 'rgba(75, 192, 192, 1)', // Màu viền của cột
        borderWidth: 1,
      },
    ],
  };

  
  useEffect(() => {
    if (projectId) {
       dispatch(getStatisNumOfIssueAction(projectId))
       //setSprintData(statisNumOfIssue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <Modal
      title="Statis Number Issue of Sprint"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <div>
        <Bar data={chartData} />
      </div>
    </Modal>
  );
});

export default StatisNumOfIssue;
