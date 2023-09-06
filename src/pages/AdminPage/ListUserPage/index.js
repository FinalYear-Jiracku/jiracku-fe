import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import { Button, Image, Table } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";
import { getUserListAction } from "../../../redux/action/user-action";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import Loading from "../../../components/Atoms/Loading/Loading";
import DisableUser from "../../../components/Organisms/User/DisableUser/DisableUser";
import EnableUser from "../../../components/Organisms/User/EnableUser/EnableUser";

const ListUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refEnableModal = useRef(null);
  const refDisableModal = useRef(null);
  const header = useContext(HeaderContext);
  const [userId, setUserId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const userList = useSelector((state) => state.userReducer.userList);

  const params = useMemo(() => {
    return {
      page: searchParams.get("page"),
      searchKey: searchParams.get("search"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("search"), searchParams.get("page")]);

  const handlePagination = (value) => {
    navigate({
      pathname: "/admin/userList",
      search: `?page=${value}${
        params.searchKey ? `&search=${params.searchKey}` : ""
      }`,
    });
  };

  const handleSearch = (value) => {
    navigate({
      pathname: "/admin/userList",
      search: `?page=1${value !== "" ? `&search=${value}` : ""}`,
    });
  };

  const handleDisableModal = (projectId) => {
    setUserId(projectId);
    refDisableModal.current.openModalHandle();
  };

  const handleEnableModal = (projectId) => {
    setUserId(projectId);
    refEnableModal.current.openModalHandle();
  };

  const defaultColumns = [
    {
      title: "Email",
      dataIndex: "email",
      width: "300px",
      align: "center",
      // render: (_, record) => {
      //   return (
      //     <Button
      //       type="text"
      //       onClick={() => handleOpenEditModal(record.id)}
      //     >
      //       <div>{record.email}</div>
      //     </Button>
      //   );
      // },
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "100px",
      align: "center",
      render: (_, record) => {
        return record?.user === null ? (
          ""
        ) : (
          <Image src={record?.image} alt="icon" className={styles.avatar} />
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "80px",
      align: "center",
    },
    {
      title: "AC",
      dataIndex: "",
      align: "center",
      width: "100px",
      render: (_, record) => {
        return (
          <Button
            type="text"
            className={record.isDeleted ? styles["button-enable"] : styles["button-disable"]}
            onClick={() => {
              if (record.isDeleted) {
                handleEnableModal(record.id);
              } else {
                handleDisableModal(record.id);
              }
            }}
          >
            {record.isDeleted === true ? "Enable" : "Disable"}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    header.setHeader({
      title: "USERS MANAGEMENT",
      breadCrumb: [{ name: "Users", url: "/admin/userList" }],
    });
    if (!params.page) {
      navigate({
        pathname: "/admin/userList",
        search: `?page=1${
          params.searchKey ? `&search=${params.searchKey}` : ""
        }`,
      });
    }
    if (
      params.page &&
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      setLoading(true);
      dispatch(
        getUserListAction({
          currentPage: params.page,
          searchKey: params.searchKey,
        })
      )
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
    }
    setTotalRecord(userList.totalRecords);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, userList.totalRecords]);

  return (
    <div>
      <div className={styles["common-bar"]}>
        <SeachBar
          onChangeEvent={handleSearch}
          placeholder="Search User"
          borderColor="#155E75"
        />
      </div>
      {loading ? (
        <div className={styles["loading-container"]}>
          <Loading />
        </div>
      ) : (
        <div>
          <Table
            dataSource={userList?.data}
            columns={defaultColumns}
            pagination={false}
            scroll={{ x: 800, y: 380 }}
            rowKey={(record) => record?.id}
            className={styles.table}
            bordered
          />
        </div>
      )}
      {userList?.data?.length === 0 && <EmptyData />}
      {totalRecord > 8 && (
        <div className={styles["pagination-container"]}>
          <Paginate
            currentPage={parseInt(params.page)}
            pageChangeHandler={handlePagination}
            totalRecord={totalRecord}
            pageSize={8}
          />
        </div>
      )}
      <DisableUser ref={refDisableModal} userId={userId}/>
      <EnableUser  ref={refEnableModal} userId={userId}/>
    </div>
  );
};

export default ListUserPage;
