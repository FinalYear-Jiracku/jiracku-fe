import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Select } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./styles.module.scss";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { getStatisUserAction } from "../../../../redux/action/issue-action";
import { getDropdownSprintListAction, getStartSprintListAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";

const StatisUser = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [sprint, setSprint] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const statisUser =
    useSelector((state) => state.issueReducer.statisUser) || [];
  const startSprintList = useSelector(
    (state) => state.sprintReducer.startSprintList
  );
  const renderSprint = startSprintList.map((data) => ({
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

  // const getRandomColor = () => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  const fixedColors = [
    "#FF5733", // Màu 1
    "#36A2EB", // Màu 2
    "#F7464A", // Màu 3
    "#46BFBD", // Màu 4
    "#D4CCC5", // Màu 5
    "#FFC300", // Màu 6
    "#9A55FF", // Màu 7
    "#00BFFF", // Màu 8
    "#FF1493", // Màu 9
    "#00FF7F", // Màu 10
  ];

  const statusColors = {};

  const labels = dataUser?.map((userStatus) => userStatus?.email) || [];
  const datasets = dataUser?.[0]?.statusCounts?.map((statusCount, index) => {
    if (!statusColors[statusCount.statusName]) {
      statusColors[statusCount.statusName] =
        fixedColors[index % fixedColors.length];
    }
  
    return {
      label: statusCount?.statusName,
      data: dataUser?.map(
        (userStatus) =>
          userStatus.statusCounts?.find(
            (count) => count?.statusName === statusCount?.statusName
          )?.issueCount || 0
      ),
      backgroundColor: statusColors[statusCount.statusName],
    };
  }) || [];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const fetchFilteredData = (selectedSprint) => {
  dispatch(getStatisUserAction(selectedSprint))
    .then((response) => {
      const updatedData = statisUser.map((userStatus) => {
        const statusCounts = userStatus.statusCounts.map((statusCount) => ({
          statusName: statusCount.statusName,
          issueCount: statusCount.issueCount,
        }));
        return {
          email: userStatus.email,
          statusCounts: statusCounts,
        };
      });
      setDataUser(updatedData);
    })
    .finally(() => {});
};

  const filterSprint = (value) => {
    setSprint(value);
    fetchFilteredData(value);
  };
  useEffect(() => {
    if (sprint && statisUser.length > 0) {
      fetchFilteredData(sprint);
      setDataUser(statisUser);
    }
    dispatch(getStartSprintListAction(`${projectId}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint, statisUser]);

  return (
    <Modal
      title="Statis Users"
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
        <Bar data={data} />
      </div>
    </Modal>
  );
});

export default StatisUser;
