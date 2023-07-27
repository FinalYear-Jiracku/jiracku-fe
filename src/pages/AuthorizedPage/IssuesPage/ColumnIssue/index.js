import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDataStatusListAction } from "../../../../redux/action/status-action";
import { useParams } from "react-router-dom";
import { updateDnd, updateOrder } from "../../../../api/issue-api";

const ColumnIssue = () => {
  const { sprintId } = useParams();
  const dispatch = useDispatch();
  const dataStatusList = useSelector(
    (state) => state.statusReducer.dataStatusList
  );

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
    dispatch(getDataStatusListAction({ sprintId: `${sprintId}` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId]);

  return (
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
  );
};

export default ColumnIssue;
