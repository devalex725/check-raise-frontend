import React, { useRef, useState, useEffect } from "react";
import AdminRoomService from "../../../../api/services/AdminService/AdminRoomService";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "../EditTournament/EditTournament.scss";
import { Tab, Tabs, Modal } from "react-bootstrap";
import TableRow from "./Table";
import { Editor } from "@tinymce/tinymce-react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import AdminTournamentService from "../../../../api/services/AdminService/AdminTournamentService";
import LogoAnimationLoader from "../../../../components/Loading/LogoAnimationLoader";
import MultiLangTinyEditor from "../../../../components/MultiLangTinyEditor/MultiLangTinyEditor";
import moment from "moment";

const EditTournament = () => {
  const apiResponse = useRef();
  const apiResponses = useRef();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModelShow] = useState(false);
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

  const [room, setRoom] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [activeLanguages, setActiveLanguages] = useState(["en", "fr", "de"]);
  const [description, setDescription] = useState(null);
  // const [description, setDescription] = useState("");
  // const [descriptionFrench, setDescriptionFrench] = useState("");
  // const [descriptionDeutsch, setDescriptionDeutsch] = useState("");
  // const [selectLanguage, setSelectLanguage] = useState("");
  // const [selectFrenchLanguage, setSelectFrenchLanguage] = useState("");
  // const [selectDeutschLanguage, setSelectDeutschLanguage] = useState("");
  const [shortHanded, setShortHanded] = useState(0);
  const [Championship, setChampionship] = useState(0);
  const [openTemplateShow, setOpenTemplateShow] = useState(false);
  const [loadData, setLoadData] = useState([]);
  const [checked, setSelected] = useState("checked");

  const handleChange = (e) => {
    const element = document.getElementsByClassName(
      "custom-error-message-chr"
    )[0];
    const elementTwo = document.getElementsByClassName(
      "custom-error-message-capital"
    )[0];
    let newtext =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

    if (e.target.value.length > 34) {
      element.classList.add("d-block");
    } else {
      element.classList.remove("d-block");
    }

    if ((newtext.match(/[A-Z]/g) || []).length > 7) {
      elementTwo.classList.add("d-block");
    } else {
      elementTwo.classList.remove("d-block");
    }

    setCount(e.target.value.length);
  };

  const changeHandler = (e) => {
    setSelected(e.target.value);
  };

  const getRoomIndex = async () => {
    try {
      const responseData = await AdminRoomService.adminIndex().json();
      setRoom(responseData.data);

      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const getTournamentData = async (id) => {
    try {
      const responseData = await AdminTournamentService.show(id).json();
      setTournament(responseData.data);
      setCount(responseData.data.title.length);
      setStructureData(responseData.data.structure);
      setShortHanded(
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
      // setEndDate(new Date(responseData.data.detail ? responseData.data.detail.lastday === '0000-00-00 00:00:00' ? new Date() : responseData.data.detail.lastday : new Date()))
      setEndDate(
        responseData.data
          ? responseData.data.detail.lastday === null ||
            responseData.data.detail.lastday === "0000-00-00 00:00:00"
            ? ""
            : new Date(responseData.data.detail.lastday)
          : ""
      );
      if (responseData.data.bonus_reg_date === null) {
        console.log("bonus null");
      } else {
        setBonusDate(
          responseData.data
            ? responseData.data.bonus_reg_date === "0000-00-00 00:00:00"
              ? ""
              : new Date(responseData.data.bonus_reg_date)
            : ""
        );
      }
      let lateregformat = responseData.data.detail
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

      setChampionship(
        responseData.data.detail ? responseData.data.detail.ischampionship : ""
      );
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
      // responseData.data.description.filter((element) => {
      //   return element.language === "en"
      //     ? setDescription(element.description)
      //     : element.language === "fr"
      //     ? setDescriptionFrench(element.description)
      //     : element.language === "de"
      //     ? setDescriptionDeutsch(element.description)
      //     : "";
      // });
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  apiResponse.current = getRoomIndex;
  apiResponses.current = getTournamentData;
  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      apiResponse.current();
      apiResponses.current(params.id);
    } else {
      navigate("/");
    }
  }, [params.id]);
  const handleCallback = (childData) => {
    // Update the name in the component's state
    setStructureData(childData);
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

  // const handleEditorChange = (e, language) => {
  //   setDescription(e.target.getContent());
  //   setSelectLanguage(language);
  // };
  // const handleEditorChange1 = (e, language) => {
  //   setDescriptionFrench(e.target.getContent());
  //   setSelectFrenchLanguage(language);
  // };
  // const handleEditorChange2 = (e, language) => {
  //   setDescriptionDeutsch(e.target.getContent());
  //   setSelectDeutschLanguage(language);
  // };
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
          isshorthanded: shortHanded,
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

        structure: structureData ? structureData : tournament.structure,
      };

      const responseData = await AdminTournamentService.update(userData).json();

      if (responseData.status === true) {
        setModelShow(true);
        setModalMessage(responseData.message);
        setError("");
      } else {
        setError(responseData.message)
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };
  const handleOpenTemplate = async () => {
    try {
      let responseData = await AdminTournamentService.gettemplates().json();
      setLoadData(responseData.data);
      setOpenTemplateShow(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const handleLoadTemplate = async () => {
    try {
      let responseData = await AdminTournamentService.load_template(
        RoomId
      ).json();
      // setLoadData(responseData.data)
      setStructureData(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleSaveTemplate = async (event) => {
    var userData = {
      title: room[0].title,
      structure: structureData,
    };
    try {
      let responseData = await AdminTournamentService.save_template(
        userData
      ).json();
      setModelShow(true);
      setModalMessage(responseData.message);
      setError("");
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
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
                <Link to="/admin/tournament">
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
                    <p className="description mb-10">
                      Select Room <span className="required">*</span>
                    </p>
                    <Form.Select
                      aria-label="Default select example"
                      value={
                        RoomId
                          ? RoomId
                          : tournament.room
                          ? tournament.room.id
                          : ""
                      }
                      onChange={(event) => setRoomId(event.target.value)}
                    >
                      {room.map((element) => (
                        <option key={element.id} value={element.id}>
                          {element.title}
                        </option>
                      ))}
                    </Form.Select>
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
                  </Form.Group>
                  <div className="d-flex  justify-content-end">
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
                  </div>
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
                          checked={shortHanded}
                          value={shortHanded}
                          onChange={() => {
                            setShortHanded(shortHanded ? 0 : 1);
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
                          <option value="Partly self-dealing">
                            {t(
                              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Partlyself-dealing"
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
                          className=""
                          name="bounty"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail ? tournament.detail.bounty : ""
                          }
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
                        />
                      </Form.Group>

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
                          onChange={(date) => setStartDate(date)}
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
                      <Form.Group
                        className="border-bottom form-group"
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
                        {/* <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} /> */}
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
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
                                type="text"
                                className=""
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
                        </Form.Label>
                        <Form.Control
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
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          className=""
                          name="reservedplayers"
                          pattern="[0-9]"
                          defaultValue={
                            tournament.detail
                              ? tournament.detail.reservedplayers
                              : ""
                          }
                          min="0"
                          max={
                            tournament.detail ? tournament.detail.maxplayers : 0
                          }
                        />
                        {/* <p className='error'>{Error}</p> */}
                        {/* <p className='error'>Reserved places cannot be bigger than the registered players</p> */}
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

                    {/* <Button className='me-1' variant='primary' onClick={handleSaveTemplate}>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.SaveasTemplate')}</Button> */}
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
      {openTemplateShow ? (
        <Modal show={openTemplateShow}>
          <>
            <Modal.Header>
              <Modal.Title>Templates</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group className="form-group" controlId="">
                <p className="description mb-10">
                  Template List <span className="required">*</span>
                </p>

                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  <option value="">Select Template</option>
                  {loadData.map((element) => (
                    <option value={element.id}>{element.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  handleLoadTemplate();
                  setOpenTemplateShow(false);
                }}
              >
                Load
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpenTemplateShow(false);
                }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
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
                  navigate("/admin/tournament");
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
