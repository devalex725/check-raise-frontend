import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import User from "../../api/services/User";

const Info = () => {
  const { i18n, t } = useTranslation();
  const imageUrl = process.env.REACT_APP_BANNER_IMAGE_URL;
  const [mainData, setMainData] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [tournamentData, setTournamentData] = useState([]);

  const getInfo = async () => {
    try {
      let responseData = await User.info().json();

      if (responseData.status === true) {
        const mainInfo = responseData.data.filter((element) => {
          return element.key === "main_info";
        });

        setMainData(mainInfo);
        const playerInfo = responseData.data.filter((element) => {
          return element.key === "player_info";
        });

        setPlayerData(playerInfo);
        const tournamentInfo = responseData.data.filter((element) => {
          return element.key === "tournament_info";
        });

        setTournamentData(tournamentInfo);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        // setError(errorJson.message)
      }
    }
  };
  useEffect(() => {
    getInfo();
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <>
      <main>
        <div className="wrapper info-wrapper">
          <Container>
            <Row className="mb-80">
              <Col md={12} className="text-center">
                <h2>
                  {t(
                    "page.info.Check-Raise is the platform that allows poker players to register for tournaments published by the various organisers",
                  )}
                  .
                </h2>
              </Col>
            </Row>
          </Container>

          <section className="primary-bg mb-60">
            <Container>
              <Row>
                {mainData.map((element, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Col md={6}>
                        <h3>{t("page.info.Check-Raise")}?</h3>

                        <>
                          <p
                            className="tiny-content"
                            dangerouslySetInnerHTML={{
                              __html:
                                element?.content?.[i18n.resolvedLanguage] ||
                                element?.content,
                            }}
                          />
                        </>

                        {/* <p><b>{t('page.info.It’s the ideal tool to manage your poker room')}.</b></p>
                                    <p><b>{t('page.info.Active since June 2021, Check-Raise is number 1 in Western Switzerland. The site is robust and works perfectly, to the full satisfaction of registered organizers')}.</b></p>
                                    <p>– {t('page.info.Will always remain completely free for all players! (with all the options like choosing your nickname or having the right to be anonymous)')}</p>
                                    <p>– {t('page.info.Very simple for players. One click is enough to register for a tournament')}</p>
                                    <p>– {t('page.info.Very easy to read tournament list in mobile and desktop version')}</p>
                                    <p>– {t('page.info.Filters to sort tournaments (cantons, rooms, dates…)')}</p>
                                    <p>– {t('page.info.Complete tool to manage your tournament')}</p>
                                    <p>– {t('page.info.Management of waiting lists')}</p>
                                    <p>– {t('page.info.Contact registered players')}</p>
                                    <p>– {t('page.info.Buy-in management: Check-in of registered players in one click')}</p>
                                    <p>– {t('page.info.Print / export the list of participants (for example for The Tournament Director)')}</p>
                                    <p>– {t('page.info.Statistics module for your players, your tournaments, your room (exportable pdf, xls…)')}</p>
                                    <p>– {t('page.info.Plan the publication of a tournament, but also the launch of registrations (save the date!)')}</p>
                                    <p>– {t('page.info.Send newsletters to your players')}</p>
                                    <p>– {t('page.info.Ban unwanted players who will not be able to register for your tournaments')}</p>
                                    <p>– {t('page.info.Site fully translated in 3 languages (EN, FR, DE)')}</p> */}
                      </Col>
                      <Col md={6}>
                        <img
                          src={element.image ? imageUrl + element.image : ""}
                          alt="checkraise"
                          className="img-fluid mt-4 mt-md-0"
                        />
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Container>
          </section>

          <section className="primary-bg mb-60">
            <Container>
              <Row>
                {playerData.map((element, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Col md={8}>
                        <h3>{t("page.info.Players")}</h3>

                        <>
                          <p
                            className="tiny-content"
                            dangerouslySetInnerHTML={{
                              __html:
                                element?.content?.[i18n.resolvedLanguage] ||
                                element?.content,
                            }}
                          />
                          <div className="text-center mt-5">
                            <Link
                              to="/registration"
                              className="btn btn-primary"
                            >
                              {t("page.info.Registration")}
                            </Link>
                          </div>
                        </>
                      </Col>
                      <Col md={4}>
                        <img
                          src={element.image ? imageUrl + element.image : ""}
                          alt="checkraise"
                          className="img-fluid mt-4 mt-md-0"
                        />
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Container>
          </section>
          <section className="primary-bg mb-60 ">
            <Container>
              <Row>
                {tournamentData.map((element, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Col md={8}>
                        <h2>{t("page.info.Poker tournament organizers")}</h2>

                        <>
                          <p
                            className="tiny-content"
                            dangerouslySetInnerHTML={{
                              __html:
                                element?.content?.[i18n.resolvedLanguage] ||
                                element?.content,
                            }}
                          />
                          <div className="text-center mt-5">
                            <Link
                              // to="mailto:info@check-raise.ch"
                              to="/contact"
                              className="btn btn-primary"
                            >
                              {t("menu.Contact")}
                            </Link>
                          </div>
                        </>
                      </Col>
                      <Col md={4}>
                        <img
                          src={element.image ? imageUrl + element.image : ""}
                          alt="PokerTournament"
                          className="img-fluid mt-4 mt-md-0"
                        />
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Container>
          </section>

          <section className="primary-bg">
            <Container>
              <Row>
                <Col md={12} className="text-center">
                  <div>
                    <Link to="/terms" className="btn btn-link">
                      {t("page.info.Terms and conditions")}
                    </Link>
                  </div>
                  <div>
                    <Link to="/privacy-policy" className="btn btn-link">
                      {t("page.info.Privacy policy")}
                    </Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </main>
    </>
  );
};

export default Info;
