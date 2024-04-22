import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import TournamentsTable from "../../components/TournamentsTable/TournamentsTable";
import TournamentService from "../../api/services/TournamentService";
import RoomService from "../../api/services/RoomService";
import LogoAnimationLoader from "../../components/Loading/LogoAnimationLoader";
import BannerService from "../../api/services/BannerService";
import { formatPhoneNumber } from "../../utils";
var imageUrl = process.env.REACT_APP_ROOM_IMAGE_URL;

const Room = () => {
  const params = useParams();
  const { i18n } = useTranslation();
  // const apiResponse = useRef();
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDetail, setRoomDetail] = useState([]);
  // const [roomId, setRoomId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomDescription, setRoomDescription] = useState({
    en: "",
    fr: "",
    de: "",
  });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [bottomBanners, setBottomBanner] = useState([]);
  const [bottomBannersSetting, setBottomBannerSetting] = useState([]);
  const [bannerContent, setBannerContent] = useState("");
  const [frenchContent, setFrenchContent] = useState("");
  const [dutchContent, setDutchContent] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  const handleShowRoom = async (id) => {
    try {
      let responseData = await RoomService.show(id).json();
      setIsLoading(false);
      setRoomTitle(responseData.data.title);

      setRoomDetail(responseData.data.detail);
      getTournaments(responseData.data.detail.room_id);
      // const apiCall = responseData.data.detail.room_id;
      // roomFilterApi(apiCall);

      setRoomDescription((prev) => {
        (responseData.data.description || []).map((desc) => {
          prev[desc.language] = desc.description;
        });

        return { ...prev };
      });

      if (
        (responseData.data.detail.activelanguages || []).includes(
          i18n.resolvedLanguage
        )
      ) {
        setSelectedLanguage(i18n.resolvedLanguage);
      }

      if (responseData.data.detail.activelanguages.length < 2) {
        setSelectedLanguage(responseData.data.detail.activelanguages[0]);
      }
    } catch (error) {
      console.log("something went wrong");
    }
  };
  // apiResponse.current = handleShowRoom;
  useEffect(() => {
    window.scrollTo(0, 0);
    // getTournaments();
    getTodayBanner();
    handleShowRoom(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!(roomDetail.activelanguages || []).includes(i18n.resolvedLanguage)) {
      return;
    }
    setSelectedLanguage(i18n.resolvedLanguage);
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"));
      setCurrentId(obj.id);
    }
  }, []);

  const getTournaments = async (roomId) => {
    try {
      if (!roomId) {
        roomId = roomDetail?.id;
      }

      let responseData = null;
      if (localStorage.getItem("usertype") === "Player") {
        responseData = await TournamentService.indexByAuth([roomId]).json();
      } else {
        responseData = await TournamentService.index([roomId]).json();
      }
      setTournaments(responseData.data);
    } catch (error) {
      setIsLoading(true);
    }
  };
  const getTodayBanner = async () => {
    try {
      const responseData = await BannerService.todayBanner(2).json();
      setBottomBanner(responseData.data);
      setBottomBannerSetting(responseData.settings);
      var data = [];
      data = responseData.settings.filter(function (item) {
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
  // const roomFilterApi = async (apiCall) => {
  //   try {
  //     let responseData = await TournamentService.index([apiCall]).json();
  //     // setRoomId(responseData.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      <div className="wrapper">
        <div className="d-none d-md-flex justify-content-center mb-5">
          <Link
            to={
              !roomDetail?.website?.startsWith("https://")
                ? `https://${roomDetail.website}`
                : roomDetail.website
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={roomDetail ? imageUrl + roomDetail.logo : ""}
              className="room-logo"
            />
          </Link>
        </div>

        <Row>
          <Col md={5}>
            <div className="single-tournament-row">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2>{roomTitle}</h2>
                  <p className="address">
                    {roomDetail?.street}, {roomDetail?.zipcode}{" "}
                    {roomDetail?.city}
                  </p>
                  {roomDetail?.phonecode && roomDetail?.phone ? (
                    <p className="phone">
                      {formatPhoneNumber(
                        roomDetail?.phonecode,
                        roomDetail?.phone
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  <p className="contact-email">
                    {roomDetail ? roomDetail.contact : ""}
                  </p>
                  {roomDetail?.website ? (
                    <p className="website">
                      <a
                        href={
                          !roomDetail?.website?.startsWith("https://")
                            ? `https://${roomDetail.website}`
                            : roomDetail.website
                        }
                        target="_blank"
                      >
                        {roomDetail.website}
                      </a>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <Link
                  to={
                    !roomDetail?.website?.startsWith("https://")
                      ? `https://${roomDetail.website}`
                      : roomDetail.website
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block d-md-none"
                >
                  <Image
                    src={roomDetail ? imageUrl + roomDetail.logo : ""}
                    className="room-logo"
                  />
                </Link>
              </div>
            </div>
          </Col>
          <Col md={7} className="d-none d-md-block">
            <div className="single-tournament-row room-description">
              <div className="single-tournament-col lang-badges">
                {roomDetail.activelanguages?.length > 0 ? (
                  <div className="mb-5">
                    {(roomDetail.activelanguages || []).map((lang) => (
                      <span
                        key={lang}
                        role="button"
                        className="text-uppercase defination-games-info-span"
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <h2 className="text-center">Room Description</h2>

                <p
                  className="content tiny-content"
                  dangerouslySetInnerHTML={{
                    __html: roomDescription[selectedLanguage],
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row className="my-3 table-wrapper">
          <Col md={12}>
            <h2 className="text-center room-table-title">Tournaments</h2>

            {/* <TournamentsTable data={roomId} /> */}
            <TournamentsTable
              id={currentId}
              data={tournaments}
              parentCallback={getTournaments}
              bannerImage={bottomBanners}
              bottombannersSetting={bottomBannersSetting}
            />
          </Col>
        </Row>
        <Row className="d-md-none">
          <Col>
            <div className="single-tournament-row room-description">
              <div className="single-tournament-col lang-badges">
                {roomDetail.activelanguages?.length > 0 ? (
                  <div className="mb-5">
                    {(roomDetail.activelanguages || []).map((lang) => (
                      <span
                        key={lang}
                        role="button"
                        className="text-uppercase defination-games-info-span"
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <h2 className="text-center">Room Description</h2>

                <p
                  className="content tiny-content"
                  dangerouslySetInnerHTML={{
                    __html: roomDescription[selectedLanguage],
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default Room;
