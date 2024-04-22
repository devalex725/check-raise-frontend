import React, { useState, useEffect } from "react";

import {
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import InputPhoneComponent from "../../../components/InputPhone/InputPhone";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faQuestionCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./EditPlayer.scss";

import AdminPlayerService from "../../../api/services/AdminService/AdminPlayerService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import RoomService from "../../../api/services/RoomService";
import Modal from "react-bootstrap/Modal";
import { getClearPhoneNumber } from "../../../utils";
const EditUser = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errors, setErrors] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const eye = <FontAwesomeIcon icon={faEye} />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
  const options = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
  ];
  const profileNameOption = [
    { value: "public_nic", label: "Name Surname" },
    { value: "private", label: "Nickname (If applicable)" },
    { value: "anonymous", label: "Anonymous" },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [passwordShown, setPasswordShown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [displayOption, setDisplayOption] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const params = useParams();
  const [passwordReShown, setPasswordReShown] = useState(false);
  const togglePasswordReVisibility = () => {
    setPasswordReShown(passwordReShown ? false : true);
  };
  const [phonecountry, setPhonecountry] = useState("");
  const [phonecode, setPhonecode] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [phonedisplay, setPhoneDisplay] = useState("");
  const [userData, setUserData] = useState([]);
  const [pokerCity, setPokerCity] = useState("");
  const getProfileList = async (id) => {
    try {
      let responseData = await AdminPlayerService.show(id).json();
      setUserData(responseData.data[0]);
      let selectedlanguage = options.filter(function (item) {
        return item.value === responseData.data[0].language;
      });
      setSelectedLanguage(selectedlanguage);
      let selectedProfileNameOption = profileNameOption.filter(function (
        item,
        index
      ) {
        return item.value === responseData.data[0].displayoption;
      });

      setDisplayOption(selectedProfileNameOption);

      setPokerCity(responseData.data[0].city);
      const clearPhoneNumber = getClearPhoneNumber(responseData.data[0].phonenumber || '');
      setPhoneDisplay(
        responseData.data[0].phonecode + clearPhoneNumber
      );
      setPhoneNumber(clearPhoneNumber);
      setPhonecode(responseData.data[0].phonecode);
      setPhonecountry(responseData.data[0].phonecountry);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleZipcodeChange = async (event, type) => {
    event.preventDefault();
    var code = event.target.value;
    try {
      const res = await RoomService.getCity(code).json();
      if (type === "poker") {
        setPokerCity(res.data.city);
      }
    } catch (error) {
      if (type === "poker") {
        setPokerCity("");
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getProfileList(params.id);
    } else {
      navigate("/");
    }
  }, []);

  function handleOnChange(value, data) {
    if (!value) {
      setPhonecountry("");
      setPhonecode("");
      setPhoneNumber("");
      return;
    }
    setPhonecountry(data?.countryCode || "");
    setPhonecode(data?.dialCode || "");
    setPhoneNumber(value.slice(data?.dialCode?.length));
  }
  const handleLanguage = (selectedLanguange) => {
    setSelectedLanguage(selectedLanguange);
  };
  const handleProfileOption = (displayoption) => {
    setDisplayOption(displayoption);
  };

  const handleProfile = async (event) => {
    event.preventDefault();
    if (event.target.password.value !== event.target.confirmpassword.value) {
      setErrors("Password and Confirm password not same..");
    }
    // else if (phonecountry === '') {
    //     setError("Please Enter Phonenumber..");
    // }
    else {
      var userData = {
        firstname: event.target.firstname.value,
        lastname: event.target.lastname.value,
        dob: event.target.dob.value,
        street: event.target.street.value,
        language: selectedLanguage ? selectedLanguage.value : userData.language,
        nickname: event.target.nickname.value,
        city: event.target.city.value,
        zipcode: event.target.zipcode.value,
        displayoption: displayOption
          ? displayOption.value
          : userData.displayoption,
        phonecountry: phonecountry,
        phonecode: phonecode,
        phonenumber: phonenumber,
        newpassword: event.target.password.value,
      };
      try {
        const data = await AdminPlayerService.update(
          params.id,
          userData
        ).json();

        if (data.status === true) {
          setModalShow(true);
          setModalMessage(data.message);
          setErrors("");
        } else {
          setErrors("Please Fill All Fields* ");
        }
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setErrors(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
          );
        }
      }
    }
  };
  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="">
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
                <Link to="#">All Users</Link>
                <FontAwesomeIcon icon={faArrowRight} /> Edit User
              </Card.Header>
              <Card.Body>
                <div className="login-formwrap register-formwrap my-profile-formwrap">
                  <Form onSubmit={handleProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="name"
                        >
                          <Form.Label>
                            {t("page.registration.Name")}*
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t("page.registration.Name")}
                            className=""
                            name="firstname"
                            defaultValue={userData.firstname}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group email-group"
                          controlId="email"
                        >
                          <Form.Label>
                            {t("page.registration.E-Mail")}*
                            <OverlayTrigger
                              key="top"
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">
                                  {t(
                                    "page.registration.Bychangingemailaddress"
                                  )}
                                </Tooltip>
                              }
                            >
                              <FontAwesomeIcon icon={faQuestionCircle} />
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder={t("page.registration.E-Mail")}
                            className=""
                            name="email"
                            defaultValue={userData.email}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="surname"
                        >
                          <Form.Label>
                            {t("page.registration.Surname")}*
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t("page.registration.Surname")}
                            className=""
                            name="lastname"
                            defaultValue={userData.lastname}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="phone"
                        >
                          <Form.Label>
                            {t("page.registration.Phone Number")}*
                          </Form.Label>

                          <div className="flag-select">
                            <InputPhoneComponent
                              fn={handleOnChange}
                              phonecode={phonedisplay ? phonedisplay : ""}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Row>
                          <Col md={12}>
                            <Form.Group
                              className="mb-3 form-group"
                              controlId="street"
                            >
                              <Form.Label>
                                {t("page.registration.Street and number")}*
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={t(
                                  "page.registration.Street and number"
                                )}
                                className=""
                                name="street"
                                defaultValue={userData.street}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Row>
                              <Col md={6}>
                                <Form.Group
                                  className="mb-3 form-group"
                                  controlId="zipcode"
                                >
                                  <Form.Label>
                                    {t("page.registration.ZIP code")}*
                                  </Form.Label>
                                  <Form.Control
                                    onWheel={(e) => e.target.blur()}
                                    type="number"
                                    placeholder="e.g. 774843"
                                    className=""
                                    name="zipcode"
                                    defaultValue={userData.zipcode}
                                    onBlur={(e) =>
                                      handleZipcodeChange(e, "poker")
                                    }
                                    pattern="[0-9]"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group
                                  className="mb-3 form-group"
                                  controlId="city"
                                >
                                  <Form.Label>
                                    {t("page.registration.City")}*
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="City"
                                    className=""
                                    name="city"
                                    defaultValue={pokerCity}
                                    onChange={(e) =>
                                      setPokerCity(e.target.value)
                                    }
                                    value={pokerCity}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row>
                          <Col md={12}>
                            <Form.Group
                              className="mb-3 form-group position-relative"
                              controlId="password"
                            >
                              <Form.Label>
                                {t("page.registration.Newpassword")}*
                              </Form.Label>
                              <Form.Control
                                type={passwordReShown ? "text" : "password"}
                                placeholder={t("page.registration.Newpassword")}
                                className=""
                                name="password"
                              />
                              <span className="faEye-icon">
                                <i onClick={togglePasswordReVisibility}>
                                  {passwordReShown ? eye : eyeSlash}
                                </i>
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group
                              className="mb-3 form-group position-relative"
                              controlId="confirmpassword"
                            >
                              <Form.Label>
                                {t("page.registration.Confirm password")}*
                              </Form.Label>
                              <Form.Control
                                type={passwordShown ? "text" : "password"}
                                placeholder={t(
                                  "page.registration.Confirm password"
                                )}
                                className=""
                                name="confirmpassword"
                              />
                              <span className="faEye-icon">
                                <i onClick={togglePasswordVisibility}>
                                  {passwordShown ? eye : eyeSlash}
                                </i>
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3 form-group" controlId="dob">
                          <Form.Label>
                            {t("page.registration.Date of birth")}*
                          </Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="DD.MM.YYYY"
                            className=""
                            name="dob"
                            defaultValue={userData.dob}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="nickname"
                        >
                          <Form.Label>
                            {t("page.managerRegister.Nickname")}*
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t("page.managerRegister.Enterprise")}
                            className=""
                            name="nickname"
                            defaultValue={userData.nickname}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="language"
                        >
                          <Form.Label>
                            {t("page.registration.Language")}*
                          </Form.Label>
                          <Select
                            options={options}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            value={selectedLanguage}
                            onChange={handleLanguage}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="mb-3 form-group"
                          controlId="display"
                        >
                          <Form.Label>
                            {t(
                              "page.registration.Visible detail for the other players"
                            )}{" "}
                            *
                          </Form.Label>
                          <Select
                            options={profileNameOption}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            value={displayOption}
                            onChange={handleProfileOption}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12} className="text-center mt-1">
                        <p
                          className="success"
                          style={{ color: `white`, display: `none` }}
                        >
                          {t("page.registration.Success")}
                        </p>
                        {errors ? (
                          <p className="error" style={{ color: `red` }}>
                            {errors}
                          </p>
                        ) : (
                          ""
                        )}

                        <Button
                          type="submit"
                          className=" btn btn-primary btn-submit"
                        >
                          {t("page.registration.Save")}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
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
    </>
  );
};

export default EditUser;
