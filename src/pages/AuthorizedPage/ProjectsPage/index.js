import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { Button, Card } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FormOutlined,
  DatabaseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import NewProject from "../../../components/Organisms/Project/NewProject/NewProject";
import UpdateProject from "../../../components/Organisms/Project/UpdateProject/UpdateProject";
import DeleteProject from "../../../components/Organisms/Project/DeleteProject/DeleteProject";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import { useDispatch, useSelector } from "react-redux";
import { getProjectListAction } from "../../../redux/action/project-action";
import { getSprintListAction } from "../../../redux/action/sprint-action";
import Loading from "../../../components/Atoms/Loading/Loading";
import { getUserDetailAction } from "../../../redux/action/user-action";
import { joinRoom } from "../../../signalR/signalRService";

const ProjectsPage = () => {
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const header = useContext(HeaderContext);
  const projectList = useSelector((state) => state.projectReducer.projectList);
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
      pathname: "/projects",
      search: `?page=${value}${
        params.searchKey ? `&search=${params.searchKey}` : ""
      }`,
    });
  };

  const handleSearch = (value) => {
    navigate({
      pathname: "/projects",
      search: `?page=1${value !== "" ? `&search=${value}` : ""}`,
    });
  };

  const handleOpenEditModal = (projectId) => {
    setProjectId(projectId);
    refEditModal.current.openModalHandle();
  };

  const handleOpenDeleteModal = (projectId) => {
    setProjectId(projectId);
    refDeleteModal.current.openModalHandle();
  };

  useEffect(() => {
    header.setHeader({
      title: "PROJECTS MANAGEMENT",
      breadCrumb: [{ name: "Projects", url: "/projects" }],
    });
    if (!params.page) {
      navigate({
        pathname: "/projects",
        search: `?page=1${
          params.searchKey ? `&search=${params.searchKey}` : ""
        }`,
      });
    }
    if (params.page) {
      setLoading(true);
      dispatch(getUserDetailAction());
      dispatch(
        getProjectListAction({
          currentPage: params.page,
          searchKey: params.searchKey,
        })
      )
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
    }
    setTotalRecord(projectList.totalRecords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, projectList.totalRecords]);

  return (
    <div>
      <div className={styles["common-bar"]}>
        <div>
          <SeachBar
            onChangeEvent={handleSearch}
            placeholder="Search Projects"
            borderColor="#155E75"
          />
        </div>
        <CreateButton
          content="Create New Project"
          color="#155E75"
          action={() => refAddModal?.current?.openModalHandle()}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.projects}>
          {projectList?.data?.map((data) => (
            <Card key={data?.id} className={styles.card}>
              <div className={styles.button}>
                <div></div>
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
              <div
                className={styles.button}
                onClick={() =>
                  dispatch(
                    getSprintListAction({
                      projectId: data.id,
                      currentPage: 1,
                      searchKey: "",
                    })
                  )
                }
              >
                <Link
                  key={data?.id}
                  to={`/projects/${data?.id}?page=1`}
                  className={styles.link}
                  onClick={() => joinRoom(data.id)}
                >
                  <p>{data.name}</p>
                </Link>
                <div className={styles.button}>
                  <DatabaseOutlined />
                  <p>{data.sprints} Sprints</p>
                </div>
              </div>
              <div className={styles.button}>
                <p>Lead: {data.createdBy}</p>
                <p>
                  Created Date: {dayjs(data.createdAt).format("YYYY-MM-DD")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {projectList?.data?.length === 0 && <EmptyData />}
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
      <NewProject ref={refAddModal} userDetail={userDetail} />
      <UpdateProject
        ref={refEditModal}
        projectId={projectId}
        userDetail={userDetail}
      />
      <DeleteProject ref={refDeleteModal} projectId={projectId} />
    </div>
  );
};

export default ProjectsPage;
