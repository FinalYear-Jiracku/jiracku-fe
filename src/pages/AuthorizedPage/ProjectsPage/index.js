import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { getProjectList } from "../../../api/project-api";
import { Button, Card, message } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FormOutlined,
  DatabaseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MESSAGE } from "../../../constants/constants";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import moment from "moment";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import NewProject from "../../../components/Organisms/Project/NewProject/NewProject";
import Loading from "../../../components/Atoms/Loading/Loading";
import UpdateProject from "../../../components/Organisms/Project/UpdateProject/UpdateProject";
import DeleteProject from "../../../components/Organisms/Project/DeleteProject/DeleteProject";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";

const ProjectsPage = () => {
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const header = useContext(HeaderContext);

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

  const getProjectData = ({ currentPage, searchKey }) => {
    setLoading(true);
    getProjectList(
      `projects?pageNumber=${currentPage || 1}&search=${
        searchKey || ""
      }&pageSize=8`
    )
      .then((response) => {
        setProjectList(response?.data?.data);
        setTotalRecord(response?.data?.totalRecords);
      })
      .catch((err) => {
        message.success(MESSAGE.GET_DATA_FAIL);
        setProjectList([]);
      })
      .finally(() => {
        setLoading(false);
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
      getProjectData({
        currentPage: params.page,
        searchKey: params.searchKey,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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
          {projectList?.map((data, index) => (
            <Card key={index} className={styles.card}>
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
              <div className={styles.button}>
                <Link
                  key={index}
                  to={`/projects/${data?.id}?page=1`}
                  className={styles.link}
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
                  Created Date: {moment(data.createdAt).format("DD-MM-YYYY")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {
        projectList?.length === 0 && !loading && (
          <EmptyData/>
        )
      }
      {!loading && totalRecord > 8 && (
        <div className={styles["pagination-container"]}>
          <Paginate
            currentPage={parseInt(params.page)}
            pageChangeHandler={handlePagination}
            totalRecord={totalRecord}
            pageSize={8}
          />
        </div>
      )}
      <NewProject ref={refAddModal}/>
      <UpdateProject
        ref={refEditModal}
        projectId={projectId}
      />
      <DeleteProject
        ref={refDeleteModal}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectsPage;
