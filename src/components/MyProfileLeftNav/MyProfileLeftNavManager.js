import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyProfileLeftNav = (props) => {
  const { t } = useTranslation();
  //assigning location variable
  const location = useLocation();
  //destructuring pathname from location
  const { pathname } = location;
  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/manager/");
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  useEffect(() => {
    // if (props.data === true) {
    //     setActive(false)
    //     console.log(props.data, "slide")
    // }
    // else {
    //     setActive(true)
    // }
    // console.log(props.data, "slide")
  }, []);
  return (
    <>
      <div className="list-group">
        <div className="menu-admin-container">
          <ul className="menu">
            <li
              className={splitLocation[1] === "my-tournaments" ? "active" : ""}
            >
              <Link
                to="/manager/my-tournaments"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.My Tournaments")}
              </Link>
            </li>
            <li className={splitLocation[1] === "my-profile" ? "active" : ""}>
              <Link
                to="/manager/my-profile"
                // onClick={()=> props.parentCallback()}
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.My Profile")}
              </Link>
            </li>
            <li className={splitLocation[1] === "all-rooms" ? "active" : ""}>
              {/* <Link to="/manager/all-rooms">{t('page.myprofile.myprofilenav.All Rooms')}</
                            Link> */}
              <Link
                to="/manager/my-room"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.My Room")}
              </Link>
            </li>
            <li className={splitLocation[1] === "players" ? "active" : ""}>
              <Link
                to="/manager/players"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.My Players")}
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "tournament-directors" ? "active" : ""
              }
            >
              <Link
                to="/manager/tournament-directors"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.Tournament Directors")}
              </Link>
            </li>
            <li
              className={splitLocation[1] === "tournaments-log" ? "active" : ""}
            >
              <Link
                to="/manager/tournaments-log"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.Tournaments log")}
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "rooms-statistics" ? "active" : ""
              }
            >
              <Link
                to="/manager/rooms-statistics"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.Room statistics")}
              </Link>
            </li>

            <li
              className={
                splitLocation[1] === "player-statistics" ? "active" : ""
              }
            >
              <Link
                to="/manager/player-statistics"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.Players statistics")}
              </Link>
            </li>

            <li
              className={
                splitLocation[1] === "payment-subscription" ? "active" : ""
              }
            >
              <Link
                to="/manager/payment-subscription"
                onClick={() => props.parentCallback(isActive)}
              >
                {t("menu.Subscription")}
              </Link>
            </li>
            <li className={splitLocation[1] === "advertising" ? "active" : ""}>
              <Link
                to="/manager/advertising"
                onClick={() => props.parentCallback(isActive)}
              >
              {t("menu.Advertising")}
              </Link>
            </li>
            <li className={splitLocation[1] === "banner" ? "active" : ""}>
              <Link
                to="/manager/banner"
                onClick={() => props.parentCallback(isActive)}
              >
              {t("menu.Banner")}
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "premium-tournament" ? "active" : ""
              }
            >
              <Link
                to="/manager/premium-tournament"
                onClick={() => props.parentCallback(isActive)}
              >
              {t("menu.Premium Tournament")}
              </Link>
            </li>
            {/* <li className={splitLocation[1] === "announce" ? "active" : ""}>
                            <Link to="/manager/announce">Announce late</Link>
                        </li>                      */}
            <li className={splitLocation[1] === "setting" ? "active" : ""}>
              <Link
                to="/manager/setting"
                onClick={() => props.parentCallback(isActive)}
              >
              {t("menu.Settings")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyProfileLeftNav;
