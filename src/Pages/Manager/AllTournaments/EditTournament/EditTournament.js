import React, { useRef, useState, useEffect, useCallback } from "react";
import SettingService from "../../../../api/services/SettingService";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "../AddTournament/AddTournament.scss";
import { Tab, Tabs, Modal } from "react-bootstrap";
import TableRow from "./Table";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import RoomService from "../../../../api/services/RoomService";
import TournamentService from "../../../../api/services/TournamentService";
import LogoAnimationLoader from "../../../../components/Loading/LogoAnimationLoader";
import moment from "moment";
import _ from "lodash";
import MultiLangTinyEditor from "../../../../components/MultiLangTinyEditor/MultiLangTinyEditor";
const EditTournament = () => {
  const apiResponse = useRef();
  const apiResponses = useRef();
  const apiCheckResponses = useRef();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModelShow] = useState(false);
  const [loadData, setLoadData] = useState([]);
  const [isBonus, setIsBonus] = useState("");
  const [isBreakTitle, setIsBreakTitle] = useState("");
  const [isNumberDays, setIsNumberDays] = useState("");
  const [Error, setError] = useState("");
  const [count, setCount] = React.useState(0);
  const [RoomId, setRoomId] = useState("");
  const [structureData, setStructureData] = useState([]);
  const [Type, setType] = useState();
  const [Dealers, setDealers] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const params = useParams();

  const [endDate, setEndDate] = useState();
  const [bonusDate, setBonusDate] = useState();
  // setHours(setMinutes(new Date(), 30), 16)
  const [maxReentries, setMaxReentries] = useState(0);

  const [room, setRoom] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [activeLanguages, setActiveLanguages] = useState(["en", "fr", "de"]);
  const [description, setDescription] = useState(null);
  const [tournamentData, setTournamentData] = useState([]);
  const [checkInDetail, setcheckInDetail] = useState([]);
  const [horthanded, sethorthanded] = useState(0);
  const [Championship, setChampionship] = useState(0);
  const [hideMembership, setHideMembership] = useState(false);
  const [hideLateArrival, setHideLateArrival] = useState(false);

  const [RegisterPlayerData, setRegisterPlayerData] = useState([]);
  const [WaitingPlayerData, setWaitingPlayerData] = useState([]);
  const [RegistrationLog, setRegistrationLog] = useState([]);
  const [reservedPlayerInputValue, setReservedPlayerInputValue] = useState(0);
  const [maxNumberPlayerCount, setMaxNumberPlayerCount] = useState(0);
  const [reservedPlayerCount, setReservedPlayerCount] = useState(0);
  const [totalRegisteredPlayerCount, setTotalRegisteredPlayerCount] =
    useState(0);
  const handleChange = (e) => {
    const element = document.getElementsByClassName(
      "custom-error-message-chr"
    )[0];
    const elementTwo = document.getElementsByClassName(
      "custom-error-message-capital"
    )[0];
    const elementThree = document.querySelector(
      ".custom-error-message-letters"
    );

    const newText =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

    if (e.target.value.length > 34) {
      element.classList.add("d-block");
    } else {
      element.classList.remove("d-block");
    }

    if ((newText.match(/[A-Z]/g) || []).length > 7) {
      elementTwo.classList.add("d-block");
    } else {
      elementTwo.classList.remove("d-block");
    }

    if (!newText.match(/^[A-Za-z0-9,. +\-/\\()'@&]{1,35}$/g)) {
      elementThree.classList.add("d-block");
    } else {
      elementThree.classList.remove("d-block");
    }

    setCount(e.target.value.length);
  };
  // const languageValue = i18n;

  const [checked, setSelected] = useState("checked");

  const handleUpdateCountMaxPlayer = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      var data = {
        tournament_id: tournament.id,
        maxplayers: event.target.value,
        reservedplayers: tournament.detail.reservedplayers,
      };
      var response = await TournamentService.updateMax_res_player(data).json();
      if (response.status === false) {
        setError(response.msg);
      } else {
        setError("");
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
    getTournamentData(params.id);
  };
  const handleUpdateReservedPlayerCount = (event) => {
    event.preventDefault();
    const newVal = Number(event.target.value);
    setReservedPlayerInputValue(newVal);
    updateReservedPlayerCount(newVal);
  };

  const updateReservedPlayerCount = _.debounce(async (newVal) => {
    {
      setIsLoading(true);
      const freePlaces = maxNumberPlayerCount - totalRegisteredPlayerCount;

      // can't bigger than free places
      if (newVal > freePlaces) {
        newVal = freePlaces;
      }
      if (newVal < 0) {
        newVal = 0;
      }

      setReservedPlayerInputValue(newVal);
      // same with current value
      if (newVal === reservedPlayerCount) {
        setIsLoading(false);
        return;
      }

      try {
        const data = {
          tournament_id: tournament.id,
          maxplayers: tournament.detail.maxplayers,
          reservedplayers: newVal,
        };

        const response = await TournamentService.updateMax_res_player(
          data
        ).json();
        setIsLoading(false);

        if (response.status === false) {
          setError("Reserved player not grater than max players");
        } else {
          setError("");
          getTournamentData(params.id);
        }
      } catch (error) {
        setIsLoading(false);

        console.error(error);

        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
          );
        }
      }
    }
  }, 500);

  const getRoomIndex = async () => {
    try {
      let responseData = await RoomService.index().json();
      setRoom(responseData.data);

      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleChangeActiveLanguage = (e) => {
    const { value, checked } = e.target;

    setActiveLanguages((prev) => {
      const index = activeLanguages.indexOf(value);

      if (checked && index < 0) {
        prev.push(value);
      }

      if (!checked && index > -1) {
        prev.splice(index, 1);
      }
      return [...prev];
    });
  };

  const getTournamentData = async (id) => {
    try {
      let responseData = await TournamentService.show(id).json();
      setTournament(responseData.data);

      setCount(responseData.data.title.length);
      setStructureData(responseData.data.structure);
      sethorthanded(
        responseData.data.detail ? responseData.data.detail.isshorthanded : ""
      );

      setStartDate(
        new Date(
          responseData.data.detail
            ? responseData.data.detail.startday === "0000-00-00 00:00:00"
              ? new Date()
              : responseData.data.detail.startday
            : new Date()
        )
      );

      setEndDate(
        responseData.data
          ? responseData.data.detail.lastday === null ||
            responseData.data.detail.lastday === "0000-00-00 00:00:00"
            ? ""
            : new Date(responseData.data.detail.lastday)
          : ""
      );
      setBonusDate(
        responseData.data
          ? responseData.data.detail.bounusdeadline === null ||
            responseData.data.detail.bounusdeadline === "0000-00-00 00:00:00"
            ? ""
            : new Date(responseData.data.detail.bounusdeadline)
          : ""
      );

      setChampionship(
        responseData.data.detail ? responseData.data.detail.ischampionship : ""
      );

      var lateregformat = responseData.data.detail
        ? responseData.data.detail.lateregformat === "time"
          ? setSelected(
              responseData.data.detail
                ? responseData.data.detail.lateregformat
                : ""
            )
          : responseData.data.detail
          ? responseData.data.detail.lateregformat === "round"
            ? setSelected(
                responseData.data.detail
                  ? responseData.data.detail.lateregformat
                  : ""
              )
            : responseData.data.detail
            ? responseData.data.detail.lateregformat === "checked"
              ? setSelected(
                  responseData.data.detail
                    ? responseData.data.detail.lateregformat
                    : ""
                )
              : ""
            : ""
          : ""
        : "";

      let _activeLanguages = responseData.data.detail.activelanguages;
      _activeLanguages = Array.isArray(_activeLanguages)
        ? _activeLanguages
        : [];
      setActiveLanguages(_activeLanguages);

      const initialDescription = {};
      responseData.data.description.map((desc) => {
        initialDescription[desc.language] = desc.description;
      });

      setDescription(initialDescription);

      getCheckInDataByTournamnetID(responseData.data.id);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const changeHandler = (e) => {
    setSelected(e.target.value);
  };
  const getSetting = async () => {
    try {
      let responseData = await SettingService.index().json();
      setIsBonus(responseData.data.is_bonus);
      setIsBreakTitle(responseData.data.break_text);
      setIsNumberDays(responseData.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getCheckInDataByTournamnetID = async (id) => {
    try {
      let responseData = await TournamentService.checkInTournament(id).json();

      setTournamentData(responseData.data);
      setcheckInDetail(responseData.data.detail);
      if (responseData.data.is_membership === 0) {
        setHideMembership(true);
      } else {
        setHideMembership(false);
      }
      if (responseData.data.is_late_arrival === 0) {
        setHideLateArrival(true);
      } else {
        setHideLateArrival(false);
      }
      setRegisterPlayerData(responseData.data.registered);
      setWaitingPlayerData(responseData.data.waiting.data);
      setRegistrationLog(responseData.data.log.data);

      setMaxNumberPlayerCount(responseData.data.detail.maxplayers);
      setReservedPlayerCount(responseData.data.detail.reservedplayers);
      setReservedPlayerInputValue(responseData.data.detail.reservedplayers);

      setTotalRegisteredPlayerCount(
        Number(responseData.data.registered.total) +
          Number(responseData.data.waiting.total)
      );

      setMaxReentries(Number(responseData.data.detail?.maxreentries));

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  apiResponse.current = getRoomIndex;
  apiResponses.current = getTournamentData;
  //apiCheckResponses.current = getCheckInDataByTournamnetID;
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      apiResponse.current();
      apiResponses.current(params.id);
      getSetting();
      //getCheckInDataByTournamnetID()
    } else {
      navigate("/");
    }
  }, [params.id]);
  const handleCallback = (childData) => {
    // Update the name in the component's state
    setStructureData(childData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = event.target.title.value;

    let titleError = "";

    if (!title) {
      titleError = "Title field is required.";
    } else if (title.length > 34) {
      titleError = t(
        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycharacters"
      );
    } else if ((title.match(/[A-Z]/g) || []).length > 7) {
      titleError = t(
        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycapital"
      );
    } else if (!title.match(/^[A-Za-z0-9,. +\-/\\()'@&]{1,35}$/g)) {
      titleError = "Only letters, numbers and +-/\\()'@&,. are allowed.";
    }

    if (titleError) {
      setError(titleError);
      return;
    }

    try {
      const userData = {
        tournament: {
          title,
          room_id: RoomId ? RoomId : tournament.room ? tournament.room.id : "",
          id: tournament.id,
        },
        details: {
          type: Type ? Type : tournament.detail ? tournament.detail.type : "",
          isshorthanded: horthanded,
          ischampionship: Championship,
          dealertype: Dealers
            ? Dealers
            : tournament.detail
            ? tournament.detail.dealertype
            : "",
          buyin: event.target.buyin.value,
          bounty: event.target.bounty.value,
          rake: event.target.rake.value,
          maxreentries: event.target.maxreentries.value,
          reentriesrake: event.target.reentriesrake?.value || 0,

          startday: moment(startDate).format("YYYY-MM-DD HH:mm"),
          lastday: endDate
            ? moment(endDate).format("YYYY-MM-DD HH:mm")
            : "" /*endDate*/,
          bounusdeadline:
            moment(bonusDate).format("YYYY-MM-DD HH:mm") === "Invalid date"
              ? ""
              : moment(bonusDate).format("YYYY-MM-DD HH:mm"),

          lateregformat: checked
            ? checked
            : tournament.detail
            ? tournament.detail.lateregformat
            : "",
          lateregtime:
            checked === "checked" || checked === "round"
              ? ""
              : event.target.lateregtime.value,
          latereground:
            checked === "checked" || checked === "time"
              ? ""
              : event.target.latereground.value,
          startingstack: event.target.startingstack.value,
          level_duration: event.target.level_duration.value,
          maxplayers: event.target.maxplayers.value,
          reservedplayers: event.target.reservedplayers.value,
          activelanguages: activeLanguages,
        },
        descriptions: [
          { language: "en", description: description.en || "" },
          { language: "fr", description: description.fr || "" },
          { language: "de", description: description.de || "" },
        ],

        structure: structureData.length === 0 ? "" : structureData,
      };

      let responseData = await TournamentService.update(userData).json();

      if (responseData.status === true) {
        setModelShow(true);
        setModalMessage(responseData.message);
        setError("");
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      console.error(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };
  const handleDates = (date) => {
    setStartDate(date);
    const newDate = new Date(date);
    if (isNumberDays.current_bonus_status === 1) {
      var followingDay = new Date(
        newDate.getTime() - isNumberDays.number_of_hours * 60 * 60 * 1000
      );

      setBonusDate(followingDay);
    } else if (isNumberDays.current_bonus_status === 2) {
      const dateStr = moment(newDate)
        .subtract(isNumberDays.number_of_day, "days")
        .format("YYYY-MM-DD ");
      setBonusDate(new Date(dateStr + isNumberDays.day_time));
    } else if (isNumberDays.current_bonus_status === 3) {
      let target = isNumberDays.fix_weekday;
      let date = newDate;
      date.setDate(
        date.getDate() -
          (date.getDay() == target ? 7 : (date.getDay() + (7 - target)) % 7)
      );

      setBonusDate(date);
    }
  };

  const handleChangeMaxReentries = (e) => {
    setMaxReentries(Number(e.target.value));
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          {/* <Col md={2}>
                         {/* <MyProfileLeftNavManager /> */}
          {/* </Col> */}
          <Col md={10} lg={12}>
            <Card>
              <Card.Header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#fff"
                  className="me-1"
                >
                  <path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
                <Link to="/manager/my-tournaments">
                  {t("page.myprofile.myprofilenav.All tournaments.Tournaments")}
                </Link>{" "}
                <FontAwesomeIcon icon={faArrowRight} />{" "}
                {t(
                  "page.myprofile.myprofilenav.All tournaments.Edittournament"
                )}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group" controlId="">
                    {/* <p className="description mb-10">Select Room <span className='required'>*</span></p> */}
                    {/* <Form.Select aria-label="Default select example"
                                            value={
                                                RoomId ? RoomId : tournament.room ? tournament.room.id : ''
                                            }
                                            onChange={(event) => setRoomId(event.target.value)}
                                        >

                                            {
                                                room.map((element) => (
                                                    <option value={element.id}>{element.title}</option>
                                                ))
                                            }

                                        </Form.Select> */}
                    <Form.Control
                      type="text"
                      className=""
                      name="roomtitle"
                      defaultValue={
                        tournament.room ? tournament.room.title : ""
                      }
                      disabled
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                  <Form.Group className="form-group" controlId="">
                    <p className="description mb-10">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.description"
                      )}
                    </p>
                    <Form.Control
                      type="text"
                      maxLength={34}
                      className=""
                      name="title"
                      defaultValue={tournament.title}
                      onChange={handleChange}
                    />
                    <span className="span-append">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.Characters"
                      )}
                      : <span id="rchars">{count}</span> / 34
                    </span>
                    <span className="custom-error-message-capital">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycapital"
                      )}
                    </span>
                    <span className="custom-error-message-chr">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycharacters"
                      )}
                    </span>
                    <span className="custom-error-message-letters">
                      Only letters, numbers and +-/\()'@&,. are allowed.
                    </span>
                  </Form.Group>
                  {/* <div className="d-flex  justify-content-end">
                    <Button
                      className="me-1 "
                      variant="primary"
                      type="button"
                      onClick={handleOpenTemplate}
                    >
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LoadTemplate"
                      )}
                    </Button>
                  </div> */}
                  <Tabs
                    defaultActiveKey="tournamentdetails"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="tournamentdata" title="Tournament data">
                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Type"
                          )}{" "}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={
                            Type
                              ? Type
                              : tournament.detail
                              ? tournament.detail.type
                              : ""
                          }
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="Holdem">Holdem</option>
                          <option value="Omaha">Omaha</option>
                          <option value="Horse">Horse</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.ShortHanded?"
                          )}
                        </Form.Label>
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          label=""
                          checked={horthanded}
                          value={horthanded}
                          onChange={() => {
                            sethorthanded(horthanded ? 0 : 1);
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>Championship?</Form.Label>
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          label=""
                          checked={Championship}
                          onChange={() => setChampionship((prev) => !prev)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Dealers?"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={
                            Dealers
                              ? Dealers
                              : tournament.detail
                              ? tournament.detail.dealertype
                              : ""
                          }
                          onChange={(e) => setDealers(e.target.value)}
                        >
                          <option
                            value="Dealers"
                            selected="selected"
                            data-i="0"
                          >
                            {t(
                              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Dealers"
                            )}
                          </option>
                          <option value="Self-dealing">
                            {t(
                              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Self-dealing"
                            )}
                          </option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Buy-in"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="buyin"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail ? tournament.detail.buyin : ""
                          }
                          min={0}
                        />
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Bounty"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          name="bounty"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail ? tournament.detail.bounty : ""
                          }
                          required
                          min={0}
                        />
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Rake"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="rake"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail ? tournament.detail.rake : ""
                          }
                          min={0}
                        />
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.MaxNumber"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <p>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.if"
                          )}
                        </p>
                        <Form.Control
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="maxreentries"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail
                              ? tournament.detail.maxreentries
                              : ""
                          }
                          min={0}
                          onChange={handleChangeMaxReentries}
                        />
                      </Form.Group>
                      {maxReentries > 0 ? (
                        <Form.Group
                          className="border-bottom form-group"
                          controlId=""
                        >
                          <Form.Label>Re-entries Rake</Form.Label>
                          <Form.Control
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            name="reentriesrake"
                            defaultValue={
                              tournament.detail?.reentriesrake
                                ? tournament.detail.reentriesrake
                                : 0
                            }
                            min={0}
                          />
                        </Form.Group>
                      ) : (
                        ""
                      )}

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentStartDateTime"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <DatePicker
                          selected={startDate}
                          onChange={handleDates}
                          // onChange={(date) => setStartDate(date)}
                          showTimeSelect
                          timeIntervals={15}
                          timeFormat="HH:mm"
                          dateFormat="dd.MM.yyyy HH:mm"
                          calendarStartDay={1}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </Form.Group>
                      {isBonus === 1 ? (
                        <Form.Group
                          className="border-bottom form-group"
                          controlId=""
                        >
                          <Form.Label>
                            {" "}
                            Bonus registration deadline
                            <span className="required"></span>
                          </Form.Label>
                          <DatePicker
                            selected={bonusDate}
                            onChange={(date) => setBonusDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            injectTimes={[
                              setHours(setMinutes(new Date(), 1), 0),
                              setHours(setMinutes(new Date(), 5), 12),
                              setHours(setMinutes(new Date(), 59), 23),
                            ]}
                            dateFormat="dd.MM.yyyy HH:mm"
                            calendarStartDay={1}
                          />
                        </Form.Group>
                      ) : (
                        ""
                      )}
                      <Form.Group
                        className="border-bottom form-group without-date-calander"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentEndDate"
                          )}
                        </Form.Label>
                        <p>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Addthisonly"
                          )}
                        </p>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd.MM.yyyy"
                          calendarStartDay={1}
                        />
                      </Form.Group>

                      <Form.Group className="border-bottom p-0" controlId="">
                        <Row>
                          <Col md={6}>
                            <div className="form-group h-100">
                              <Form.Label>
                                {t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegFormat"
                                )}
                              </Form.Label>

                              <Form.Check // prettier-ignore
                                type="radio"
                                id="default-radio"
                                name="lateRegFormat"
                                label={t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.WithoutLateRegistration"
                                )}
                                value="checked"
                                checked={checked === "checked"}
                                onChange={changeHandler}
                              />

                              <Form.Check // prettier-ignore
                                type="radio"
                                id="default-radio1"
                                name="lateRegFormat"
                                label={t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Time"
                                )}
                                value="time"
                                checked={checked === "time"}
                                onChange={changeHandler}
                                pattern="[0-9]"
                              />

                              <Form.Check // prettier-ignore
                                type="radio"
                                id="default-radio2"
                                name="lateRegFormat"
                                label={t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Round"
                                )}
                                value="round"
                                checked={checked === "round"}
                                onChange={changeHandler}
                                pattern="[0-9]"
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              className="form-group lateRegTime h-100"
                              controlId=""
                              aria-hidden={checked !== "time" ? true : false}
                            >
                              <Form.Label>
                                {t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegTime"
                                )}
                              </Form.Label>
                              <Form.Control
                                type="time"
                                name="lateregtime"
                                defaultValue={
                                  tournament.detail
                                    ? tournament.detail.lateregtime
                                    : ""
                                }
                              />
                            </Form.Group>

                            <Form.Group
                              className="form-group lateRegRound h-100"
                              controlId=""
                              aria-hidden={checked !== "round" ? true : false}
                            >
                              <Form.Label>
                                {t(
                                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LateRegRound"
                                )}
                              </Form.Label>
                              <Form.Control
                                onWheel={(e) => e.target.blur()}
                                type="number"
                                className=""
                                name="latereground"
                                pattern="[0-9]"
                                defaultValue={
                                  tournament.detail
                                    ? tournament.detail.latereground
                                    : ""
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form.Group>

                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Startingstack"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="startingstack"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail
                              ? tournament.detail.startingstack
                              : ""
                          }
                        />
                      </Form.Group>

                      <Form.Group className=" form-group" controlId="">
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LevelDuration"
                          )}
                          <span className="required">*</span>
                        </Form.Label>
                        <p>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Ifyourstructure"
                          )}
                        </p>
                        <Form.Control
                          type="text"
                          className=""
                          name="level_duration"
                          defaultValue={
                            tournament.detail
                              ? tournament.detail.level_duration
                              : ""
                          }
                        />
                      </Form.Group>
                    </Tab>
                    <Tab eventKey="players" title="Players">
                      <Form.Group
                        className="border-bottom form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.MaxNumberofplayers"
                          )}
                          <span className="required">*</span>
                          <span>
                            {" "}
                            (Registered Players : {totalRegisteredPlayerCount})
                          </span>
                        </Form.Label>
                        {reservedPlayerCount >= maxNumberPlayerCount ? (
                          <Form.Control
                            min={
                              maxNumberPlayerCount ? maxNumberPlayerCount : 0
                            }
                            onChange={handleUpdateCountMaxPlayer}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            className=""
                            name="maxplayers"
                            pattern="[0-9]"
                            defaultValue={
                              tournament.detail
                                ? tournament.detail.maxplayers
                                : ""
                            }
                          />
                        ) : (
                          <Form.Control
                            onChange={handleUpdateCountMaxPlayer}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            className=""
                            name="maxplayers"
                            pattern="[0-9]"
                            defaultValue={
                              tournament.detail
                                ? tournament.detail.maxplayers
                                : ""
                            }
                            min={0}
                          />
                        )}
                      </Form.Group>
                      <Form.Group className="form-group" controlId="">
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.NumberofReservedPlaces"
                          )}
                        </Form.Label>
                        <p>
                          {t(
                            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.playerstab.Thisnumber"
                          )}
                        </p>
                        <Form.Control
                          onChange={handleUpdateReservedPlayerCount}
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="reservedplayers"
                          pattern="[0-9]"
                          value={reservedPlayerInputValue}
                          min={0}
                          max={
                            maxNumberPlayerCount - totalRegisteredPlayerCount
                          }
                        />
                      </Form.Group>
                    </Tab>
                    <Tab
                      eventKey="tournamentdetails"
                      title="Tournament details"
                    >
                      <h4>
                        {t(
                          "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Structure"
                        )}
                      </h4>
                      <div className="d-flex justify-content-end"></div>

                      <TableRow
                        structure={structureData}
                        title={isBreakTitle}
                        parentCallback={handleCallback}
                      />

                      <div className="border-bottom my-3"></div>

                      <h4 className="mb-4">
                        {t(
                          "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Tournamentdescription"
                        )}
                      </h4>
                      <Form.Group className="mb-3 form-group">
                        <Form.Label>Active Languages</Form.Label>
                        <Form.Check
                          label="English"
                          inline
                          name="activeLanguages"
                          checked={activeLanguages.includes("en")}
                          value="en"
                          onChange={handleChangeActiveLanguage}
                        />
                        <Form.Check
                          label="French"
                          inline
                          name="activeLanguages"
                          checked={activeLanguages.includes("fr")}
                          value="fr"
                          onChange={handleChangeActiveLanguage}
                        />
                        <Form.Check
                          label="Deutsch"
                          inline
                          name="activeLanguages"
                          checked={activeLanguages.includes("de")}
                          value="de"
                          onChange={handleChangeActiveLanguage}
                        />
                      </Form.Group>
                      {description && (
                        <MultiLangTinyEditor
                          name="description"
                          initialValue={description}
                          onChange={({ value }) => setDescription(value)}
                          activeLanguages={activeLanguages}
                        />
                      )}
                      {/* <Tabs
                        defaultActiveKey="English"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        <Tab eventKey="English" title="English">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            initialValue={description}
                            name="description"
                            onChange={(e) => handleEditorChange(e, "en")}
                          />
                        </Tab>
                        <Tab eventKey="French" title="French">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            initialValue={descriptionFrench}
                            name="descriptionFrench"
                            onChange={(e) => handleEditorChange1(e, "fr")}
                          />
                        </Tab>
                        <Tab eventKey="Deutsch" title="Deutsch">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            initialValue={descriptionDeutsch}
                            name="descriptionDeutsch"
                            onChange={(e) => handleEditorChange2(e, "de")}
                          />
                        </Tab>
                      </Tabs> */}

                      <div className="mb-4"></div>
                    </Tab>
                  </Tabs>

                  <p className="error">{Error}</p>

                  <Form.Group className="form-group text-end" controlId="">
                    <Button className="me-1" variant="primary" type="submit">
                      Save
                    </Button>

                    <Button variant="secondary" type="reset">
                      Cancel
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
      {modalShow ? (
        <Modal show={modalShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModelShow(false);
                  navigate("/manager/my-tournaments");
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default EditTournament;
