import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import HeaderContext from "../../../context/HeaderProvider";
import { getZoomTokenAction } from "../../../redux/action/event-action";
import { useSelector } from "react-redux";

const MeetingPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const codes = searchParams.get("code");
  const zoomToken = useSelector((state) => state.eventReducer.zoomToken);
  const eventId = useSelector((state) => state.eventReducer.eventId);
  console.log(eventId);
  const exchangeToken = async () => {
    const code = codes;
    dispatch(getZoomTokenAction(code));
  };

  useEffect(() => {
    dispatch(setProjectId(projectId));
    header.setHeader({
      title: "MEETING MANAGEMENT",
      breadCrumb: [{ name: "Meeting", url: `/meeting` }],
    });
    if(zoomToken === null){
      exchangeToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return <div>hehehe</div>;
};

export default MeetingPage;
