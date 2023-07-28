import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "@ant-design/icons";
import InviteUser from "../../../../components/Organisms/InviteUser/InviteUser";
import { setProjectId } from "../../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../../redux/reducer/sprint-reducer";
import {
  getUserDetailAction,
  getUserProjectListAction,
} from "../../../../redux/action/user-action";
import { getSprintListAction } from "../../../../redux/action/sprint-action";
import EmptyData from "../../../../components/Atoms/EmptyData/EmptyData";
import Loading from "../../../../components/Atoms/Loading/Loading";
import NewStatus from "../../../../components/Organisms/Status/NewStatus/NewStatus";
import DeleteStatus from "../../../../components/Organisms/Status/DeleteStatus/DeleteStatus";
import UpdateStatus from "../../../../components/Organisms/Status/UpdateStatus/UpdateStatus";

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
    return dataStatusList?.data?.some((column) => column.name === "Completed");
  };

  const onDragEnd = (result) => {
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
      updateOrder(updateOrderData)
        .then((response) => {
          dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }));
        })
        .catch((error) => {});
    } else {
      const updateDndData = {
        id: result.draggableId,
        statusId: result.destination.droppableId,
        order: result.destination.index + 1,
      };

      updateDnd(updateDndData)
        .then((response) => {
          dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }));
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
      dispatch(getUserDetailAction());
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
      dispatch(getSprintListAction({ projectId: projectId }));
      dispatch(getDropdownStatusListAction(`${sprintId}`));
      dispatch(getUserProjectListAction(`${projectId}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, projectId, sprintId, projectName, type, priority, status, user]);

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
        ) : (
          <div onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
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
        <Loading />
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
                        ></Button>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleOpenDeleteModal(column.id)}
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
                            {item.name}
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
    </div>
  );
};

export default ColumnIssue;
