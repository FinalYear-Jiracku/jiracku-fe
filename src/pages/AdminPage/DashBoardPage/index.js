import React, { useContext, useEffect, useState } from "react";
import HeaderContext from "../../../context/HeaderProvider";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./styles.module.scss";
import {
  getUserStatisAction,
  getYearAction,
} from "../../../redux/action/user-action";
import { Bar } from "react-chartjs-2";
import { Select } from "antd";
import Loading from "../../../components/Atoms/Loading/Loading";
import GoogleAuthContext from "../../../context/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

const DashBoardPage = () => {
  const header = useContext(HeaderContext);
  const { auth } = useContext(GoogleAuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const userStatis = useSelector((state) => state.userReducer.userStatis);
  const yearList = useSelector((state) => state.userReducer.yearList);

  const renderYears = yearList.map((data) => ({
    value: data.year,
  }));
  const fetchFilteredData = () => {
    setLoading(true);
    console.log("year",year);
    dispatch(getUserStatisAction({ searchKey: Number(year) }))
    .then((response) => response)
      .finally(() => {
        setLoading(false);
      });
  }
  
  const filterYear = (value) => {
    setYear(Number(value));
    fetchFilteredData();
  };
  const allMonths = [...Array(12).keys()].map((month) => month + 1);
  const month = userStatis?.map((user) => user?.month);
  const users = userStatis?.map((user) => user?.users);

  const dataMap = new Map(); // Sử dụng một Map để dễ dàng kiểm tra các tháng đã có dữ liệu
  userStatis?.forEach((user) => {
    dataMap.set(user.month, user.users);
  });

// Điền giá trị 0 cho các tháng chưa có dữ liệu
const updatedUsers = allMonths.map((month) => dataMap.get(month) || 0);

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Number of Users Register each Month",
        data: updatedUsers,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu nền của cột
        borderColor: "rgba(75, 192, 192, 1)", // Màu viền của cột
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    header.setHeader({
      title: "DASHBOARD MANAGEMENT",
      breadCrumb: [{ name: "DashBoard", url: "/admin/dashboard" }],
    });
    dispatch(getUserStatisAction({ searchKey: year }));
    dispatch(getYearAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  return (
    <div>
      <div className={styles["invite-user"]}>
      <div className={styles["filter"]}>
        <div className={styles.text}>Year:</div>
        <div>
          <Select
            value={year}
            options={renderYears}
            className={styles.select}
            allowClear={true}
            onChange={filterYear}
          />
        </div>
      </div>
    </div>
    {loading ? (
        <div className={styles["loading-container"]}>
          <Loading />
        </div>
      ) : (
        <Bar data={chartData} />
      )}
    
    </div>
    
  );
};

export default DashBoardPage;
