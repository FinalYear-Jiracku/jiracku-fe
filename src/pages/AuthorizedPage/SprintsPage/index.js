import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { getSprintList } from "../../../api/sprint-api";
import { Button, Card, message } from "antd";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import {
  FormOutlined,
  DatabaseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MESSAGE } from "../../../constants/constants";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import Loading from "../../../components/Atoms/Loading/Loading";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import NewSprint from "../../../components/Organisms/Sprint/NewSprint/NewSprint";
import UpdateSprint from "../../../components/Organisms/Sprint/UpdateSprint/UpdateSprint";
import DeleteSprint from "../../../components/Organisms/Sprint/DeleteSprint/DeleteSprint";

const SprintsPage = ({ setId }) => {
  const { projectId } = useParams();
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sprintList, setSprintList] = useState([]);
  const [projectName, setProjectName] = useState();
  const [sprintId, setSprintId] = useState(null);
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

  const getSprintData = ({ currentPage, searchKey }) => {
    setLoading(true);
    getSprintList(
      `sprints/data/projects/${projectId}?pageNumber=${
        currentPage || 1
      }&search=${searchKey || ""}&pageSize=8`
    )
      .then((response) => {
        setProjectName(response?.data?.name);
        setSprintList(response?.data?.sprints?.data);
        setTotalRecord(response?.data?.sprints?.totalRecords);
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
        setSprintList([]);
      })
      .finally(() => {
        setLoading(false);
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

  useEffect(() => {
    setId(projectId);
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
      getSprintData({
        currentPage: params.page,
        searchKey: params.searchKey,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, projectName, projectId]);

  return (
    <div>
      <div className={styles["common-bar"]}>
        <div>
          <SeachBar
            onChangeEvent={handleSearch}
            placeholder="Search Sprints"
            borderColor="#155E75"
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
          {sprintList?.map((data, index) => (
            <Card key={index} className={styles.card}>
              <div className={styles.button}>
                <div className={styles.button}>
                  <Link
                    key={index}
                    to={`/projects/${data?.id}?page=1`}
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
                <p>Start Date: {dayjs(data.startDate).format("YYYY-MM-DD")}</p>
                <p>End Date: {dayjs(data.endDate).format("YYYY-MM-DD")}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {sprintList?.length === 0 && !loading && <EmptyData />}
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
      <NewSprint ref={refAddModal} />
      <UpdateSprint ref={refEditModal} sprintId={sprintId} />
      <DeleteSprint ref={refDeleteModal} sprintId={sprintId} />
    </div>
  );
};

export default SprintsPage;
