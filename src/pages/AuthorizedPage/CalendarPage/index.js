import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import HeaderContext from "../../../context/HeaderProvider";
import NewCalendar from "../../../components/Organisms/Calendar/NewCalendar/NewCalendar";
import styles from "./styles.module.scss";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";
import { getEventListAction } from "../../../redux/action/event-action";
import UpdateCalendar from "../../../components/Organisms/Calendar/UpdateCalendar/UpdateCalendar";
import { getProjectDetailAction } from "../../../redux/action/project-action";

const CalenderPage = () => {
  const { projectId } = useParams();
  const refAddEvent = useRef();
  const refUpdateEvent = useRef();
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const [eventId, setEventId] = useState();
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const dataList = useSelector((state) => state.eventReducer.dataList);
  const projectDetail = useSelector(
    (state) => state.projectReducer.projectDetail
  );

  const handleDateClick = () => {
    refAddEvent.current.openModalHandle();
  };

  const calendarEvents =
    dataList?.eventList?.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
    })) || [];

  const issueListEvents =
    dataList?.issueList?.map((issue) => ({
      title: `Sprint: ${issue.sprint}. ${issue.name}`,
      start: issue.startDate,
      end: issue.dueDate,
    })) || [];

  const allEvents = [...calendarEvents, ...issueListEvents];

  const handleEventClick = (clickInfo) => {
    const clickedEventId = clickInfo.event.id;
    const eventSource = clickInfo.event.extendedProps?.source;
    if (eventSource === "calendarEvents") {
      if (projectDetail?.createdBy !== userDetail?.email) {
        return;
      }
      setEventId(clickedEventId);
      refUpdateEvent.current.openModalHandle();
    }
  };

  const headerToolbar = {
    left: "prev,next",
    center: "title",
    right: "dayGridMonth,dayGridWeek,dayGridDay",
  };

  useEffect(() => {
    dispatch(setProjectId(projectId));
    dispatch(getUserDetailAction());
    dispatch(getEventListAction(projectId));
    dispatch(getProjectDetailAction(projectId));
    header.setHeader({
      title: "CALENDAR MANAGEMENT",
      breadCrumb: [{ name: "Calendar", url: `/calendar/${projectId}` }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div>
      <div className={styles["new-event-button"]}>
        <Button
          onClick={() => handleDateClick()}
          disabled={
            projectDetail?.createdBy !== userDetail?.email ? true : false
          }
        >
          New Event
        </Button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        headerToolbar={headerToolbar}
        events={allEvents.map((event) => ({
          ...event,
          extendedProps: {
            source: calendarEvents.some((e) => e.id === event.id)
              ? "calendarEvents"
              : "issueListEvents",
          },
        }))}
        eventClick={handleEventClick}
      />
      <NewCalendar ref={refAddEvent} userDetail={userDetail} />
      <UpdateCalendar
        ref={refUpdateEvent}
        eventId={eventId}
        userDetail={userDetail}
      />
    </div>
  );
};

export default CalenderPage;
