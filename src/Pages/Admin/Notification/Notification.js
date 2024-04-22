import "../style.scss";

import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import NotificationService from "../../../api/services/AdminService/NotificationService";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import NotificationTable from "./NotificationTable";

const NotificationScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playersData, setPlayersData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getNotificationList();
    } else {
      navigate("/");
    }
  }, []);

  const getNotificationList = async () => {
    try {
      const responseData = await NotificationService.index().json();

      const playersList = [];
      const managerList = [];
      const adminList = [];

      responseData.data.map((item) => {
        if (item.type === "player") {
          playersList.push(item);
        } else if (item.type === "manager") {
          managerList.push(item);
        } else if (item.type === "admin") {
          adminList.push(item);
        } else {
        }
      });

      setPlayersData(playersList);
      setManagerData(managerList);
      setAdminData(adminList);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Notification</h1>
      </nav>

      <NotificationTable title="Players Notifications" data={playersData} />
      <NotificationTable title="RM Notifications" data={managerData} />
      <NotificationTable title="Admin Notifications" data={adminData} />

      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default NotificationScreen;
