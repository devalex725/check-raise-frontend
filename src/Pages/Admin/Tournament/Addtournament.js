import React, { useRef, useState, useEffect } from "react";

import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./AddTournament.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TableRow from "./Table";
import { Editor } from "@tinymce/tinymce-react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import "react-datepicker/dist/react-datepicker.css";
import AdminRoomService from "../../../api/services/AdminService/AdminRoomService";
import AdminTournamentService from "../../../api/services/AdminService/AdminTournamentService";
import moment from "moment";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import MultiLangTinyEditor from "../../../components/MultiLangTinyEditor/MultiLangTinyEditor";

const AddTournament = () => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [count, setCount] = React.useState(0);
  const [LoadStructureRoomId, SetLoadStructureRoomId] = useState("");
  const [maxplayers, setMaxPlayer] = useState("");
  const [RoomData, setRoomData] = useState([]);
  const [RoomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalSuccessShow, setModalSuccessShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [structureData, setStructureData] = useState([]);
  const [loadData, setLoadData] = useState([]);
  const [Type, setType] = useState();
  const [Error, setError] = useState();
  const [Dealer, setDealer] = useState();
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [bonusDate, setBonusDate] = useState();
  // setHours(setMinutes(new Date(), 30), 16)
  const languageValue = i18n;
  const [endDate, setEndDate] = useState(
    ""
    // setHours(setMinutes(new Date(), 30), 16)
  );
  const [titleModal, setTitleModal] = useState(false);
  const [titleTemplate, setTitleTemplate] = useState("");
  const [activeLanguages, setActiveLanguages] = useState(["en", "fr", "de"]);
  const [description, setDescription] = useState({ en: "", fr: "", de: "" });
  //   const [description, setDescription] = useState("");
  //   const [descriptionFrench, setDescriptionFrench] = useState("");
  //   const [descriptionDeutsch, setDescriptionDeutsch] = useState("");
  //   const [selectLanguage, setSelectLanguage] = useState("");
  //   const [selectFrenchLanguage, setSelectFrenchLanguage] = useState("");
  //   const [selectDeutschLanguage, setSelectDeutschLanguage] = useState("");
  const [isShortHanded, setIsShortHanded] = useState(0);
  const [isChampionship, setIsChampionship] = useState(0);
  const [saveModal, setSaveModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const handleChange = (e) => {
    const element = document.getElementsByClassName(
      "custom-error-message-chr"
    )[0];
    const elementTwo = document.getElementsByClassName(
      "custom-error-message-capital"
    )[0];
    let newText =
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

    setCount(e.target.value.length);
  };

  const [checked, setSelected] = useState("checked");

  const changeHandler = (e) => {
    setSelected(e.target.value);
  };
  const getRoomIndex = async () => {
    try {
      let responseData = await AdminRoomService.adminIndex().json();
      setRoomData(responseData.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getRoomIndex();
    } else {
      navigate("/");
    }
  }, []);
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

  //   const handleEditorChange = (e, language) => {
  //     setDescription(e.target.getContent());
  //     setSelectLanguage(language);
  //   };
  //   const handleEditorChange1 = (e, language) => {
  //     setDescriptionFrench(e.target.getContent());
  //     setSelectFrenchLanguage(language);
  //   };
  //   const handleEditorChange2 = (e, language) => {
  //     setDescriptionDeutsch(e.target.getContent());
  //     setSelectDeutschLanguage(language);
  //   };
  const handleChangeTitle = (event) => {
    const value = event.target.value;
    setTitleTemplate(value);
  };
  const handleSaveTemplate = async (event) => {
    if (titleTemplate === "") {
      setError("Please Fill Template Name*");
    }
    // var userData = {
    //     title: event.target.title,
    //     structure: structureData,
    //     room_id: LoadStructureRoomId
    // }
    var userData = {
      title: titleTemplate,
      structure: structureData,
      room_id: LoadStructureRoomId ? LoadStructureRoomId : 0,
    };
    try {
      let responseData = await AdminTournamentService.save_template(
        userData
      ).json();
      setTitleModal(false);
      setSaveModal(true);
      setSaveMessage(responseData.message);
      setError("");
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
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
    } else if ((title.match(/[A-Z]/g) || []).length >= 7) {
      titleError = t(
        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycapital"
      );
    } else if (!title.match(/^[A-Za-z0-9,. +\-/\\()'@&]{1,35}$/g)) {
      titleError = "Only letters, numbers and +-/\\()'@&,. are allowed.";
    }

    if (RoomId === "") {
      setError("Please Select Room *");
      return;
    }

    if (titleError) {
      setError(titleError);
      return;
    }

    try {
      const userData = {
        tournament: {
          title,
          room_id: RoomId,
        },
        details: {
          type: Type ? Type : "Holdem",
          isshorthanded: isShortHanded,
          ischampionship: isChampionship,
          dealertype: Dealer ? Dealer : "Dealers",
          buyin: event.target.buyin.value,
          bounty: event.target.bounty.value,
          rake: event.target.rake.value,
          maxreentries: event.target.maxreentries.value,
          // startday: moment(startDate).format('YYYY-MM-DD HH:mm') ? moment(startDate).format('YYYY-MM-DD HH:mm') :'',
          // bonus: moment(bonusDate).format('YYYY-MM-DD HH:mm') ? moment(bonusDate).format('YYYY-MM-DD HH:mm') :'',
          // lastday: moment(endDate).format('YYYY-MM-DD HH:mm') ? moment(endDate).format('YYYY-MM-DD HH:mm') :'',
          startday: moment(startDate).format("YYYY-MM-DD HH:mm"),
          bonus: bonusDate ? moment(bonusDate).format("YYYY-MM-DD HH:mm") : "",
          lastday: endDate ? moment(endDate).format("YYYY-MM-DD HH:mm") : "",
          lateregformat: checked,
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
        structure: structureData ? structureData : "",
      };

      const responseData = await AdminTournamentService.store(userData).json();
      if (responseData.status == true) {
        setModalMessage("Tournament Create Successfully!!!");
        setError("");
        setModalSuccessShow(true);
      } else {
        setError(responseData.message)
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        if (errorJson.message === 'Undefined array key "structure"') {
          setError("Please Fill Structure *");
        } else {
          setError(errorJson.message);
        }
      }
    }
  };
  const handleOpenTemplate = async () => {
    try {
      let responseData = await AdminTournamentService.gettemplates().json();
      setLoadData(responseData.data);
      setModalShow(true);
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
        LoadStructureRoomId
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
                {t("page.myprofile.myprofilenav.All tournaments.Addtournament")}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group" controlId="">
                    <p className="description mb-10">
                      Select Room <span className="required">*</span>
                    </p>

                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => setRoomId(e.target.value)}
                    >
                      {/* <option value=''>Select Room</option> */}
                      {RoomData.map((element) => (
                        <option key={element.id} value={element.id}>{element.title}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="form-group" controlId="">
                    <p className="description mb-10">
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.description"
                      )}
                      <span className="required">*</span>
                    </p>
                    <Form.Control
                      type="text"
                      className=""
                      name="title"
                      maxLength={34}
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
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Type
                          </option>
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
                          checked={isShortHanded}
                          onChange={() => setIsShortHanded((prev) => !prev)}
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
                          checked={isChampionship}
                          onChange={() => setIsChampionship((prev) => !prev)}
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
                          onChange={(e) => setDealer(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Dealers
                          </option>
                          <option value="Dealers">
                            {t(
                              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Dealers"
                            )}
                          </option>
                          <option value="Self">
                            {t(
                              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.Self-dealing"
                            )}
                          </option>
                          <option value="Partly">
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
                          value={maxplayers}
                          onChange={(e) => setMaxPlayer(e.target.value)}
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
                          min="0"
                          max={maxplayers}
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
                        structure={structureData ? structureData : ""}
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
                      <MultiLangTinyEditor
                        name="description"
                        initialValue={description}
                        onChange={({ value }) => setDescription(value)}
                        activeLanguages={activeLanguages}
                      />
                      {/* <Tabs
                        defaultActiveKey="English"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        <Tab eventKey="English" title="English">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            onInit={(event, editor) =>
                              (editorRef.current = editor)
                            }
                            name="description"
                            onChange={(e) => handleEditorChange(e, "en")}
                          />
                        </Tab>
                        <Tab eventKey="French" title="French">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            onInit={(event, editor) =>
                              (editorRef.current = editor)
                            }
                            name="descriptionFrench"
                            onChange={(e) => handleEditorChange1(e, "fr")}
                          />
                        </Tab>
                        <Tab eventKey="Deutsch" title="Deutsch">
                          <Editor
                            apiKey={process.env.REACT_APP_EDITOR_KEY}
                            onInit={(event, editor) =>
                              (editorRef.current = editor)
                            }
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
                      save
                    </Button>

                    <Button
                      className="me-1"
                      variant="primary"
                      // onClick={handleSaveTemplate}
                      onClick={() => setTitleModal(true)}
                    >
                      {t(
                        "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.SaveasTemplate"
                      )}
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
      {titleModal ? (
        <Modal show={titleModal}>
          <>
            <Modal.Header>
              <Modal.Title>Template Name</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <input type="text" onChange={handleChangeTitle} />
              <p className="error">{Error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  handleSaveTemplate();
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setTitleModal(false);
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
      {modalShow ? (
        <Modal show={modalShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group className="form-group" controlId="">
                <p className="description mb-10">
                  Template List<span className="required">*</span>
                </p>

                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => SetLoadStructureRoomId(e.target.value)}
                >
                  <option value="">Select Template</option>
                  {loadData.map((element) => (
                    <option key={element.id} value={element.id}>{element.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  handleLoadTemplate();
                  setModalShow(false);
                }}
              >
                Okay
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
      {modalSuccessShow ? (
        <Modal show={modalSuccessShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalSuccessShow(false);
                  navigate("/admin/tournament");
                }}
              >
                Okay
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ""
      )}
      {saveModal ? (
        <Modal show={saveModal}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{saveMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setSaveModal(false);
                }}
              >
                Okay
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

export default AddTournament;
