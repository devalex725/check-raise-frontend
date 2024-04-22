import React, { useState, useEffect } from "react";

import {
  Button,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";
import TournamentService from "../api/services/TournamentService";
import BannerService from "../api/services/BannerService";
import Filter from "../components/Filter/Filter";
import LogoAnimationLoader from "../components/Loading/LogoAnimationLoader";
import TournamentsTable from "../components/TournamentsTable/TournamentsTable";

const Home = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const {  i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  const [bottomBanners, setBottomBanners] = useState([]);
  const [bottomBannersSetting, setBottomBannersSetting] = useState([]);
  const [bannerContent, setBannerContent] = useState("");
  const [frenchContent, setFrenchContent] = useState("");
  const [dutchContent, setDutchContent] = useState("");
  const [savedFilterApply, setSavedFilterApply] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);

  function toggleLoader(value) {
    setIsLoading(value);
  }

  const getTournaments = async () => {
    try {
      setIsLoading(true);
      setFirstTimeLoad(true);
      let responseData = [];
      if (localStorage.getItem("usertype") === "Player") {
        responseData = await TournamentService.indexByAuth().json();
      } else {
        responseData = await TournamentService.index().json();
      }
      setTournaments(responseData.data);
      setFirstTimeLoad(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getTodayBanner = async () => {
    try {
      const bottomBannerRes = await BannerService.todayBanner(2).json();
      setBottomBanners(bottomBannerRes.data);
      setBottomBannersSetting(bottomBannerRes.settings);
      const data = bottomBannerRes.settings.filter(
        (item) => item.is_important_message_banner === 1
      );
      if (data.length === 0) {
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
  useEffect(() => {
    getTournaments();
    getTodayBanner();
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"));
      setCurrentId(obj.id);
    }
  }, []);

  return (
    <>
      <main>
        <div className="wrapper">
          <Container>
            <Row>
              <Col md={3} xl={2}>
                <div
                  className={
                    isOpen ? "filter-wrapper  filter-active" : "filter-wrapper"
                  }
                >
                  <div className="text-end d-block d-md-none">
                    <span onClick={toggle} className="filter-close">
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
                    </span>
                  </div>
                  <Filter
                    firstTimeLoad={firstTimeLoad}
                    parentCallback={setTournaments}
                    savedFilterApply={savedFilterApply}
                    setSavedFilterApply={setSavedFilterApply}
                  />
                </div>
              </Col>
              <Col md={12} xl={10} className="hometournament-table">
                {bannerContent === "" ? (
                  <></>
                ) : (
                  <div className="order-1 d-flex justify-content-center pt-lg-1 pb-lg-1 ms-2 ms-lg-0 red-banner">
                    {i18n.resolvedLanguage === "en" ? (
                      <p
                        className="mb-0"
                        style={{ background: "#dc3545" }}
                        dangerouslySetInnerHTML={{ __html: bannerContent }}
                      />
                    ) : (
                      ""
                    )}
                    {i18n.resolvedLanguage === "de" ? (
                      <p
                        className="mb-0"
                        style={{ background: "#dc3545" }}
                        dangerouslySetInnerHTML={{ __html: dutchContent }}
                      />
                    ) : (
                      ""
                    )}
                    {i18n.resolvedLanguage === "fr" ? (
                      <p
                        className="mb-0"
                        style={{ background: "#dc3545" }}
                        dangerouslySetInnerHTML={{ __html: frenchContent }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <div className="d-flex d-md-none align-items-center justify-content-start mb-2">
                  <Button size="sm" onClick={toggle} className="me-2 px-3">
                    <FontAwesomeIcon icon={faSliders} />
                  </Button>
                  <Switch
                    onChange={setSavedFilterApply}
                    checked={savedFilterApply}
                    className="react-switch"
                    width={56}
                    height={26}
                    onColor="#C5E6F1"
                    offColor="#233237"
                    uncheckedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 15,
                          paddingInline: 2,
                        }}
                      >
                        Off
                      </div>
                    }
                    checkedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 15,
                          paddingInline: 2,
                          color: "#0B0B0B",
                        }}
                      >
                        On
                      </div>
                    }
                  />
                </div>
                <TournamentsTable
                  id={currentId}
                  loading={toggleLoader}
                  data={tournaments}
                  parentCallback={getTournaments}
                  bannerImage={bottomBanners}
                  bottombannersSetting={bottomBannersSetting}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </main>
      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default Home;
