import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDataStatusListAction } from "../../../../redux/action/status-action";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateDnd, updateOrder } from "../../../../api/issue-api";
import SeachBar from "../../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../../components/Atoms/Buttons/CreateButton";
import { Button } from "antd";
import { FilterOutlined, UserAddOutlined } from "@ant-design/icons";
import InviteUser from "../../../../components/Organisms/InviteUser/InviteUser";
import { setProjectId } from "../../../../redux/reducer/project-reducer";
import { setSprintId } from "../../../../redux/reducer/sprint-reducer";
import { getUserDetailAction } from "../../../../redux/action/user-action";
import { getSprintListAction } from "../../../../redux/action/sprint-action";

const ColumnIssue = () => {
  const { sprintId, projectId } = useParams();
  const refComplete = useRef();
  const refInviteUser = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState();
  const [sprintName, setSprintName] = useState();
  const [searchParams] = useSearchParams();
  const dataStatusList = useSelector(
    (state) => state.statusReducer.dataStatusList
  );
  const sprintList = useSelector((state) => state.sprintReducer.sprintList);

  const handleOpenInviteUserModal = () => {
    refInviteUser.current.openModalHandle();
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
      dispatch(getUserDetailAction());
      dispatch(
        getDataStatusListAction({
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
  }, [params, projectId, sprintId, projectName]);

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
          <Button
            icon={<FilterOutlined />}
            //onClick={() => handleOpenInviteUserModal()}
            className={styles["button-invite"]}
          />
        </div>
        <CreateButton
          content="Complete Sprint"
          color="#155E75"
          action={() => refComplete?.current?.openModalHandle()}
        />
      </div>
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
                  className={styles.column}
                >
                  <h2>{column.name}</h2>
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
      </div>
      <InviteUser ref={refInviteUser} projectName={projectName}/>
    </div>
  );
};

export default ColumnIssue;
