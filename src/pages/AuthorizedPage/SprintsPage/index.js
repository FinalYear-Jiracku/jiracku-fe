import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { Button, Card } from "antd";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import {
  FormOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import NewSprint from "../../../components/Organisms/Sprint/NewSprint/NewSprint";
import UpdateSprint from "../../../components/Organisms/Sprint/UpdateSprint/UpdateSprint";
import DeleteSprint from "../../../components/Organisms/Sprint/DeleteSprint/DeleteSprint";
import { useDispatch, useSelector } from "react-redux";
import { getIssueListAction } from "../../../redux/action/issue-action";
import { getSprintListAction } from "../../../redux/action/sprint-action";
import Loading from "../../../components/Atoms/Loading/Loading";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { getUserDetailAction } from "../../../redux/action/user-action";
import InviteUser from "../../../components/Organisms/InviteUser/InviteUser";
import SignalRContext from "../../../context/SignalRContext";

const SprintsPage = () => {
  const { projectId } = useParams();
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const refInviteUser = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const header = useContext(HeaderContext);
  const {connection} = useContext(SignalRContext);
  const [projectName, setProjectName] = useState();
  const [sprintId, setSprintId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const sprintList = useSelector((state) => state.sprintReducer.sprintList);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const params = useMemo(() => {
    return {
      page: searchParams.get("page"),
      searchKey: searchParams.get("search"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("search"), searchParams.get("page")]);

  const handlePagination = (value) => {
    navigate({
      pathname: `/projects/${projectId}`,
      search: `?page=${value}${
        params.searchKey ? `&search=${params.searchKey}` : ""
      }`,
    });
  };

  const handleSearch = (value) => {
    navigate({
      pathname: `/projects/${projectId}`,
      search: `?page=1${value !== "" ? `&search=${value}` : ""}`,
    });
  };
  
  const handleOpenEditModal = (sprintId) => {
    setSprintId(sprintId);
    refEditModal.current.openModalHandle();
  };

  const handleOpenDeleteModal = (sprintId) => {
    setSprintId(sprintId);
    refDeleteModal.current.openModalHandle();
  };

  const handleOpenInviteUserModal = () => {
    refInviteUser.current.openModalHandle();
  };

  const closeConnection = () => {
    try {
      connection.stop();
      navigate("/projects")
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    dispatch(setProjectId(projectId));
    setProjectName(sprintList.name);
    header.setHeader({
      title: "SPRINTS MANAGEMENT",
      breadCrumb: [
        { name: "Projects", url: "/projects" },
        { name: projectName, url: `/projects/${projectId}?page=1` },
      ],
    });
    if (!params.page) {
      navigate({
        pathname: `/projects/${projectId}`,
        search: `?page=1${
          params.searchKey ? `&search=${params.searchKey}` : ""
        }`,
      });
    }
    if (params.page) {
      setLoading(true);
      dispatch(getUserDetailAction());
      dispatch(
        getSprintListAction({
          projectId: projectId,
          currentPage: params.page,
          searchKey: params.searchKey,
        })
      )
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
    }
    setTotalRecord(sprintList?.sprints?.totalRecords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params,
    sprintList.name,
    sprintList?.sprints?.totalRecords,
    projectName,
    projectId,
  ]);

  return (
    <div>
      <div className={styles["common-bar"]}>
        <div className={styles["invite-user"]}>
        <Button
            icon={<LeftCircleOutlined />}
            onClick={() => closeConnection()}
            className={styles["button-left"]}
          />
          <SeachBar
            onChangeEvent={handleSearch}
            placeholder="Search Sprints"
            borderColor="#155E75"
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => handleOpenInviteUserModal()}
            className={styles["button-invite"]}
          />
        </div>
        <CreateButton
          content="Create New Sprint"
          color="#155E75"
          action={() => refAddModal?.current?.openModalHandle()}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.sprints}>
          {sprintList?.sprints?.data?.map((data, index) => (
            <Card key={index} className={styles.card}>
              <div className={styles.button}>
                <div
                  className={styles.button}
                  onClick={() =>
                    dispatch(
                      getIssueListAction({
                        sprintId: `${data?.id}`,
                        searchKey: "",
                      })
                    )
                  }
                >
                  <Link
                    key={index}
                    to={`/projects/${projectId}/${data?.id}?page=1`}
                    className={styles.link}
                  >
                    <p>{data.name}</p>
                  </Link>
                </div>
                <div>
                  <Button
                    type="text"
                    icon={<FormOutlined />}
                    onClick={() => handleOpenEditModal(data.id)}
                  ></Button>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleOpenDeleteModal(data.id)}
                  ></Button>
                </div>
              </div>
              <div className={styles.button}>
                <p>
                  Start Date:{" "}
                  {data.startDate === null
                    ? ""
                    : dayjs(data.startDate).format("YYYY-MM-DD")}
                </p>
                <p>
                  End Date:{" "}
                  {data.endDate === null
                    ? ""
                    : dayjs(data.endDate).format("YYYY-MM-DD")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {sprintList?.sprints?.data?.length === 0 && <EmptyData />}
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
      <NewSprint ref={refAddModal} userDetail={userDetail} />
      <UpdateSprint
        ref={refEditModal}
        sprintId={sprintId}
        userDetail={userDetail}
      />
      <DeleteSprint ref={refDeleteModal} sprintId={sprintId} />
      <InviteUser ref={refInviteUser} projectName={projectName} />
    </div>
  );
};

export default SprintsPage;
