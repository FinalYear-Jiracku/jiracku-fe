import { useState, useEffect, useMemo, useRef } from "react";
import { getApi } from "../../../api/api";
import { Button, Card } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormOutlined, DatabaseOutlined } from "@ant-design/icons";
import { errorNotification } from "../../../constants/constants";
import styles from "./styles.module.scss";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import NewProject from "../../../components/Organisms/Project/NewProject/NewProject";
import Loading from "../../../components/Atoms/Loading/Loading";

const ProjectsPage = () => {
  const refAddModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    getApi(
      `projects?pageNumber=${currentPage || 1}&search=${
        searchKey || ""
      }&pageSize=8`
    )
      .then((response) => {
        setProjectList(response?.data?.data);
        setTotalRecord(response?.data?.totalRecords);
      })
      .catch((err) => {
        errorNotification("Some error happen please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
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
                <Button icon={<FormOutlined />}></Button>
              </div>
              <div className={styles.button}>
                <p>{data.name}</p>
                <div className={styles.button}>
                  <DatabaseOutlined />
                  <p>{data.sprints} Sprints</p>
                </div>
              </div>
              <div className={styles.button}>
                <p>Lead: {data.createdBy}</p>
                <p>Created Date: {data.createdAt}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
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
      <NewProject
        ref={refAddModal}
        projectList={projectList}
        getProjectData={getProjectData}
      />
    </div>
  );
};

export default ProjectsPage;
