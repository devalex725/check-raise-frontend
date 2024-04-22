import React, { useEffect, useState } from "react";

import moment from "moment";
import { Col, Image, Row, Button, Modal, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import AnnouncementService from "../../api/services/AnnouncementService";
import TournamentService from "../../api/services/TournamentService";
import LogoAnimationLoader from "../../components/Loading/LogoAnimationLoader";
import PlayerList from "../../components/PlayerList/PlayerList";

import WaitingList from "../../components/WaitingList/WaitingList";
import BannerService from "../../api/services/BannerService";
import TournamentsStructure from "../../components/TournamentsStructure/TournamentsStructure";
import DirectorService from "../../api/services/DirectorService";
import TournamentsTable from "../../components/TournamentsTable/TournamentsTable";
import DuplicateModal from "../Manager/AllTournaments/components/DuplicateModal";
import { formatPhoneNumber } from "../../utils";
import ExportModal from "../Manager/AllTournaments/components/ExportModal";
import SendEmailModal from "../../components/Manager/SendEmailModal";

const imageUrl = process.env.REACT_APP_ROOM_IMAGE_URL;

const TournamentsDetails = () => {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [bannerContent, setBannerContent] = useState("");
  const [frenchContent, setFrenchContent] = useState("");
  const [dutchContent, setDutchContent] = useState("");
  const [tournamentDetail, setTournamentDetail] = useState({});
  const [tournamentAnonymousList, setTournamentAnonymousList] = useState([]);
  const [tournamentPlayerDetail, setTournamentPlayerDetail] = useState([]);
  const [tournamentWaitingDetail, setTournamentWaitingDetail] = useState([]);
  const [anonymousPlayerLength, SetAnonymousPlayerLength] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [tournamentDescription, setTournamentDescription] = useState({
    en: "",
    fr: "",
    de: "",
  });

  const [tournamentStructureDetail, setTournamentStructureDetail] = useState(
    [],
  );
  const [tournamentRoomDetail, setTournamentRoomDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [roomId, setRoomId] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [Error, setError] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [deleteId, setDeleteId] = useState({});
  const [modalMessage, SetModalMessage] = useState("");
  const [emailData, setEmailData] = useState({});
  const [sendEmailModalShow, setSendEmailModalShow] = useState(false);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const handleClose = () => setShowAnnounce(false);
  const [bottomBanners, setBottomBanner] = useState([]);
  const [bottomBannersSetting, setBottomBannerSetting] = useState([]);
  const [announce, setAnnounce] = useState(false);
  const [tournamentId, setTournamentId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [duplicateModalShow, setDuplicateModalShow] = useState(false);
  const [exportModalShow, setExportModalShow] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const tournamentRegistration = async (id) => {
    // var postData={id:id}
    // let responseData = await TournamentService.registration(postData).json();
    //if(responseData.status===true)
    //props.parentCallback();
  };
  const tournamentCancelRegistration = async (id) => {
    // var postData={id:id}
    // let responseData = await TournamentService.cancelRegistration(postData).json();
    //if(responseData.status===true)
    //props.parentCallback();
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

  const handleShowTournament = async (id) => {
    try {
      let responseData = "";
      if (localStorage.getItem("usertype") === "Player") {
        responseData = await TournamentService.showByAuth(id).json();
      } else {
        responseData = await TournamentService.show(id).json();
      }

      setTournamentStructureDetail(responseData.data.structure); // structuretable display

      setTournamentDetail(responseData.data); // all data display

      const finishTime = moment().hour(8).minute(0);

      if (
        finishTime.isSameOrAfter(moment(responseData.data?.detail?.startday))
      ) {
        setIsFinished(true);
      }

      setTournamentRoomDetail(responseData.data.room.detail);
      getTournaments(
        responseData.data.room.detail.room_id,
        responseData.data.id,
      );
      //for playerlist
      /*let PlayerList = responseData.data.players
                &&
                responseData.data.players.registered.data.filter(function (item) {

                    return item.displayoption === 'anonymous' ? '' : item;
                });*/
      setTournamentPlayerDetail(
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
      SetAnonymousPlayerLength(anonymousList.length);

      roomFilterApi(responseData.data.room.id);

      setTournamentDescription((prev) => {
        (responseData.data.description || []).map((desc) => {
          prev[desc.language] = desc.description;
        });

        return { ...prev };
      });

      if (
        (responseData.data.detail.activelanguages || []).includes(
          i18n.resolvedLanguage,
        )
      ) {
        setSelectedLanguage(i18n.resolvedLanguage);
      }

      if (responseData.data.detail.activelanguages?.length < 2) {
        setSelectedLanguage(responseData.data.detail.activelanguages[0]);
      }

      setIsLoading(false);
    } catch (error) {
      // Handle API errors
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    handleShowTournament(params.slug);
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"));
      setCurrentId(obj.id);
    }

    getTodayBanner();
  }, [params.slug]);

  useEffect(() => {
    if (
      !(tournamentDetail?.detail?.activelanguages || []).includes(
        i18n.resolvedLanguage,
      )
    ) {
      return;
    }
    setSelectedLanguage(i18n.resolvedLanguage);
  }, [i18n.resolvedLanguage]);

  const getTournaments = async (roomId, currentItemId) => {
    try {
      let responseData = null;

      if (!roomId) {
        roomId = tournamentRoomDetail.room_id;
      }
      if (localStorage.getItem("usertype") === "Player") {
        responseData = await TournamentService.indexByAuth([roomId]).json();
      } else {
        responseData = await TournamentService.index([roomId]).json();
      }

      if (!currentItemId) {
        currentItemId = tournamentDetail.id;
      }

      setTournaments(
        (responseData.data || []).filter((item) => item.id !== currentItemId),
      );
    } catch (error) {
      setIsLoading(true);
    }
  };
  const getTodayBanner = async () => {
    try {
      let bottomBannerResponse = await BannerService.todayBanner(2).json();
      setBottomBanner(bottomBannerResponse.data);
      setBottomBannerSetting(bottomBannerResponse.settings);

      let data = bottomBannerResponse.settings.filter(function (item) {
        return item.is_important_message_banner === 1;
      });
      if (data.length == 0) {
        setBannerContent("");
      } else {
        setBannerContent(data[0].en_msg_banner);
        setFrenchContent(data[0].fr_msg_banner);
        setDutchContent(data[0].db_msg_banner);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const roomFilterApi = async (id) => {
    try {
      let responseData = await TournamentService.index([id]).json();
      setRoomId(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const deleteTournament = async (tournamentId, name) => {
    setDeleteId({ tournamentId, name });
    setDeleteModal(true);
  };
  const handleDeleteUser = async () => {
    try {
      let responseData =
        deleteId.name === "director"
          ? await DirectorService.destroyDirector(deleteId.tournamentId).json()
          : await TournamentService.destroy(deleteId.tournamentId).json();
      if (responseData.status === true) setDeleteModal(false);
      setDeleteSuccess(true);
      SetModalMessage(responseData.message);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const updateTournamentStatus = async (id, status) => {
    const postData = {
      id,
      status,
    };

    try {
      const responseData = await TournamentService.updateTournamentStatus(
        postData,
      ).json();
      if (responseData.status === true) {
        handleShowTournament(params.slug);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleOpenSendEmailModal = (name) => {
    setEmailData({
      name,
      tournamentId: tournamentDetail.id,
      roomTitle: tournamentDetail.room.title
    });
    setSendEmailModalShow(true);
  };
  const updateArchiveTournamentStatus = async (tournamentId) => {
    try {
      await DirectorService.archivetournament(tournamentId).json();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleShowExportModal = async () => {
    setExportModalShow(true);
    // try {
    //   let responseData =
    //     name === "director"
    //       ? await DirectorService.exportcsv(e).json()
    //       : await TournamentService.exportcsv(e).json();

    //   const link = document.createElement("a");
    //   link.download = "Example-PDF-File";

    //   link.href = `https://api.checkraise.ch/${responseData.file}`;

    //   link.click();
    // } catch (error) {
    //   if (error.name === "HTTPError") {
    //     const errorJson = await error.response.json();

    //     setError(errorJson.message);
    //   }
    // }
  };
  const handleAnnounce = (e) => {
    setTournamentId(e);
    setShowAnnounce(true);
  };
  const handleAnnounceSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        latetime: event.target.timing.value,
      };

      let responseData = await AnnouncementService.lateupdate(
        tournamentId,
        userData,
      ).json();
      if (responseData.status === true) {
        setShowAnnounce(false);
        setSaveMessage(responseData.message);
        setAnnounce(true);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const handleAnnounceDelete = async () => {
    try {
      const responseData = await AnnouncementService.lateremove(
        tournamentId,
      ).json();

      setShowAnnounce(false);
      setSaveMessage(responseData.message);
      setAnnounce(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  return (
    <>
      <main>
        <div className="wrapper">
          <div className="text-center d-block d-md-none tournaments-info-room-logo">
            <Link
              to={`/room/${
                tournamentDetail.room ? tournamentDetail.room.slug : ""
              }`}
            >
              <Image
                src={
                  tournamentRoomDetail.logo
                    ? imageUrl + tournamentRoomDetail.logo
                    : ""
                }
                fluid
              />
            </Link>
          </div>
          <div className="tournaments-info-title">
            <h1 className="text-center d-block d-md-block">
              {tournamentDetail.title ? tournamentDetail.title : ""}
            </h1>
          </div>
          <div className="tournaments-info">
            <div className="tournaments-info-room-logo d-none d-md-block text-end">
              <Link
                to={`/room/${
                  tournamentDetail.room ? tournamentDetail.room.slug : ""
                }`}
              >
                <Image
                  src={
                    tournamentRoomDetail.logo
                      ? imageUrl + tournamentRoomDetail.logo
                      : ""
                  }
                  fluid
                />
              </Link>
            </div>
            <Row className="info-boxes-wrapper">
              <Col md={6} lg={3}>
                <div className="info-box info-box-first">
                  <span className="d-block mb-18">
                    {t("page.tournamentsdetails.Players")}: &nbsp;
                    <span
                      className={getProgress(
                        tournamentDetail.players
                          ? tournamentDetail.players.registered.total +
                          tournamentDetail.detail.reservedplayers
                          : 0,
                        tournamentDetail.detail
                          ? tournamentDetail.detail.maxplayers
                          : 0,
                      )}
                    >
                      <span
                        className="progress-inner d-inline-block"
                        style={{
                          width: getProgressWidth(
                            tournamentDetail.players
                              ? tournamentDetail.players.registered.total +
                              tournamentDetail.detail.reservedplayers
                              : 0,
                            tournamentDetail.detail
                              ? tournamentDetail.detail.maxplayers
                              : 0,
                          ),
                        }}
                      >
                        <span className="text-center w-100 players-position">
                          <span className="players-current">
                            {tournamentDetail.players
                              ? tournamentDetail.players.registered.total +
                              tournamentDetail.detail.reservedplayers
                              : 0}{" "}
                          </span>
                          /
                          <span className="players-total">
                            {tournamentDetail.detail
                              ? tournamentDetail.detail.maxplayers
                              : 0}
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    {t("page.tournamentsdetails.ReservedPlaces")}: &nbsp;
                    {tournamentDetail && tournamentDetail.reservedplayers}
                  </span>
                  <span className="d-block mb-18">
                    {t("page.tournamentsdetails.Wating list")}:
                    <span className="waiting-list-progress ms-1">
                      {tournamentDetail.players
                        ? tournamentDetail.players.waiting.total
                        : ""}
                    </span>
                  </span>
                  <span className="d-flex  mb-18 registration-info align-items-center">
                    <span>
                      {t("page.tournamentsdetails.Registration")}: &nbsp;
                    </span>
                    <div className="tm-action ">
                      <div>
                        {localStorage.getItem("usertype") === "Player" ? (
                          <span>
                            {tournamentDetail.isuser ||
                            tournamentDetail.iswaiting ? (
                              <p
                                className="btn btn-sm btn-cancel-register-tournament mb-0"
                                onClick={(e) =>
                                  tournamentCancelRegistration(
                                    tournamentDetail.id,
                                  )
                                }
                              >
                                Cancel Registration
                                <span
                                  className="player-waiting-text d-block"
                                  style={{ fontSize: 10 }}
                                >
                                  {tournamentDetail.players &&
                                  tournamentDetail.players.waiting !== 0
                                    ? "Waiting list (pos " +
                                    tournamentDetail.players.waiting.total +
                                    ")"
                                    : ""}
                                </span>
                              </p>
                            ) : (
                              (tournamentDetail.players
                                ? tournamentDetail.players.registered.total +
                                tournamentDetail.detail.reservedplayers
                                : 0) === tournamentDetail.detail
                                ? tournamentDetail.detail.maxplayers
                                : 0
                            ) ? (
                              <Button
                                className="btn btn-sm btn-primary btn-register-tournament"
                                onClick={(e) =>
                                  tournamentRegistration(tournamentDetail.id)
                                }
                              >
                                Waiting list ({tournamentDetail.players.waiting}
                                )
                              </Button>
                            ) : (
                              <Button
                                className="btn btn-sm btn-primary btn-register-tournament"
                                onClick={() => navigate("/registration")}
                              >
                                Register
                              </Button>
                            )}
                          </span>
                        ) : localStorage.getItem("usertype") ===
                        "Room Manager" ? (
                          tournamentDetail.room &&
                          tournamentDetail.room.user_id === currentId ? (
                            <span>
                              <Link
                                className="btn btn-sm btn-primary btn-register-tournament"
                                to={`/manager/checkin-tournament/${tournamentDetail.id}`}
                              >
                                CHECK-IN
                              </Link>
                            </span>
                          ) : (
                            <span></span>
                          )
                        ) : localStorage.getItem("usertype") === "Admin" ? (
                          <span>
                            <Button className="btn btn-sm btn-primary btn-register-tournament">
                              CHECK-IN
                            </Button>
                          </span>
                        ) : (
                          <span>
                            <Button
                              className="btn btn-sm btn-primary btn-register-tournament"
                              onClick={() => navigate("/login")}
                            >
                              Login to register
                            </Button>
                          </span>
                        )}
                      </div>
                    </div>
                  </span>
                  {tournamentDetail.isuser || tournamentDetail.iswaiting ? (
                    <span className="d-flex  mb-18 registration-info">
                      <span> Announce my late reg:</span>

                      <div className="tm-action">
                        <div>
                          <Link
                            onClick={() => handleAnnounce(tournamentDetail.id)}
                            className="btn btn-primary"
                          >
                            Announce
                          </Link>
                        </div>
                      </div>
                    </span>
                  ) : (
                    ""
                  )}

                  <span className="d-block share-buttons">
                    <span className="d-block">
                      {t("page.tournamentsdetails.Share this tournament via")}:
                    </span>
                    <Link
                      to="http://www.facebook.com/share.php?u=https://check-raise.ch/tournaments/friday-night-poker-7/"
                      title="Share on Facebook"
                      target="_blank"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 10.0601C0.000563232 12.4561 0.850471 14.7733 2.39696 16.5953C3.94345 18.4173 6.08511 19.6245 8.437 20V12.9679H5.9V10.0601H8.44V7.84651C8.38391 7.32842 8.44189 6.80427 8.60982 6.31127C8.77775 5.81827 9.0515 5.36852 9.41164 4.99396C9.77178 4.6194 10.2095 4.32923 10.6936 4.14404C11.1778 3.95886 11.6965 3.8832 12.213 3.92246C12.963 3.93453 13.713 4.00195 14.453 4.12369V6.59786H13.189C12.9742 6.56955 12.7558 6.59017 12.5499 6.65821C12.3441 6.72624 12.1561 6.83995 11.9998 6.99093C11.8435 7.14191 11.7229 7.3263 11.647 7.53047C11.571 7.73464 11.5416 7.95337 11.561 8.1705V10.0601H14.332L13.889 12.9689H11.561V20C13.4486 19.6998 15.2112 18.8618 16.6402 17.585C18.0691 16.3082 19.1045 14.6461 19.6238 12.7957C20.143 10.9452 20.1244 8.98372 19.5702 7.14354C19.0159 5.30335 17.9492 3.66149 16.4964 2.41235C15.0435 1.1632 13.2653 0.359089 11.3724 0.0952063C9.4794 -0.168676 7.55092 0.118724 5.81525 0.923381C4.07958 1.72804 2.60942 3.01625 1.5788 4.63551C0.548194 6.25476 0.00030337 8.13724 0 10.0601Z"
                          fill="#C5E6F1"
                        ></path>
                      </svg>
                    </Link>

                    <Link
                      to="https://twitter.com/intent/tweet?text=Friday%20Night%20Poker&amp;url=https://check-raise.ch/tournaments/friday-night-poker-7/?lang=en&amp;hashtags=checkraise,poker"
                      title="Twit tournament"
                      target="_blank"
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.3242 0C4.8019 0 0.324219 4.47768 0.324219 10C0.324219 15.5223 4.8019 20 10.3242 20C15.8465 20 20.3242 15.5223 20.3242 10C20.3242 4.47768 15.8465 0 10.3242 0ZM15.13 7.53795C15.1367 7.64286 15.1367 7.75223 15.1367 7.85938C15.1367 11.1362 12.6412 14.9107 8.08091 14.9107C6.67466 14.9107 5.37109 14.5022 4.27288 13.7991C4.47377 13.8214 4.66574 13.8304 4.87109 13.8304C6.03181 13.8304 7.09877 13.4375 7.94922 12.7723C6.85993 12.75 5.94475 12.0357 5.63225 11.0536C6.01395 11.1094 6.3577 11.1094 6.75056 11.0089C6.18968 10.895 5.68555 10.5904 5.32381 10.1468C4.96207 9.70331 4.76504 9.14823 4.76618 8.57589V8.54464C5.09431 8.72991 5.48047 8.84375 5.88449 8.85938C5.54485 8.63302 5.26631 8.32636 5.07357 7.96658C4.88084 7.60681 4.77985 7.20503 4.77958 6.79688C4.77958 6.33482 4.90011 5.91295 5.11663 5.54688C5.73918 6.31325 6.51603 6.94005 7.39668 7.38653C8.27734 7.83301 9.24209 8.08918 10.2282 8.13839C9.87779 6.45313 11.1367 5.08929 12.6501 5.08929C13.3644 5.08929 14.0073 5.38839 14.4604 5.87054C15.0206 5.76562 15.5564 5.5558 16.034 5.27455C15.8488 5.84821 15.4604 6.33259 14.9448 6.63839C15.4448 6.58482 15.9269 6.44643 16.3733 6.25223C16.0363 6.74777 15.6144 7.1875 15.13 7.53795Z"
                          fill="#C5E6F1"
                        ></path>
                      </svg>
                    </Link>

                    <Link
                      to="https://telegram.me/share/?url=https://check-raise.ch/tournaments/friday-night-poker-7/?lang=fr&amp;text=Friday%20Night%20Poker"
                      title="Share with Telegram"
                      target="_blank"
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.6484 10C20.6484 12.6522 19.5949 15.1957 17.7195 17.0711C15.8441 18.9464 13.3006 20 10.6484 20C7.99627 20 5.45273 18.9464 3.57737 17.0711C1.70201 15.1957 0.648438 12.6522 0.648438 10C0.648438 7.34784 1.70201 4.8043 3.57737 2.92893C5.45273 1.05357 7.99627 0 10.6484 0C13.3006 0 15.8441 1.05357 17.7195 2.92893C19.5949 4.8043 20.6484 7.34784 20.6484 10ZM11.0072 7.3825C10.0347 7.7875 8.08969 8.625 5.17469 9.895C4.70219 10.0825 4.45344 10.2675 4.43094 10.4475C4.39344 10.7512 4.77469 10.8713 5.29344 11.035L5.51219 11.1038C6.02219 11.27 6.70969 11.4637 7.06594 11.4713C7.39094 11.4788 7.75219 11.3463 8.15094 11.0713C10.8747 9.2325 12.2809 8.30375 12.3684 8.28375C12.4309 8.26875 12.5184 8.25125 12.5759 8.30375C12.6347 8.355 12.6284 8.45375 12.6222 8.48C12.5847 8.64125 11.0884 10.0312 10.3147 10.7512C10.0734 10.9762 9.90219 11.135 9.86719 11.1713C9.79012 11.25 9.71177 11.3275 9.63219 11.4038C9.15719 11.8612 8.80219 12.2038 9.65094 12.7638C10.0597 13.0338 10.3872 13.255 10.7134 13.4775C11.0684 13.72 11.4234 13.9613 11.8834 14.2638C11.9997 14.3387 12.1122 14.42 12.2209 14.4975C12.6347 14.7925 13.0084 15.0575 13.4672 15.015C13.7347 14.99 14.0109 14.74 14.1509 13.99C14.4822 12.2188 15.1334 8.3825 15.2834 6.80125C15.2926 6.6698 15.2871 6.53775 15.2672 6.4075C15.2554 6.3024 15.2046 6.20557 15.1247 6.13625C15.0109 6.05774 14.8754 6.01706 14.7372 6.02C14.3622 6.02625 13.7834 6.2275 11.0072 7.3825Z"
                          fill="#C5E6F1"
                        ></path>
                      </svg>
                    </Link>

                    <Link
                      to="https://wa.me/?text=https://check-raise.ch/tournaments/friday-night-poker-7/?lang=en"
                      title="Share with Whats App"
                      target="_blank"
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.4769 4.62488C16.4852 -0.000152887 10.377 -1.37516 5.64006 1.49986C1.02777 4.37488 -0.468107 10.6249 2.52365 15.25L2.77296 15.625L1.77571 19.375L5.5154 18.375L5.88937 18.625C7.50991 19.5 9.2551 20 11.0003 20C12.8701 20 14.74 19.5 16.3605 18.5C20.9728 15.5 22.344 9.37492 19.4769 4.62488ZM16.8591 14.25C16.3605 15 15.7372 15.5 14.8646 15.625C14.366 15.625 13.7427 15.875 11.2496 14.875C9.13044 13.875 7.38525 12.2499 6.13869 10.3749C5.39075 9.49992 5.01678 8.37491 4.89212 7.2499C4.89212 6.2499 5.26609 5.37489 5.88937 4.74988C6.13869 4.49988 6.388 4.37488 6.63731 4.37488H7.2606C7.50991 4.37488 7.75922 4.37488 7.88388 4.87488C8.13319 5.49989 8.75647 6.9999 8.75647 7.1249C8.88113 7.2499 8.88113 7.49991 8.75647 7.62491C8.88113 7.87491 8.75647 8.12491 8.63182 8.24991C8.50716 8.37491 8.3825 8.62491 8.25785 8.74991C8.00853 8.87492 7.88388 9.12492 8.00853 9.37492C8.50716 10.1249 9.13044 10.8749 9.75373 11.4999C10.5017 12.1249 11.2496 12.6249 12.1222 12.9999C12.3715 13.1249 12.6208 13.1249 12.7455 12.8749C12.8701 12.6249 13.4934 11.9999 13.7427 11.7499C13.992 11.4999 14.1167 11.4999 14.366 11.6249L16.3605 12.6249C16.6098 12.7499 16.8591 12.8749 16.9838 12.9999C17.1085 13.3749 17.1085 13.875 16.8591 14.25Z"
                          fill="#C5E6F1"
                        ></path>
                      </svg>
                    </Link>
                  </span>
                  {/* localStorage.getItem("usertype") ===
                          "Room Manager" ? (
                          tournamentdetail.room &&
                          tournamentdetail.room.user_id === currentId */}
                  {localStorage.getItem("usertype") === null ||
                  localStorage.getItem("usertype") === "Player" ||
                  !tournamentDetail.room ||
                  tournamentDetail.room.user_id !== currentId ? (
                    <></>
                  ) : (
                    <>
                      {localStorage.getItem("usertype") === "Director" ? (
                        <>
                          <Row>
                            <Col>
                              <div className="action-badge">
                                <Link
                                  className="badge badge-success mb-1"
                                  to={`/director/edit/${
                                    tournamentDetail.slug
                                      ? tournamentDetail.slug
                                      : ""
                                  }`}
                                >
                                  Edit
                                </Link>
                                <div
                                  className="btn-custom badge badge-danger mb-1"
                                  onClick={() => {
                                    deleteTournament(
                                      tournamentDetail.id,
                                      "director",
                                    );
                                  }}
                                >
                                  Delete
                                </div>
                                {isFinished ? (
                                  <Link className="btn-custom badge badge-secondary mb-1 hidden-ckr pe-none">
                                    Publish
                                  </Link>
                                ) : (
                                  <>
                                    {tournamentDetail.status === 0 ? (
                                      <Link
                                        className="btn-custom badge badge-secondary mb-1 hidden-ckr"
                                        onClick={() => {
                                          updateTournamentStatus(
                                            tournamentDetail.id,
                                            1,
                                            "director",
                                          );
                                        }}
                                      >
                                        Publish
                                      </Link>
                                    ) : (
                                      <Link
                                        className="btn-custom badge badge-secondary mb-1 hidden-ckr"
                                        onClick={() => {
                                          updateTournamentStatus(
                                            tournamentDetail.id,
                                            0,
                                            "director",
                                          );
                                        }}
                                      >
                                        Undo Publish
                                      </Link>
                                    )}
                                  </>
                                )}
                                <div
                                  className="btn-custom badge badge-primary mb-1"
                                  onClick={
                                    () => handleShowExportModal()
                                    // handleExport(
                                    //   tournamentDetail.id,
                                    //   "director"
                                    // )
                                  }
                                >
                                  Export
                                </div>
                                <div className="mb-1">
                                  <Link
                                    to="#"
                                    className="btn-custom badge badge-pink"
                                    onClick={() =>
                                      handleOpenSendEmailModal("director",)
                                    }
                                  >
                                    Send e-mail
                                  </Link>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          <Row>
                            <Col>
                              <div className="action-badge">
                                <Link
                                  className="action-link blue-link mb-1"
                                  onClick={() => {
                                    setDuplicateModalShow(true);
                                  }}
                                >
                                  Duplicate
                                </Link>
                                <Link
                                  className="badge badge-success mb-1"
                                  to={`/manager/editTournament/${
                                    tournamentDetail.slug
                                      ? tournamentDetail.slug
                                      : ""
                                  }`}
                                >
                                  Edit
                                </Link>
                                <div
                                  className="btn-custom badge badge-danger mb-1"
                                  onClick={() => {
                                    deleteTournament(tournamentDetail.id);
                                  }}
                                >
                                  Delete
                                </div>

                                {isFinished ? (
                                  <Link className="btn-custom badge badge-secondary mb-1 hidden-ckr pe-none">
                                    Publish
                                  </Link>
                                ) : (
                                  <>
                                    {tournamentDetail.room?.status === 1 &&
                                    tournamentDetail.room?.expiry &&
                                    moment(
                                      tournamentDetail.room?.expiry,
                                    ).isSameOrAfter(
                                      moment(tournamentDetail.detail.startday),
                                      "day",
                                    ) ? (
                                      <Link
                                        className={`btn-custom badge mb-1 hidden-ckr ${
                                          tournamentDetail.status === 0
                                            ? "badge-success"
                                            : "badge-secondary"
                                        }`}
                                        onClick={() => {
                                          updateTournamentStatus(
                                            tournamentDetail.id,
                                            tournamentDetail.status === 0
                                              ? 1
                                              : 0,
                                          );
                                        }}
                                      >
                                        {tournamentDetail.status === 0
                                          ? ""
                                          : "Undo"}{" "}
                                        Publish
                                      </Link>
                                    ) : (
                                      <Link className="btn-custom badge mb-1 hidden-ckr badge-secondary pe-none">
                                        Publish unavailable
                                      </Link>
                                    )}
                                  </>
                                )}
                                {/* {tournamentdetail.closed === 0 ? (
                                  <Link
                                    className="badge badge-success mb-1"
                                    to={`/manager/checkin-tournament/${tournamentdetail.id}`}
                                  >
                                    Checkin
                                  </Link>
                                ) : (
                                  <Link
                                    className="btn-custom badge  badge-secondary mb-1"
                                    to={`/manager/checkin-tournament/${tournamentdetail.id}`}
                                  >
                                    Checkout{" "}
                                  </Link>
                                )} */}
                                {tournamentDetail.archived === 0 ? (
                                  <Link
                                    className="btn-custom badge badge-warning mb-1 hidden-ckr"
                                    onClick={() => {
                                      updateArchiveTournamentStatus(
                                        tournamentDetail.id,
                                      );
                                    }}
                                  >
                                    Archive
                                  </Link>
                                ) : (
                                  ""
                                )}

                                <div
                                  role="button"
                                  className="btn-custom badge badge-primary mb-1"
                                  onClick={
                                    () => handleShowExportModal()
                                    // handleExport(tournamentDetail.id)
                                  }
                                >
                                  Export
                                </div>
                                <div className="mb-1">
                                  <Link
                                    to="#"
                                    className="btn-custom badge badge-pink"
                                    onClick={() =>
                                      handleOpenSendEmailModal('manager')
                                    }
                                  >
                                    Send e-mail
                                  </Link>
                                  {isFinished ? (
                                    ""
                                  ) : (
                                    <Link
                                      className="action-link yellow-link mb-1"
                                      to={`/manager/addpremium-tournament?id=${tournamentDetail.id}`}
                                    >
                                      Premium Tournament
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="info-box">
                  <div className="d-flex mb-18">
                    <span>{t("page.tournamentsdetails.Date")}:</span>
                    <div className="ms-1">
                      <span className="d-block">
                        {tournamentDetail.detail
                          ? moment(tournamentDetail.detail.startday).format(
                            " DD.MM.YYYY",
                          )
                          : ""}
                      </span>
                      <span className="d-block" style={{ marginLeft: "-24px" }}>
                        {tournamentDetail.detail?.lastday
                          ? `(→ ${moment(
                            tournamentDetail.detail.lastday,
                          ).format("DD.MM.YYYY")})`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <span className="d-block mb-18">
                    <span>
                      <span>{t("page.tournamentsdetails.Time")}:</span>
                    </span>
                    <span className="ms-1">
                      {" "}
                      {tournamentDetail.detail
                        ? moment(tournamentDetail.detail.startday).format(
                          "HH:mm",
                        )
                        : ""}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Late Reg")}:</span>
                    <span className="ms-1">
                      {/* {
                                                tournamentdetail.detail ?
                                                    tournamentdetail.detail.lateregformat === 'time' ?
                                                        (
                                                            <>{tournamentdetail.detail ? tournamentdetail.detail.lateregtime.slice(0, 5) : 'No late reg'}</>
                                                        ) : (
                                                            <>  {tournamentdetail.detail ? "Round" +  " "+ tournamentdetail.detail.latereground : 'No late reg'}</>

                                                        ) : (
                                                        <></>
                                                    )
                                            } */}
                      {tournamentDetail.detail &&
                      tournamentDetail.detail.lateregformat === "time" ? (
                        <>
                          {tournamentDetail.detail
                            ? tournamentDetail.detail.lateregtime.slice(0, 5)
                            : ""}
                          {/* Late Reg:  {moment(element.detail.lateregtime).format('hh:mm')} */}
                        </>
                      ) : tournamentDetail.detail &&
                      tournamentDetail.detail.lateregformat === "round" ? (
                        <> Round {tournamentDetail.detail.latereground}</>
                      ) : (
                        "-"
                      )}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Buy in")}:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.buyin
                        : ""}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>Bounty:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.bounty
                        : ""}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Rake")}:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.rake
                        : ""}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>Max Number of re-entries:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.maxreentries
                        : ""}
                    </span>
                  </span>
                  <span className="d-block mb-18">
                    <span>Rake of re-entries:</span>
                    <span className="ms-1">
                      {tournamentDetail?.detail?.reentriesrake > 0
                        ? tournamentDetail.detail.reentriesrake
                        : "-"}
                    </span>
                  </span>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="info-box">
                  <span className="d-block  mb-18">
                    <span>{t("page.tournamentsdetails.Type")}:</span>&nbsp;
                    {tournamentDetail.detail
                      ? tournamentDetail.detail.type
                      : ""}
                  </span>
                  {/* <span className="d-block mb-18">
                                        <span>{t('page.tournamentsdetails.Max number of Re-Entries')}:</span>

                                        <span className="ms-1">{tournamentdetail.detail ? tournamentdetail.detail.maxreentries : ''}</span>
                                    </span>

                                    <span className="d-block mb-18">
                                        <span>{t('page.tournamentsdetails.Re-Entries Rake')} :</span>
                                        <span className="ms-1">{tournamentdetail.detail ? tournamentdetail.detail.rake : ''}</span>
                                    </span> */}

                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Dealers")}:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.dealertype
                        : ""}
                    </span>
                  </span>

                  <span className="d-block mb-18">
                    <span>Short handed:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail?.isshorthanded ? "Yes" : "No"}
                    </span>
                  </span>

                  <span className="d-block mb-18">
                    <span>Championship:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail?.ischampionship ? "Yes" : "No"}
                    </span>
                  </span>

                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Starting stack")}:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.startingstack
                        : ""}
                    </span>
                  </span>

                  <span className="d-block mb-18">
                    <span>{t("page.tournamentsdetails.Level duration")}:</span>
                    <span className="ms-1">
                      {tournamentDetail.detail
                        ? tournamentDetail.detail.level_duration
                        : ""}
                    </span>
                  </span>

                  <span className="d-flex">
                    {tournamentDetail.maxreentries !== 0 ? (
                      <span className="re-entry defination-games-info-span">
                        R
                      </span>
                    ) : (
                      ""
                    )}
                    {tournamentDetail.detail ? (
                      tournamentDetail.detail.ischampionship ? (
                        <span className=" championship-bagde me-2"></span>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="info-box">
                  <span className="roomAddress d-block address mb-18">
                    {tournamentRoomDetail.street}
                    <span className="d-block">{tournamentRoomDetail.town}</span>
                  </span>
                  <span className="d-block roomPhone phone text-truncate mb-18">
                    {formatPhoneNumber(
                      tournamentRoomDetail.phonecode,
                      tournamentRoomDetail.phone,
                    )}
                  </span>
                  <span className="d-block roomPhone contact-email text-truncate mb-18">
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      to="mailto:info@anotherpoker.ch"
                    >
                      {tournamentRoomDetail.contact}
                    </Link>
                  </span>
                  <span className="d-block roomPhone website text-truncate">
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      to="https://www.anotherpoker.ch"
                    >
                      {tournamentRoomDetail.website}
                    </Link>
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          <div className="h80"></div>

          <Row className="my-1 tournament-details flex-column-reverse flex-md-row">
            <Col md={6}>
              <div
                className="single-tournament-row overflow-hidden transparent-bg tournament-description p-0 lang-badges">
                <div className="mb-5">
                  {(tournamentDetail?.detail?.activelanguages || []).map(
                    (lang) => (
                      <span
                        key={lang}
                        role="button"
                        className="text-uppercase defination-games-info-span"
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </span>
                    ),
                  )}
                </div>
                <h2 className="text-center">Tournament Description </h2>
                <p
                  className="tiny-content"
                  dangerouslySetInnerHTML={{
                    __html: tournamentDescription?.[selectedLanguage] || "",
                  }}
                />

                <p>&nbsp;</p>
              </div>
              <div className="structure-wrapper">
                <h2 className="text-center">Structure</h2>
                <TournamentsStructure
                  structure={tournamentStructureDetail}
                  data={tournamentDetail}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="players-Template-wrap">
                <h3 className="text-center">Players list</h3>
                <div className="h80"></div>
                <div className="d-flex structure-top-wrap align-items-center flex-wrap justify-content-between">
                  <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                    <span className="structure-block-label d-block">
                      {t(
                        "page.tournaments.tournamentstable.Playersmodal.Players",
                      )}
                      :{" "}
                    </span>
                    <span className="structure-block-val d-block">
                      {tournamentDetail.players
                        ? tournamentDetail.players.registered.total +
                        tournamentDetail.reservedplayers
                        : ""}{" "}
                      /
                      {tournamentDetail.maxplayers
                        ? tournamentDetail.maxplayers
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
                      {tournamentDetail.players
                        ? tournamentDetail.players.waiting.total
                        : ""}
                    </span>
                  </span>

                  <span className="text-nowrap structure-top-wrap-block text-center four-boxes">
                    <span className="structure-block-label d-block">
                      {t(
                        "page.tournaments.tournamentstable.Playersmodal.Reserved places",
                      )}
                    </span>
                    <span className="structure-block-val d-block">
                      {tournamentDetail.reservedplayers
                        ? tournamentDetail.reservedplayers
                        : 0}
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
                </div>

                {/* <Scrollbars style={{ height: 515 }}> */}
                <PlayerList
                  data={tournamentPlayerDetail}
                  roomManagerId={tournamentDetail?.room?.user_id}
                />
                {/* </Scrollbars> */}
                {/* <Scrollbars style={{ height: 515 }}>
                                    <AnonymousList data={tournamentAnonymousList} />
                                </Scrollbars> */}
                {tournamentDetail.players &&
                tournamentDetail.players.waiting.total > 0 ? (
                  <>
                    {tournamentWaitingDetail.length != 0 ? (
                      <h3 className="text-center mt-5">Waiting list</h3>
                    ) : (
                      ""
                    )}

                    {/* <Scrollbars style={{ height: 515 }}> */}
                    <WaitingList
                      data={tournamentWaitingDetail}
                      roomManagerId={tournamentDetail?.room?.user_id}
                    />
                    {/* </Scrollbars> */}
                  </>
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
          <div className="h80"></div>
          <Row>
            <Col md={12}>
              <h2 className="text-center my-2 mb-3">Other Room Tournaments</h2>

              <div>
                {/* <RoomTournamentsTable /> */}
                <TournamentsTable
                  id={currentId}
                  data={tournaments}
                  parentCallback={getTournaments}
                  bannerImage={bottomBanners}
                  bottombannersSetting={bottomBannersSetting}
                />
              </div>
            </Col>
          </Row>
        </div>
        <Modal show={deleteModal}>
          <>
            <Modal.Header>
              <Modal.Title>Alert</Modal.Title>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={() => setDeleteModal(false)}
              ></button>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete tournament?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setDeleteModal(false)}>
                Close
              </Button>
              <Button variant="secondary" onClick={() => handleDeleteUser()}>
                Delete
              </Button>
            </Modal.Footer>
          </>
        </Modal>
        <Modal show={deleteSuccess}>
          <Modal.Header>
            <Modal.Title>Deleted</Modal.Title>
          </Modal.Header>

          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsLoading(true);
                navigate("/");
                setDeleteSuccess(false);
              }}
            >
              Okay
            </Button>
          </Modal.Footer>
        </Modal>

        <SendEmailModal
          show={sendEmailModalShow}
          onHide={() => {
            // handleShowTournament(params.slug);
            setSendEmailModalShow(false);
            setEmailData({});
          }}
          emailData={emailData}
        />

        <Modal show={showAnnounce} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Saved</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleAnnounceSubmit}>
              <Form.Group className="form-group" controlId="">
                <p className="description mb-10">
                  Announcement Time <span className="required">*</span>
                </p>

                <Form.Control
                  type="time"
                  className=""
                  name="timing"
                  pattern="[0-9]{2}:[0-9]{2}"
                />

                <p className="error">{Error}</p>
              </Form.Group>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Okay
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => {
                    // handleLoadTemplate()
                    handleAnnounceDelete();
                    // setShowannounce(false)
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => setShowAnnounce(false)}
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
                  setAnnounce(false);
                }}
              >
                Okay
              </Button>
            </Modal.Footer>
          </>
        </Modal>
        <DuplicateModal
          show={duplicateModalShow}
          onHide={(isSubmit) => {
            setDuplicateModalShow(false);

            if (isSubmit) {
              handleShowTournament(params.slug);
            }
          }}
          tournament={tournamentDetail}
        />
        <ExportModal
          show={exportModalShow}
          onHide={() => {
            setExportModalShow(false);
          }}
          tournament={{ ...tournamentDetail, ...tournamentDetail?.players }}
        />
      </main>
      {isLoading && <LogoAnimationLoader/>}
    </>
  );
};

export default TournamentsDetails;
