import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getDataStatusListAction,
  getDropdownStatusListAction,
} from "../../../../redux/action/status-action";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateDnd, updateOrder } from "../../../../api/issue-api";
import SeachBar from "../../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../../components/Atoms/Buttons/CreateButton";
import { Button, Select, Tooltip } from "antd";
import {
  UserAddOutlined,
  PlusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import InviteUser from "../../../../components/Organisms/InviteUser/InviteUser";
import { setProjectId } from "../../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../../redux/reducer/sprint-reducer";
import {
  getUserDetailAction,
  getUserProjectListAction,
} from "../../../../redux/action/user-action";
import {
  getSprintDetailAction,
  getSprintListAction,
} from "../../../../redux/action/sprint-action";
import EmptyData from "../../../../components/Atoms/EmptyData/EmptyData";
import Loading from "../../../../components/Atoms/Loading/Loading";
import NewStatus from "../../../../components/Organisms/Status/NewStatus/NewStatus";
import DeleteStatus from "../../../../components/Organisms/Status/DeleteStatus/DeleteStatus";
import UpdateStatus from "../../../../components/Organisms/Status/UpdateStatus/UpdateStatus";
import CompleteIssue from "../../../../components/Organisms/Issue/CompleteIssue/CompleteIssue";
import { getProjectDetailAction } from "../../../../redux/action/project-action";
import SignalRContext from "../../../../context/SignalRContext";
import { ACCESS_TOKEN } from "../../../../constants/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";

const typeList = [
  { value: 1, label: "Task" },
  { value: 2, label: "Bug" },
];

const priorityList = [
  { value: 1, label: "Urgent" },
  { value: 2, label: "High" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Low" },
];

const tooltipTitle = "You must have a Completed Status to Complete Sprint";

const ColumnIssue = () => {
  const { sprintId, projectId } = useParams();
  const refComplete = useRef();
  const refInviteUser = useRef(null);
  const refCreateColumn = useRef(null);
  const refUpdateColumn = useRef(null);
  const refDeleteColumn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connection, setConnection } = useContext(SignalRContext);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [priority, setPriority] = useState();
  const [status, setStatus] = useState();
  const [user, setUser] = useState();
  const [projectName, setProjectName] = useState();
  const [statusId, setStatusId] = useState();
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const dataStatusList = useSelector(
    (state) => state.statusReducer.dataStatusList
  );
  const sprintList = useSelector((state) => state.sprintReducer.sprintList);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const projectDetail = useSelector(
    (state) => state.projectReducer.projectDetail
  );
  const sprintDetail = useSelector((state) => state.sprintReducer.sprintDetail);
  const dropdownStatusList = useSelector(
    (state) => state.statusReducer.dropdownStatusList
  );

  const handleOpenInviteUserModal = () => {
    refInviteUser.current.openModalHandle();
  };
  const userProjectList = useSelector(
    (state) => state.userReducer.userProjectList
  );

  const renderStatus = dropdownStatusList.map((data) => ({
    value: data.id,
    label: data.name,
  }));

  const renderUserProject = userProjectList.map((data) => ({
    value: data.id,
    label: data.email,
  }));

  const handleOpenEditModal = (statusId) => {
    setStatusId(statusId);
    refUpdateColumn.current.openModalHandle();
  };

  const handleOpenDeleteModal = (statusId) => {
    setStatusId(statusId);
    refDeleteColumn.current.openModalHandle();
  };

  const fetchFilteredData = () => {
    setLoading(true);
    dispatch(
      getDataStatusListAction({
        sprintId: `${sprintId}`,
        currentPage: params.page,
        searchKey: params.searchKey,
        type: type,
        priority: priority,
        status: status,
        user: user,
      })
    )
      .then((response) => response)
      .finally(() => {
        setLoading(false);
      });
  };

  const filterType = (value) => {
    setType(value);
    fetchFilteredData();
  };

  const filterPriority = (value) => {
    setPriority(value);
    fetchFilteredData();
  };

  const filterStatus = (value) => {
    setStatus(value);
    fetchFilteredData();
  };

  const filterUser = (value) => {
    setUser(value);
    fetchFilteredData();
  };

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
  
  const check = () => {
    return dataStatusList?.data?.some((column) => column.name === "Completed" && projectDetail?.createdBy === userDetail?.email);
  };

  const sendMessage = async (projectId, message) => {
    if (!connection) {
      console.error("Connection not established.");
      return;
    }

    if (connection.state !== "Connected") {
      try {
        await connection.start();
        console.log("Reconnected to SignalR Hub");
        connection
          .invoke("OnConnectedAsync", projectId.toString())
          .then((response) => response)
          .catch((error) => console.error("Error sending request:", error));
      } catch (error) {
        console.error("Error connecting to SignalR Hub:", error);
        return;
      }
    }

    try {
      await connection.invoke("SendMessage", projectId, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const findIssueById = (issueId) => {
    for (const column of dataStatusList?.data) {
      const foundIssue = column.issues.find(
        (issue) => issue.id.toString() === issueId
      );
      if (foundIssue) {
        return foundIssue;
      }
    }
    return null;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const startLocation = result.source.droppableId;
    const dropLocation = result.destination.droppableId;
    if (startLocation === dropLocation) {
      let foundColumn = dataStatusList?.data?.find((obj) => {
        return obj.id.toString() === result.destination.droppableId;
      });
      const items = Array.from(foundColumn?.issues);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      const objIndex = dataStatusList?.data?.findIndex(
        (obj) => obj.id.toString() === result.destination.droppableId
      );
      const dataClone = [...dataStatusList?.data];
      dataClone[objIndex] = { ...dataClone[objIndex], issues: items };

      const updateOrderData = {
        id: result.draggableId,
        statusId: result.destination.droppableId,
        order: result.destination.index + 1,
      };
      await updateOrder(updateOrderData)
        .then((response) => {
          //dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }));
        })
        .catch((error) => {});
    } else {
      const foundColumn = dataStatusList?.data?.find((obj) => {
        return obj.id.toString() === result.destination.droppableId;
      });

      // Get the issue and column names
      const issue = findIssueById(result.draggableId);
      const statusName = foundColumn?.name;

      const updateDndData = {
        id: result.draggableId,
        statusId: result.destination.droppableId,
        order: result.destination.index + 1,
      };

      await updateDnd(updateDndData)
        .then((response) => {
          //dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }));
          sendMessage(
            `${projectId.toString()}`,
            `${userDetail?.email} changed status of Issue: ${issue.name} to ${statusName} of Sprint: ${sprintDetail.name}`
          );
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    dispatch(setProjectId(projectId));
    dispatch(setSprintId(sprintId));
    setProjectName(sprintList.name);
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
      fetchFilteredData();

      dispatch(
        getDataStatusListAction({
          sprintId: `${sprintId}`,
          currentPage: params.page,
          searchKey: params.searchKey,
          type: type,
          priority: priority,
          status: status,
          user: user,
        })
      )
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
      dispatch(getUserDetailAction());
      dispatch(getSprintListAction({ projectId: projectId }));
      dispatch(getProjectDetailAction(`${projectId}`));
      dispatch(getDropdownStatusListAction(`${sprintId}`));
      dispatch(getUserProjectListAction(`${projectId}`));
      dispatch(getSprintDetailAction(`${sprintId}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, projectId, sprintId, projectName, type, priority, status, user]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveMessage", (message) => {
        console.log(`Received message: ${message}`);

        // Fetch the updated notification list when a message is received
        dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }))
          .then((response) => response)
          .finally(() => {
            setLoading(false);
          });
      });

      // Fetch the initial notification list after the SignalR connection is established
      dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }))
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
    } else {
      const token = window.localStorage.getItem(ACCESS_TOKEN);
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:4204/notification", {
          accessTokenFactory: () => token,
        })
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("Connected to SignalR Hub");
          newConnection
            .invoke("OnConnectedAsync", projectId.toString())
            .then((response) => response)
            .catch((error) => console.error("Error sending request:", error));

          // Cập nhật kết nối SignalR vào Redux
          setConnection(newConnection);
        })
        .catch((error) =>
          console.error("Error connecting to SignalR Hub:", error)
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

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
          <div className={styles["filter"]}>
            <div className={styles.text}>Type:</div>
            <div>
              <Select
                value={type}
                options={typeList}
                className={styles.select}
                allowClear={true}
                onChange={filterType}
              />
            </div>
          </div>
          <div className={styles["filter"]}>
            <div className={styles.text}>Priority:</div>
            <div>
              <Select
                value={priority}
                options={priorityList}
                className={styles.select}
                allowClear={true}
                onChange={filterPriority}
              />
            </div>
          </div>
          <div className={styles["filter"]}>
            <div className={styles.text}>Status:</div>
            <div>
              <Select
                value={status}
                options={renderStatus}
                className={styles.select}
                allowClear={true}
                onChange={filterStatus}
              />
            </div>
          </div>
          <div className={styles["filter"]}>
            <div className={styles.text}>Assignee:</div>
            <div>
              <Select
                value={user}
                options={renderUserProject}
                className={styles.select}
                allowClear={true}
                onChange={filterUser}
              />
            </div>
          </div>
        </div>
        {check() ? (
          <CreateButton
            content="Complete Sprint"
            color="#155E75"
            action={() => refComplete?.current?.openModalHandle()}
          />
        ) : projectDetail?.createdBy !== userDetail?.email ? (
            <CreateButton
              content="Complete Sprint"
              color="#155E75"
              action={() => refComplete?.current?.openModalHandle()}
              disabled={true}
            />
        ) : (
          <div
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <Tooltip title={tooltipTitle} visible={isTooltipVisible}>
              <CreateButton
                content="Complete Sprint"
                color="#155E75"
                action={() => refComplete?.current?.openModalHandle()}
                disabled={!check()}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {dataStatusList?.data?.length === 0 && <EmptyData />}
      {loading ? (
        <div className={styles["loading-container"]}>
        <Loading />
        </div>
      ) : (
        <div className={styles.container}>
          <DragDropContext onDragEnd={onDragEnd}>
            {dataStatusList?.data?.map((column) => (
              <Droppable
                key={column.id.toString()}
                droppableId={column.id.toString()}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`${styles.column} ${styles["scrollable-container"]}`}
                  >
                    <div className={styles["status-button"]}>
                      <h2>{column.name}</h2>
                      <div>
                        <Button
                          type="text"
                          icon={<FormOutlined />}
                          onClick={() => handleOpenEditModal(column.id)}
                          disabled={
                            projectDetail?.createdBy === userDetail?.email
                              ? false
                              : true
                          }
                        ></Button>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleOpenDeleteModal(column.id)}
                          disabled={
                            projectDetail?.createdBy === userDetail?.email
                              ? false
                              : true
                          }
                        ></Button>
                      </div>
                    </div>

                    {column?.issues?.map((item, index) => (
                      <Draggable
                        key={item.id.toString()}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.item}
                          >
                            <div>
                              <div className={styles.card}>
                                <div>{item.name}</div>
                                <div className={styles.card}>
                                  <div>
                                    {item.type === 1 ? (
                                      <PlusSquareOutlined
                                        style={{ color: "green" }}
                                      />
                                    ) : item.type === 2 ? (
                                      <CloseCircleOutlined
                                        style={{ color: "red" }}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className={styles["type-priority"]}>
                                    {" "}
                                    {item.priority === 1 ? (
                                      <FlagOutlined style={{ color: "red" }} />
                                    ) : item.priority === 2 ? (
                                      <FlagOutlined
                                        style={{ color: "yellow" }}
                                      />
                                    ) : item.priority === 3 ? (
                                      <FlagOutlined style={{ color: "blue" }} />
                                    ) : item.priority === 4 ? (
                                      <FlagOutlined style={{ color: "grey" }} />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                              {item.user?.email ? item.user?.email : ""}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
          <div>
            <CreateButton
              content={<PlusSquareOutlined />}
              color="#155E75"
              action={() => refCreateColumn?.current?.openModalHandle()}
              disabled={
                projectDetail?.createdBy === userDetail?.email ? false : true
              }
            />
          </div>
        </div>
      )}
      <InviteUser ref={refInviteUser} projectName={projectName} />
      <NewStatus ref={refCreateColumn} userDetail={userDetail} />
      <UpdateStatus
        ref={refUpdateColumn}
        statusId={statusId}
        userDetail={userDetail}
      />
      <DeleteStatus ref={refDeleteColumn} statusId={statusId} />
      <CompleteIssue ref={refComplete} />
    </div>
  );
};

export default ColumnIssue;
