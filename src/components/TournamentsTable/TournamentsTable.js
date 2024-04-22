import "./TournamentsTable.scss";

import React, { useEffect, useState } from "react";
import i18next from "i18next";
import logo from "./../../assets/images/right-arrow-svgrepo-com.svg";
import zerogif from "./../../assets/images/0.gif";
import { Button, Col, Image, Modal, Row, Form, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import BannerService from "../../api/services/BannerService";
import TournamentService from "../../api/services/TournamentService";
import AnnouncementService from "../../api/services/AnnouncementService";
import PlayerList from "../PlayerList/PlayerList";
import AnonymousList from "../AnonymousList/AnonymousList";
import WaitingList from "../../components/WaitingList/WaitingList";
import TournamentsStructure from "../TournamentsStructure/TournamentsStructure";
import moment from "moment";
import SettingService from "../../api/services/SettingService";

const TournamentsTable = (props) => {
  const [isActive, setActive] = useState("false");
  const ToggleClass = () => {
    setActive(!isActive);
  };
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showannounce, setShowannounce] = useState(false);
  const [announce, setannounce] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [Error, setError] = useState();

  const [time, setTime] = useState("0");
  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);
  const handleannounceclose = () => setShowannounce(false);
  const [tournamentPlayerDetails, setTournamentPlayerDetails] = useState([]);
  const [tournamentAnonymousList, setTournamentAnonymousList] = useState([]);
  const [tournamentWaitingDetail, setTournamentWaitingDetail] = useState([]);
  const [tournamentStructureDetails, setTournamentStructureDetails] = useState(
    [],
  );
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [tournamentSlug, setTournamentSlug] = useState("");
  const [tournamentRoomSlug, setTournamentRoomSlug] = useState('');
  const [tournamentId, setTournamentId] = useState("");
  const [announceLateTime, setannounceLateTime] = useState("");
  const [premiumIds, setPremiumIds] = useState([]);
  const [isBreakTitle, setIsBreakTitle] = useState("");
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [topbanners, setTopBanner] = useState([]);
  const [topbannersSettings, setTopBannerSetting] = useState([]);
  const [bottomBannerDesktopInterval, setBottomBannerDesktopInterval] = useState(10);
  const [bottomBannerMobileInterval, setBottomBannerMobileInterval] = useState(5);
  var imageUrl = process.env.REACT_APP_ROOM_IMAGE_URL;

  const [anonymousPlayerLength, SetAnonymousPlayerLength] = useState(0);
  const handleCloseRedirect = () => {
    setShow(false);
  };

  function getProgress(registeredPlayers, totalPlayers) {
    let className = "success";
    let playersProgress = registeredPlayers / totalPlayers;

    if (playersProgress <= 0.6) className = "success"; //green
    else if (playersProgress < 1) {
      className = "warning"; //Orange
    } else {
      className = "error"; // Red
    }
    return "text-start players-progress players-progress--" + className;
  }

  function getProgressWidth(registeredPlayers, totalPlayers) {
    return (registeredPlayers * 100) / totalPlayers + "%";
  }

  var adminlogin = JSON.parse(localStorage.getItem("adminuser"));
  const handleTableApi = async (id, slug, roomSlug) => {
    try {
      setTournamentSlug(slug);
      setTournamentRoomSlug(roomSlug);
      let responseData = await TournamentService.table(id).json();
      setTournamentDetails(responseData.data);
      handleShow();
      setTournamentStructureDetails(responseData.data.structure);

      setTournamentPlayerDetails(
        responseData.data?.players?.registered?.data || [],
      );
      setTournamentWaitingDetail(
        responseData.data?.players?.waiting?.data || [],
      );

      let anonymousList =
        responseData.data.players &&
        responseData.data.players.registered.data.filter(function (item) {
          return item.displayoption === "anonymous";
        });

      setTournamentAnonymousList(
        anonymousList.length === 0 ? "" : anonymousList,
      );
      let description =
        responseData.data.players &&
        responseData.data.players.registered.data.filter(function (item) {
          return item.displayoption === "anonymous";
        });
      SetAnonymousPlayerLength(description.length);
    } catch (error) {
      // loading(false);
      // Handle API errors
    }
    // handleShow()
  };
  const tournamentRegistration = async (id) => {
    var postData = { id: id };
    let responseData = await TournamentService.registration(postData).json();
    if (responseData.status === true) props.parentCallback();
  };
  const tournamentCancelRegistration = async (id) => {
    var postData = { id: id };
    let responseData = await TournamentService.cancelRegistration(
      postData,
    ).json();
    if (responseData.status === true) props.parentCallback();
  };
  const tournamentCancelRegistrationFromWaiting = async (id) => {
    var postData = { id: id };
    let responseData = await TournamentService.cancelRegistrationFromWaiting(
      postData,
    ).json();
    if (responseData.status === true) props.parentCallback();
  };

  const getPremiumTournament = async () => {
    const responseData =
      await TournamentService.gettodaypremiumtournament().json();
    const ids = responseData.data.map((element) => {
      return element.tournament_id;
    });
    setPremiumIds(ids);
  };

  const getSetting = async () => {
    try {
      let responseData = await SettingService.index().json();

      setIsBreakTitle(responseData.data.break_text);
    } catch (error) {
      console.log(error);
    }
  };
  const getbanner = async () => {
    try {
      let topbanner = await BannerService.todayBanner(2).json();

      setTopBanner(topbanner.data);
      setTopBannerSetting(topbanner.settings);
      if (topbanner.settings) {
        var rolling_time = topbanner.settings[0].rolling_time_bottom * 1000;
      } else {
        var rolling_time = 1000;
      }
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % topbanner.data.length,
        );
      }, rolling_time);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
    }
  };

  const getCentralBannerSetting = async () => {
    try {
      const responseData = await SettingService.siteSettings().json();
      const data = responseData.data[0];

      setBottomBannerDesktopInterval(data.bottom_desktop_interval);
      setBottomBannerMobileInterval(data.bottom_mobile_interval);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPremiumTournament();
    getSetting();
    getbanner();
    getCentralBannerSetting();
    // const interval = setInterval(() => {
    //   if (props.bannerImage) {
    //     if (props.bannerImage.length > 0) {
    //       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % props.bannerImage.length);
    //     }
    //   }
    // }, 3000);
    // return () => clearInterval(interval);
  }, []);
  const handleannounce = (e, data) => {
    setannounceLateTime(data);
    setTournamentId(e);
    setShowannounce(true);
  };
  const handleannounceSubmit = async (event) => {
    event.preventDefault();

    try {
      var userData = {
        latetime: event.target.timing.value,
      };

      let responseData = await AnnouncementService.lateupdate(
        tournamentId,
        userData,
      ).json();

      if (responseData.status === true) {
        setShowannounce(false);
        setSaveMessage(responseData.message);
        setannounce(true);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const handleannouncedelete = async (e) => {
    try {
      let responseData = await AnnouncementService.lateremove(e).json();
      setShowannounce(false);
      setSaveMessage(responseData.message);
      setannounce(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const getBannerIndex = (index, bannerInterval) => {
    let bannerIndex = currentImageIndex + ((index + 1) / bannerInterval) - 1;
    bannerIndex = bannerIndex % topbanners.length;
    return bannerIndex;
  };

  return (
    <>
      <div
        className={`table-container d-none d-md-block mt-5 ${
          isActive ? "dark-theme" : "light-theme"
        }`}
      >
        <Table responsive>
          <thead>
          <tr>
            <th className="width-auto text-center" style={{ width: "140px" }}>
              {t("page.tournaments.tournamentstable.Date")}
            </th>
            <th className="width-auto text-nowrap">
              {t("page.tournaments.tournamentstable.Tournament Name")}
            </th>
            <th className="width-auto text-center text-nowrap">
              {t("page.tournaments.tournamentstable.Poker Room")}
            </th>
            <th className="width-auto text-center d-md-none d-lg-table-cell">
              {t("page.tournaments.tournamentstable.Canton")}
            </th>
            <th className="width-auto text-nowrap">
              {t("page.tournaments.tournamentstable.Type")}
            </th>
            <th className="width-auto text-nowrap">
              {t("page.tournaments.tournamentstable.Buy-in")}
            </th>
            <th className="width-auto text-nowrap">
              {t("page.tournaments.tournamentstable.Players")}
            </th>
            <th className="width-auto text-nowrap" colSpan={2}>
              {t("page.tournamentsdetails.Registration")}
            </th>
          </tr>
          </thead>

          <tbody>
          {props.data.map((element, index) => {
            return (
              <React.Fragment key={index}>
                <tr key={index}>
                  <td className="align-middle">
                    <p className="tournament-date text-nowrap">
                      {/*  */}
                      {t("currentdate", {
                        date: new Date(element.detail.startday),
                      })}{" "}
                      {moment(element.detail.startday).format(
                        "DD.MM.YYYY HH:mm",
                      )}
                    </p>

                    {element.detail.lastday ? (
                      <p className="tournament-date text-nowrap">
                        {moment(element.detail.startday).format(
                          "DD.MM.YYYY",
                        ) ==
                        moment(element.detail.lastday).format(
                          "DD.MM.YYYY",
                        ) ? (
                          <></>
                        ) : (
                          <>
                            <img
                              src={logo}
                              width="40"
                              height="50"
                              alt=""
                              style={{ maxHeight: "18px" }}
                            />
                            {moment(element.detail.lastday).format(
                              "DD.MM.YYYY",
                            )}
                          </>
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                    <p className="tournament-late-reg text-nowrap">
                      {element.detail.lateregformat === "time" ? (
                        <>
                          Late Reg:{" "}
                          {element.detail.lateregtime
                            ? element.detail.lateregtime.slice(0, 5)
                            : ""}
                          {/* Late Reg:  {moment(element.detail.lateregtime).format('hh:mm')} */}
                        </>
                      ) : element.detail.lateregformat === "round" ? (
                        <> Late Reg: Round {element.detail.latereground}</>
                      ) : (
                        ""
                      )}
                    </p>
                  </td>
                  <td className={
                    props.bottombannersSetting.length > "0" &&
                    props.bottombannersSetting[0].is_premium_tournament == 1
                      ? premiumIds.includes(element.id)
                        ? "premium-item align-middle"
                        : "align-middle"
                      : "align-middle"
                  }>
                    <Link to={`/tournaments/${element.room.slug}/${element.slug}`}>
                      <b>{element.title}</b>
                    </Link>
                  </td>
                  <td className="align-middle">
                    <Link
                      to={`/room/${element.room.slug}`}
                      className="align-middle text-truncate w-100 room-logo"
                    >
                      <Image
                        src={
                          element.room.detail.logo
                            ? imageUrl + element.room.detail.logo
                            : "https://api.checkraise.ch/assets/images/ap-3.png"
                        }
                        fluid
                      />
                    </Link>
                  </td>
                  <td className="text-center align-middle d-md-none d-lg-table-cell">
                      <span>
                        {element.room ? element.room.detail.canton : ""}
                      </span>
                  </td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-center definition-of-games-flex">
                      {element.detail.maxreentries !== 0 ? (
                        <span className="re-entry defination-games-info-span">
                            R
                          </span>
                      ) : (
                        ""
                      )}
                      {element.detail.bounty !== 0 ? (
                        <>
                            <span className="bounty  defination-games-info-span">
                              B
                            </span>
                        </>
                      ) : (
                        ""
                      )}
                      {element.detail.ischampionship !== 0 ? (
                        <>
                          <span className=" championship-bagde me-2 v-middle"></span>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    {element.detail.buyin}
                    {element.detail.bounty !== 0
                      ? "+" + element.detail.bounty
                      : ""}
                    {element.detail.rake !== 0
                      ? "+" + element.detail.rake
                      : ""}
                  </td>
                  <td className="align-middle" style={{ width: "90px" }}>
                      <span
                        className={getProgress(
                          element.players.registered +
                          element.detail.reservedplayers,
                          element.detail.maxplayers,
                        )}
                      >
                        <span
                          className="progress-inner d-inline-block"
                          style={{
                            width: getProgressWidth(
                              element.players.registered +
                              element.detail.reservedplayers,
                              element.detail.maxplayers,
                            ),
                          }}
                        >
                          <span className="text-center w-100 players-position">
                            <span className="players-current">
                              {element.players.registered +
                                element.detail.reservedplayers}{" "}
                            </span>
                            /
                            <span className="players-total">
                              {" "}
                              {element.detail.maxplayers}
                            </span>
                          </span>
                        </span>
                      </span>
                    <span style={{ fontSize: 10 }}>
                        {" "}
                      {element.players && element.players.waiting !== 0
                        ? "Waiting list: " + element.players.waiting
                        : ""}
                      </span>
                  </td>

                  <td className="align-middle">
                    <Link
                      to="#"
                      // onClick={handleShow}
                      onClick={(e) =>
                        handleTableApi(element.id, element.slug, element.room.slug)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-people-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                      </svg>
                    </Link>
                  </td>

                  {localStorage.getItem("usertype") === "Player" ? (
                    <td className="align-middle">
                      {element.isuser || element.iswaiting ? (
                        <>
                          {element.players &&
                          element.players.waiting !== 0 ? (
                            <>
                              <p
                                className="btn btn-sm btn-cancel-register-tournament mb-0 me-1 mb-md-1 mb-lg-0"
                                onClick={(e) =>
                                  tournamentCancelRegistrationFromWaiting(
                                    element.id,
                                  )
                                }
                              >
                                Cancel Registration <br/>
                                <span className="player-waiting-text">
                                    Waiting list (pos {element.players.waiting})
                                  </span>
                              </p>
                            </>
                          ) : (
                            <p
                              className="btn btn-sm btn-cancel-register-tournament mb-0"
                              onClick={(e) =>
                                tournamentCancelRegistration(element.id)
                              }
                            >
                              Cancel Registration
                            </p>
                          )}

                          {/* {element.players && element.players.waiting !== 0 ? '' : */}
                          <>
                            {element.is_late_arrival == 1 ? (
                              element.late === "" ? (
                                <Button
                                  className="btn btn-sm btn-primary btn-register-tournament btn-announce d-block mt-1 m-auto"
                                  onClick={() => handleannounce(element.id)}
                                >
                                  Announce my late reg
                                </Button>
                              ) : (
                                <>
                                  <p>Late: {element.late}</p>
                                  <Link
                                    className="action-link blue-link mb-1"
                                    onClick={() =>
                                      handleannounce(element.id, element.late)
                                    }
                                  >
                                    Edit{" "}
                                  </Link>
                                  <Link
                                    className="action-link red-link mb-1"
                                    onClick={() =>
                                      handleannouncedelete(
                                        element.detail &&
                                        element.detail.tournament_id,
                                      )
                                    }
                                  >
                                    Delete{" "}
                                  </Link>
                                </>
                              )
                            ) : (
                              ""
                            )}
                          </>
                          {/* } */}
                        </>
                      ) : element.players.registered +
                      element.detail.reservedplayers ===
                      element.detail.maxplayers ? (
                        <Button
                          className="btn btn-sm btn-primary btn-register-tournament"
                          onClick={(e) => tournamentRegistration(element.id)}
                        >
                          Waiting list ({element.players.waiting})
                        </Button>
                      ) : (
                        <Button
                          className="btn btn-sm btn-primary btn-register-tournament"
                          onClick={(e) => tournamentRegistration(element.id)}
                        >
                          Register
                        </Button>
                      )}
                    </td>
                  ) : localStorage.getItem("usertype") === "Room Manager" ? (
                    element.room.user_id === props.id ? (
                      <td className="align-middle">
                        <Link
                          className="btn btn-sm btn-primary btn-register-tournament"
                          to={`/manager/checkin-tournament/${element.id}`}
                        >
                          CHECK-IN
                        </Link>
                      </td>
                    ) : (
                      <td></td>
                    )
                  ) : localStorage.getItem("usertype") === "Director" ? (
                    <td className="align-middle">
                      <Link
                        className="btn btn-sm btn-primary btn-register-tournament"
                        to={`/director/checkin/${element.id}`}
                      >
                        CHECK-IN
                      </Link>
                    </td>
                  ) : (
                    <td className="align-middle">
                      <Button
                        className="btn btn-sm btn-primary btn-register-tournament"
                        onClick={() => navigate("/login")}
                      >
                        Login to register
                      </Button>
                    </td>
                  )}
                </tr>
                {(index + 1) % bottomBannerDesktopInterval === 0
                  ? (
                    <tr>
                      {topbannersSettings.length > 0
                      && topbannersSettings[0].adv_bottom_banner == 1
                      && topbanners.length > 0 ? (
                        <td colSpan={9}>
                          <div className="advertising-banner text-center m-auto">
                            <a
                              href={`https://${topbanners[getBannerIndex(index, bottomBannerDesktopInterval)]?.url}`}
                              target="_blank"
                            >
                              <img
                                className="image divImg"
                                src={zerogif}
                                alt="Changing Image"
                                width="500"
                                height="50"
                                style={{
                                  backgroundImage:
                                    "url(" +
                                    process.env
                                      .REACT_APP_BANNER_IMAGE_URL +
                                    "" +
                                    topbanners[getBannerIndex(index, bottomBannerDesktopInterval)]?.image +
                                    ")",
                                }}
                              />
                            </a>
                          </div>
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  ) : (
                    <></>
                  )}
              </React.Fragment>
            );
          })}
          {props.data.length < 1 || props.data.length < bottomBannerDesktopInterval
            ? <tr>
              {topbannersSettings.length > 0
              && topbannersSettings[0].adv_bottom_banner == 1
              && topbanners.length > 0 ? (
                <td colSpan={9}>
                  <div className="advertising-banner text-center m-auto">
                    <a
                      href={`https://${topbanners[currentImageIndex].url}`}
                      target="_blank"
                    >
                      <img
                        className="image divImg"
                        src={zerogif}
                        alt="Changing Image"
                        width="500"
                        height="50"
                        style={{
                          backgroundImage:
                            "url(" +
                            process.env
                              .REACT_APP_BANNER_IMAGE_URL +
                            "" +
                            topbanners[currentImageIndex].image +
                            ")",
                        }}
                      />
                    </a>
                  </div>
                </td>
              ) : (
                <></>
              )}
            </tr>
            : ''}
          </tbody>
        </Table>
      </div>

      {/* mobile view */}

      <div
        className={`table-tournaments-mobile d-block d-md-none ${
          isActive ? "dark-theme" : "light-theme"
        }`}
      >
        {props.data.map((element, index) => {
          return (
            <React.Fragment key={index}>
              <div
                className={`tournament-row ${
                  props.bottombannersSetting.length > "0" &&
                  props.bottombannersSetting[0].is_premium_tournament == 1
                    ? premiumIds.includes(element.id)
                      ? "preminum-tournament-row"
                      : ""
                    : ""
                }`}
              >
                <div className="d-flex justify-content-between">
                  <div className="tm-title d-flex justify-content-start text-truncate">
                    <Link
                      to={`/tournaments/${element.room.slug}/${element.slug}`}
                      className="text-truncate min-w-1"
                    >
                      {element.title}
                    </Link>
                  </div>
                  <div className="tm-players d-flex align-items-center flex-wrap justify-content-end">
                    <span
                      className={getProgress(
                        element.players.registered +
                        element.detail.reservedplayers,
                        element.detail.maxplayers,
                      )}
                    >
                      <span
                        className="progress-inner d-inline-block"
                        style={{
                          width: getProgressWidth(
                            element.players.registered +
                            element.detail.reservedplayers,
                            element.detail.maxplayers,
                          ),
                        }}
                      >
                        <span className="text-center w-100 players-position">
                          <span className="players-current">
                            {element.players.registered +
                              element.detail.reservedplayers}{" "}
                          </span>
                          /
                          <span className="players-total">
                            {" "}
                            {element.detail.maxplayers}
                          </span>
                        </span>
                      </span>
                    </span>
                    <span
                      className="w-100 text-end"
                      style={{ fontSize: 10, marginTop: 2, marginBottom: -12 }}
                    >
                      {" "}
                      {element.players && element.players.waiting !== 0
                        ? "(Waiting list: " + element.players.waiting + ")"
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="tm-middle">
                    <div className="tm-date">
                      {t("currentdate", {
                        date: new Date(element.detail.startday),
                      })}
                      {moment(element.detail.startday).format(" DD.MM.YYYY")}
                    </div>
                    {element.detail.lastday ? (
                      <p className="tm-date text-nowrap mb-0">
                        {moment(element.detail.startday).format("DD.MM.YYYY") ==
                        moment(element.detail.lastday).format("DD.MM.YYYY") ? (
                          <></>
                        ) : (
                          <>
                            <img
                              src={logo}
                              width="20"
                              height="20"
                              alt=""
                              style={{ maxHeight: "18px" }}
                            />
                            {moment(element.detail.lastday).format(
                              "DD.MM.YYYY",
                            )}
                          </>
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                    <div className="tm-time">
                      {" "}
                      {moment(element.detail.startday).format("HH:mm")}
                    </div>
                    <p className="tm-late-reg text-nowrap">
                      {" "}
                      {element.detail.lateregformat === "time" ? (
                        // .slice(0, 5)
                        <>
                          Late Reg:{" "}
                          {element.detail.lateregtime
                            ? element.detail.lateregtime.slice(0, 5)
                            : ""}
                          {/* Late Reg:  {moment(element.detail.lateregtime).format('hh:mm')} */}
                        </>
                      ) : element.detail.lateregformat === "round" ? (
                        <> Late Reg: Round {element.detail.latereground}</>
                      ) : (
                        ""
                      )}
                    </p>
                    {/* <div className="d-flex justify-content-between flex-column">
                      <div className="tm-action">
                        <div>
                          <span className="d-inline-block text-end">
                            Registrierung für Manager nicht erlaubt
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  {localStorage.getItem("usertype") === "Player" ? (
                    <div className="d-flex justify-content-between flex-column">
                      {element.isuser || element.iswaiting ? (
                        <>
                          <p
                            className="btn btn-sm btn-cancel-register-tournament"
                            onClick={(e) =>
                              tournamentCancelRegistration(element.id)
                            }
                          >
                            Cancel Registration
                            {element.players &&
                            element.players.waiting !== 0 ? (
                              <span className="player-waiting-text d-block">
                                Waiting list (pos {element.players.waiting})
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                          {element.is_late_arrival == 1 ? (
                            element.late === "" ? (
                              <Button
                                className="btn btn-sm btn-primary btn-register-tournament btn-announce"
                                onClick={() => handleannounce(element.id)}
                              >
                                Announce my late reg
                              </Button>
                            ) : (
                              <>
                                <p>Late: {element.late}</p>
                                <Link
                                  className="action-link blue-link mb-1"
                                  onClick={() =>
                                    handleannounce(element.id, element.late)
                                  }
                                >
                                  Edit{" "}
                                </Link>
                                <Link
                                  className="action-link red-link mb-1"
                                  onClick={() =>
                                    handleannouncedelete(
                                      element.detail &&
                                      element.detail.tournament_id,
                                    )
                                  }
                                >
                                  Delete{" "}
                                </Link>
                              </>
                            )
                          ) : (
                            ""
                          )}
                        </>
                      ) : element.players.registered +
                      element.detail.reservedplayers ===
                      element.detail.maxplayers ? (
                        <Button
                          className="btn btn-sm btn-primary btn-register-tournament"
                          onClick={(e) => tournamentRegistration(element.id)}
                        >
                          Waiting list ({element.players.waiting})
                        </Button>
                      ) : (
                        <Button
                          className="btn btn-sm btn-primary btn-register-tournament"
                          onClick={(e) => tournamentRegistration(element.id)}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  ) : localStorage.getItem("usertype") === "Room Manager" ? (
                    element.room.user_id === props.id ? (
                      <div className="d-flex justify-content-between flex-column">
                        <Link
                          className="btn btn-sm btn-primary btn-register-tournament"
                          to={`/manager/checkin-tournament/${element.id}`}
                        >
                          CHECK-IN
                        </Link>
                      </div>
                    ) : (
                      <div className="tm-action"></div>
                    )
                  ) : localStorage.getItem("usertype") === "Admin" ? (
                    <div className="d-flex justify-content-between flex-column">
                      <Button className="btn btn-sm btn-primary btn-register-tournament">
                        CHECK-IN
                      </Button>
                    </div>
                  ) : (
                    <div className="tm-action">
                      <Button
                        className="btn btn-sm btn-primary btn-register-tournament"
                        onClick={() => navigate("/login")}
                      >
                        Login to register
                      </Button>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <div className="tm-room-image d-flex justify-content-start ">
                    <Link to={`/room/${element.room.slug}`}>
                      <Image
                        src={
                          element.room.detail.logo
                            ? imageUrl + element.room.detail.logo
                            : "../../assets/images/ap-3.png"
                        }
                        fluid
                      />
                    </Link>
                  </div>
                  <span className="tm-type type-column d-block text-end">
                    <span className="tm-type d-block">
                      Buy-in: {element.detail.buyin}
                      {element.detail.rake !== 0
                        ? "+" + element.detail.rake
                        : ""}
                      {element.detail.bounty !== 0
                        ? "+" + element.detail.bounty
                        : ""}
                    </span>
                    {element.detail.maxreentries !== 0 ? (
                      <span className="re-entry defination-games-info-span">
                        R
                      </span>
                    ) : (
                      ""
                    )}
                    {element.detail.bounty !== 0 ? (
                      <>
                        <span className="bounty  defination-games-info-span">
                          B
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                    {element.detail.ischampionship !== 0 ? (
                      <>
                        <span className=" championship-bagde me-2 v-middle"></span>
                      </>
                    ) : (
                      ""
                    )}
                  </span>
                </div>

                {/* <div className="tm-details">
                </div> */}
                <span
                  className="down-arrow"
                  onClick={(e) => handleTableApi(element.id, element.slug, element.room.slug)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#000"
                    className="bi bi-people-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  </svg>
                </span>
              </div>

              {(index + 1) % bottomBannerMobileInterval === 0 ? (
                <>
                  {topbannersSettings.length > 0
                  && topbannersSettings[0].adv_bottom_banner == 1
                  && topbanners.length > 0
                    ? (
                      <div className="advertising-banner">
                        <a
                          href={topbanners[getBannerIndex(index, bottomBannerMobileInterval)]?.url}
                          target="_blank"
                        >
                          <img
                            className="image divImg"
                            src={zerogif}
                            width="500"
                            height="50"
                            style={{
                              backgroundImage:
                                "url(" +
                                process.env.REACT_APP_BANNER_IMAGE_URL +
                                "" +
                                topbanners[getBannerIndex(index, bottomBannerMobileInterval)]?.image +
                                ")",
                            }}
                            alt="Changing Image"
                          />
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                </>
              ) : (
                <></>
              )}
            </React.Fragment>
          );
        })}
        {props.data.length < 1 || props.data.length < bottomBannerMobileInterval
          ? <>
            {topbannersSettings.length > 0
            && topbannersSettings[0].adv_bottom_banner == 1
            && topbanners.length > 0
              ? (
                <div className="advertising-banner">
                  <a
                    href={topbanners[currentImageIndex].url}
                    target="_blank"
                  >
                    <img
                      className="image divImg"
                      src={zerogif}
                      width="500"
                      height="50"
                      style={{
                        backgroundImage:
                          "url(" +
                          process.env.REACT_APP_BANNER_IMAGE_URL +
                          "" +
                          topbanners[currentImageIndex].image +
                          ")",
                      }}
                      alt="Changing Image"
                    />
                  </a>
                </div>
              ) : (
                <></>
              )}
          </>
          : ''}

        {/* <div className="advertising-banner-mobile">
          <a href={props.url} target="_blank">
            <img src={props.bannerImage} width="500" height="50" />
          </a>
        </div> */}
      </div>

      <div className="d-flex align-items-center tournaments-top justify-content-md-end">
        <Col md={7}>
          <div className="defination-of-games">
            <div className="defination-of-games-info">
              <div className="defination-games-info">
                <ul className="p-0 list-unstyled d-flex justify-content-end">
                  <li>
                    <span className="re-entry">R</span>Re-entry
                  </li>
                  <li>
                    <span className="bounty">B</span>Bounty
                  </li>
                  <li>
                    <span className="championship">Championship</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </div>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="tournament-description-wrap">
            <Row className="flex-column flex-md-row">
              <Col md={12} lg={5}>
                <div className="players-Template-wrap mt-0">
                  <h3>
                    {t(
                      "page.tournaments.tournamentstable.Playersmodal.Players",
                    )}
                  </h3>
                  <div className="d-flex structure-top-wrap align-items-center flex-wrap justify-content-between">
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          "page.tournaments.tournamentstable.Playersmodal.Players",
                        )}
                        :{" "}
                      </span>
                      <span className="structure-block-val d-block">
                        {tournamentDetails.players
                          ? tournamentDetails.players.registered.total +
                          tournamentDetails.reservedplayers
                          : ""}{" "}
                        /
                        {tournamentDetails.maxplayers
                          ? tournamentDetails.maxplayers
                          : ""}
                      </span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          "page.tournaments.tournamentstable.Playersmodal.Waiting lists",
                        )}
                      </span>
                      <span className="structure-block-val d-block">
                        {tournamentDetails.players
                          ? tournamentDetails.players.waiting.total
                          : ""}
                      </span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          "page.tournaments.tournamentstable.Playersmodal.Anonymous Players",
                        )}
                      </span>
                      <span className="structure-block-val d-block">
                        {anonymousPlayerLength}
                      </span>
                    </span>
                    <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                      <span className="structure-block-label d-block">
                        {t(
                          "page.tournaments.tournamentstable.Playersmodal.Reserved places",
                        )}
                      </span>
                      <span className="structure-block-val d-block">
                        {tournamentDetails.reservedplayers
                          ? tournamentDetails.reservedplayers
                          : 0}
                      </span>
                    </span>
                  </div>

                  {/* <Scrollbars style={{ height: 515 }}> */}
                  <PlayerList
                    data={tournamentPlayerDetails}
                    roomManagerId={tournamentDetails?.room_manager_id}
                  />
                  {/* </Scrollbars> */}

                  {/* <Scrollbars style={{ height: 515 }}>
                    <AnonymousList data={tournamentAnonymousList} />
                  </Scrollbars> */}

                  {tournamentWaitingDetail.data &&
                  tournamentWaitingDetail.data.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      {tournamentWaitingDetail.length != 0 ? (
                        <h3 className="text-center mt-5">Waiting list</h3>
                      ) : (
                        ""
                      )}
                      {/* <Scrollbars style={{ height: 515 }}> */}
                      <WaitingList
                        data={tournamentWaitingDetail}
                        roomManagerId={tournamentDetails?.room_manager_id}
                      />
                      {/* </Scrollbars> */}
                    </>
                  )}
                </div>
              </Col>
              <Col md={12} lg={7} className="mt-5 mt-lg-0">
                <TournamentsStructure
                  structure={tournamentStructureDetails}
                  data={tournamentDetails}
                  title={isBreakTitle}
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-center mt-3">
                <Link
                  onClick={handleCloseRedirect}
                  to={`/tournaments/${tournamentRoomSlug}/${tournamentSlug}`}
                  className="btn btn-primary load-more-btn"
                >
                  <b>
                    {t(
                      "page.tournaments.tournamentstable.Playersmodal.More infos",
                    )}
                  </b>
                </Link>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="mb-50 d-block d-md-none text-end">
          <Link onClick={handleClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9692 0L20 1.03084L1.03076 20L0 18.9699L18.9692 0Z"
                fill="#F7F5F5"
              ></path>
              <path
                d="M1.03076 0L20 18.9685L18.9692 20L0 1.03153L1.03076 0Z"
                fill="#F7F5F5"
              ></path>
            </svg>
          </Link>
        </Modal.Footer>
      </Modal>
      <Modal show={showannounce} onHide={handleannounceclose}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleannounceSubmit}>
            <Form.Group className="form-group" controlId="">
              <p className="description mb-10">
                Announcement Time <span className="required">*</span>
              </p>

              <Form.Control
                type="time"
                className=""
                name="timing"
                defaultValue={announceLateTime}
              />
              <p className="error">{Error}</p>
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Save
              </Button>

              <Button
                variant="secondary"
                type="reset"
                onClick={() => setShowannounce(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={announce}>
        <>
          <Modal.Header>
            <Modal.Title>Saved</Modal.Title>
          </Modal.Header>

          <Modal.Body>{saveMessage}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                window.location.reload(false);
                setannounce(false);
              }}
            >
              Okay
            </Button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default TournamentsTable;
