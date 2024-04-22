import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import customStyle from "../../Admin/customstyle";
import {
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Card,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import InputPhoneComponent from "../../../components/InputPhone/InputPhone";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./MyProfile.scss";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import MyProfileService from "../../../api/services/MyProfileService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import RoomService from "../../../api/services/RoomService";
import moment from "moment";
import { getClearPhoneNumber } from "../../../utils";

const MyPlayerProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errors, setErrors] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const eye = <FontAwesomeIcon icon={faEye}/>;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash}/>;
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
    setPasswordShown(!passwordShown);
  };

  const [passwordReShown, setPasswordReShown] = useState(false);
  const togglePasswordReVisibility = () => {
    setPasswordReShown(!passwordReShown);
  };
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);

  const [pokerCity, setPokerCity] = useState("");
  const getProfileList = async () => {
    try {
      let responseData = await MyProfileService.Show().json();
      setUserData(responseData.data);
      setData(responseData.data.room);

      let _selectedLanguage = options.filter(function (item, index) {
        return item.value === responseData.data.language;
      });
      setSelectedLanguage(_selectedLanguage);
      let selectedProfileNameOption = profileNameOption.filter(function (
        item,
        index,
      ) {
        return item.value === responseData.data.displayoption;
      });
      setDisplayOption(selectedProfileNameOption);

      setPokerCity(responseData.data.city);

      const clearPhoneNumber = getClearPhoneNumber(responseData.data.phonenumber);
      setPhoneDisplay(
        responseData.data.phonecode + clearPhoneNumber,
      );
      setPhoneCountry(responseData.data.phonecountry);
      setPhoneCode(responseData.data.phonecode);
      setPhoneNumber(clearPhoneNumber);

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
    if (localStorage.getItem("usertoken")) {
      getProfileList();
    } else {
      navigate("/");
    }
  }, []);

  function handleOnChange(value, data) {
    if (!value) {
      setPhoneCountry("");
      setPhoneCode("");
      setPhoneNumber("");
      return;
    }
    setPhoneCountry(data?.countryCode || "");
    setPhoneCode(data?.dialCode || "");
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
    } else {
      try {
        const data = await MyProfileService.update({
          email: event.target.email.value,
          firstname: event.target.firstname.value,
          lastname: event.target.lastname.value,
          dob: event.target.dob.value,
          street: event.target.street.value,
          language: selectedLanguage.value
            ? selectedLanguage.value
            : userData.language,
          nickname: event.target.nickname.value,
          city: event.target.city.value,
          zipcode: event.target.zipcode.value,
          displayoption: displayOption.value
            ? displayOption.value
            : userData.displayoption,
          phonecountry: phoneCountry,
          phonecode: phoneCode,
          phonenumber: getClearPhoneNumber(phoneNumber),
          newpassword: event.target.password.value,
        }).json();

        if (data.status === true) {
          setModalShow(true);
          setModalMessage(data.message);
          setErrors("");
        }
      } catch (error) {
        // Handle API errors
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setErrors(errorJson.message);
        }
      }
    }
  };
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      {
        name: "Room Name",
        selector: (row) => (row ? row.name : ""),
        sortable: true,
      },
      {
        name: "	Status",
        selector: (row) => (row ? row.memberlabel : ""),
        sortable: true,
      },

      {
        name: "Member until",
        selector: (row) =>
          row.memberuntill === "-"
            ? ""
            : moment(row.memberuntill).format("DD.MM.YYYY"),

        sortable: true,
      },
    ],
    [],
  );
  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="d-none d-md-flex">
          <Col className="text-center">
            <h1 className="d-block">{t("page.changeprofile")}</h1>
          </Col>
        </Row>
        <Row className="">
          {/* <Col md={2}>
                        <MyProfileLeftNavPlayers />
                    </Col> */}
          <Col md={12}>
            <Row className="d-flex d-md-none">
              <Col className="text-center">
                <h1 className="d-block">{t("page.changeprofile")}</h1>
              </Col>
            </Row>
            <div className="login-formwrap register-formwrap my-profile-formwrap">
              <Form onSubmit={handleProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="firstname"
                    >
                      <Form.Label>{t("page.registration.Name")}*</Form.Label>
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
                              {t("page.registration.Bychangingemailaddress")}
                            </Tooltip>
                          }
                        >
                          <FontAwesomeIcon icon={faQuestionCircle}/>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder={t("page.registration.E-Mail")}
                        className=""
                        name="email"
                        defaultValue={userData.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="last_name"
                    >
                      <Form.Label>{t("page.registration.Surname")}*</Form.Label>
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
                      controlId="phone_number"
                    >
                      <Form.Label>
                        {t("page.registration.Phone Number")}*
                      </Form.Label>

                      <div className="flag-select">
                        <InputPhoneComponent
                          fn={handleOnChange}
                          phonecode={phoneDisplay ? phoneDisplay : ""}
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
                              "page.registration.Street and number",
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
                                type="text"
                                placeholder="e.g. 774843"
                                className=""
                                name="zipcode"
                                defaultValue={userData.zipcode}
                                onBlur={(e) => handleZipcodeChange(e, "poker")}
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
                                onChange={(e) => setPokerCity(e.target.value)}
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
                          controlId="confirm_password"
                        >
                          <Form.Label>
                            {t("page.registration.Confirm password")}*
                          </Form.Label>
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            placeholder={t(
                              "page.registration.Confirm password",
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
                        className=" react-select-container"
                        classNamePrefix="react-select"
                        value={selectedLanguage}
                        onChange={handleLanguage}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="display_option"
                    >
                      <Form.Label>
                        {t(
                          "page.registration.Visible detail for the other players",
                        )}{" "}
                        *
                      </Form.Label>
                      <Select
                        options={profileNameOption}
                        className="  react-select-container"
                        classNamePrefix="react-select"
                        // value={displayOption}
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
          </Col>
        </Row>
        <Row className="mt-5 d-none d-md-flex">
          <Col className="text-center">
            <h1 className="d-block">{t("page.membership")}</h1>
          </Col>
        </Row>
        <Row className="">
          <Col md={12}>
            <Card>
              <Card.Header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#fff"
                >
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                Membership
              </Card.Header>
              <Card.Body>
                <DataTable
                  data={data}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader/>}
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

export default MyPlayerProfile;
