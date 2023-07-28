import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Button, Image, Table } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  DeleteOutlined,
  FlagOutlined,
  PlusSquareOutlined,
  CloseCircleOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import DeleteIssue from "../../../../components/Organisms/Issue/DeleteIssue/DeleteIssue";
import NewIssue from "../../../../components/Organisms/Issue/NewIssue/NewIssue";
import UpdateIssue from "../../../../components/Organisms/Issue/UpdateIssue/UpdateIssue";
import HeaderContext from "../../../../context/HeaderProvider";
import SeachBar from "../../../../components/Atoms/SearchBar/SeachBar";
import Loading from "../../../../components/Atoms/Loading/Loading";
import { getUserDetailAction } from "../../../../redux/action/user-action";
import CreateButton from "../../../../components/Atoms/Buttons/CreateButton";
import { getIssueListAction } from "../../../../redux/action/issue-action";
import { setProjectId } from "../../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../../redux/reducer/sprint-reducer";
import { getSprintListAction } from "../../../../redux/action/sprint-action";
import InviteUser from "../../../../components/Organisms/InviteUser/InviteUser";

const TableIssue = () => {
  const { projectId, sprintId } = useParams();
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const refInviteUser = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState();
  const [sprintName, setSprintName] = useState();
  const [issueId, setIssueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const header = useContext(HeaderContext);
  const [searchParams] = useSearchParams();
  const issueList = useSelector((state) => state.issueReducer.issueList);
  const sprintList = useSelector((state) => state.sprintReducer.sprintList);
  const userDetail = useSelector((state) => state.userReducer.userDetail);

  const params = useMemo(() => {
    return {
      page: searchParams.get("page"),
      searchKey: searchParams.get("search"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("search"), searchParams.get("page")]);

  const handleSearch = (value) => {
    navigate({
      pathname: `/projects/${projectId}/${sprintId}`,
      search: `?page=1${value !== "" ? `&search=${value}` : ""}`,
    });
  };

  const handleOpenEditModal = (issueId) => {
    setIssueId(issueId);
    refEditModal.current.openModalHandle();
  };

  const handleOpenDeleteModal = (issueId) => {
    setIssueId(issueId);
    refDeleteModal.current.openModalHandle();
  };

  const handleOpenInviteUserModal = () => {
    refInviteUser.current.openModalHandle();
  };

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "300px",
      align: "center",
      render: (_, record) => {
        return (
          <Button type="text" onClick={() => handleOpenEditModal(record.id)}>
            {record.name}
          </Button>
        );
      },
    },
    {
      title: "Point",
      dataIndex: "storyPoint",
      width: "70px",
      align: "center",
    },
    {
      title: "SubIssues",
      dataIndex: "subIssues",
      width: "100px",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "70px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.type === 1 ? (
              <PlusSquareOutlined style={{ color: "green" }}/>
            ) : record.type === 2 ? (
              <CloseCircleOutlined style={{ color: "red" }} />
            ) : ""}
          </div>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: "80px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.priority === 1 ? (
              <FlagOutlined style={{ color: "red" }} />
            ) : record.priority === 2 ? (
              <FlagOutlined style={{ color: "yellow" }} />
            ) : record.priority === 3 ? (
              <FlagOutlined style={{ color: "blue" }} />
            ) : record.priority === 4 ? (
              <FlagOutlined style={{ color: "grey" }} />
            ) : ""}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return record?.status === null ? "" : <div className={styles.status}>{record?.status?.name}</div>;
      },
    },
    {
      title: "Assignee",
      dataIndex: "user",
      width: "100px",
      align: "center",
      render: (_, record) => {
        return record?.user === null ? "" : <Image src={record?.user.image} alt="icon" className={styles.avatar} />;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.startDate === null
              ? ""
              : dayjs(record.startDate).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.dueDate === null
              ? ""
              : dayjs(record.dueDate).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      title: "AC",
      dataIndex: "",
      align: "center",
      width: "60px",
      render: (_, record) => {
        return (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleOpenDeleteModal(record.id)}
          ></Button>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(setProjectId(projectId));
    dispatch(setSprintId(sprintId));
    setProjectName(sprintList.name);
    setSprintName(issueList.name);
    header.setHeader({
      title: "ISSUES MANAGEMENT",
      breadCrumb: [
        { name: "Projects", url: "/projects" },
        { name: projectName, url: `/projects/${projectId}?page=1` },
        { name: sprintName, url: `/projects/${projectId}/${sprintId}?page=1` },
      ],
    });
    if (!params.page) {
      navigate({
        pathname: `/projects/${projectId}/${sprintId}`,
        search: `?page=1${
          params.searchKey ? `&search=${params.searchKey}` : ""
        }`,
      });
    }
    if (params.page) {
      setLoading(true);
      dispatch(getUserDetailAction());
      dispatch(
        getIssueListAction({
          sprintId: `${sprintId}`,
          currentPage: params.page,
          searchKey: params.searchKey,
        })
      )
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
      dispatch(getSprintListAction({ projectId: projectId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params,
    sprintList.name,
    issueList.name,
    projectId,
    sprintId,
    projectName,
    sprintName,
  ]);

  return (
    <div>
      <div className={styles["common-bar"]}>
        <div className={styles["invite-user"]}>
          <SeachBar
            onChangeEvent={handleSearch}
            placeholder="Search Issues"
            borderColor="#155E75"
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => handleOpenInviteUserModal()}
            className={styles["button-invite"]}
          />
        </div>
        <CreateButton
          content="Create New Issue"
          color="#155E75"
          action={() => refAddModal?.current?.openModalHandle()}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Table
            dataSource={issueList?.issues?.data}
            columns={defaultColumns}
            pagination={false}
            scroll={{ x: 800, y: 430 }}
            rowKey={(record) => record?.id}
            className={styles.table}
            bordered
          />
        </div>
      )}
      <NewIssue ref={refAddModal} userDetail={userDetail}/>
      <UpdateIssue ref={refEditModal} issueId={issueId} userDetail={userDetail} sprintName={sprintName}/>
      <DeleteIssue ref={refDeleteModal} issueId={issueId} />
      <InviteUser ref={refInviteUser} projectName={projectName} />
    </div>
  );
};

export default TableIssue;
