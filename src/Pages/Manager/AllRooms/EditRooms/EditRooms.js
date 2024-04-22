import React, { useEffect, useState } from "react";
import MyProfileLeftNav from "../../../../components/MyProfileLeftNav/MyProfileLeftNav";
import { Row, Col, Card, Form, Button, Image, Modal } from "react-bootstrap";
import InputPhoneComponent from "../../../../components/InputPhone/InputPhone";
import "../../../../assets/flag.css";
import LogoAnimationLoader from "../../../../components/Loading/LogoAnimationLoader";
import MultiLangTinyEditor from "../../../../components/MultiLangTinyEditor/MultiLangTinyEditor";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RoomService from "../../../../api/services/RoomService";
import { getClearPhoneNumber } from "../../../../utils";

const EditRooms = () => {
  const imageUrl = process.env.REACT_APP_ROOM_LOCAL_IMAGE_URL;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isManagerLogin, setIsManagerLogin] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [canton, setCanton] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState("");
  const [pokerCity, setPokerCity] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [ModalShow, setModalShow] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [activeLanguages, setActiveLanguages] = useState(["en", "fr", "de"]);
  const [description, setDescription] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const Canton = [
    { value: "AG", label: "AG" },
    { value: "AI", label: "AI" },
    { value: "AR", label: "AR" },
    {
      value: "BE",
      label: "BE",
    },
    { value: "BL", label: "BL" },
    { value: "BS", label: "BS" },
    { value: "FR", label: "FR" },
    {
      value: "GE",
      label: "GE",
    },
    { value: "GL", label: "GL" },
    { value: "GR", label: "GR" },
    { value: "JU", label: "JU" },
    {
      value: "LU",
      label: "LU",
    },
    { value: "NE", label: "NE" },
    { value: "NW", label: "NW" },
    { value: "OW", label: "OW" },
    {
      value: "SG",
      label: "SG",
    },
    { value: "SH", label: "SH" },
    { value: "SO", label: "SO" },
    { value: "SZ", label: "SZ" },
    {
      value: "TG",
      label: "TG",
    },
    { value: "TI", label: "TI" },
    { value: "UR", label: "UR" },
    { value: "VD", label: "VD" },
    {
      value: "VS",
      label: "VS",
    },
    { value: "ZG", label: "ZG" },
    { value: "ZH", label: "ZH" },
  ];
  const [roomData, setRoomData] = useState([]);
  const handleCanton = (canton) => {
    setCanton(canton.target.value);
  };
  const getRoomList = async () => {
    try {
      let getApi = await RoomService.index().json();
      setIsLoading(false);
      setRoomId(getApi.data[0].id ? getApi.data[0].id : "");

      const responseData = await RoomService.user(getApi.data[0].id).json();

      setRoomData(responseData.data ? responseData.data : "");

      const clearPhoneNumber = getClearPhoneNumber(responseData.data.detail.phone || '');
      setPhoneDisplay(
        responseData.data && responseData.data.detail.phone
          ? responseData.data.detail.phonecode + clearPhoneNumber
          : ""
      );
      setPhoneNumber(clearPhoneNumber);
      setPokerCity(
        responseData.data && responseData.data.detail
          ? responseData.data.detail.city
          : ""
      );

      setCanton(
        responseData.data && responseData.data.detail
          ? responseData.data.detail.canton
          : ""
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
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    // let decoded = base64_decode(roomData.detail ? roomData.detail.logo:'');
    // console.log(decoded)
    getRoomList();
    if (localStorage.getItem("usertoken")) {
      localStorage.getItem("usertype") == "Room Manager"
        ? setIsManagerLogin(true)
        : setIsManagerLogin(false);
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

  function handleChangeImage(e) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);

    fileReader.onload = () => {
      var image = fileReader.result;
      setFile(image);
    };
  }

  const handleZipCodeChange = async (event, type) => {
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

  const handleEditRoom = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const userData = {
        room: {
          id: roomId,
          title: event.target.title.value,
          slug: event.target.slug.value,
        },

        details: {
          logo: file ? file : roomData.detail ? roomData.detail.logo : "",
          street: event.target.street.value,
          zipcode: event.target.zipcode.value,
          town: event.target.town.value,
          city: event.target.city.value,
          canton: canton,
          contact: event.target.contact.value,

          phone: phoneNumber || "",
          phonecode: phoneCode || "",
          phonecountry: phoneCountry || "",

          website: event.target.website.value,
          activelanguages: activeLanguages,
        },

        descriptions: [
          { language: "en", description: description.en || "" },
          { language: "fr", description: description.fr || "" },
          { language: "de", description: description.de || "" },
        ],
      };

      const data = await RoomService.update(userData).json();
      setIsSaving(false);
      if (data.status === true) {
        setModalShow(true);
        setModalMessage(data.message);
        setError("");
      }
    } catch (error) {
      setIsSaving(false);
      // Handle API errors
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (roomData.status > 2 || roomData.status < 1) return;

      setIsSaving(true);
      const newStatus = roomData.status === 1 ? 2 : 1;
      await RoomService.updateStatus(newStatus).json();

      setIsSaving(false);
      setRoomData((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      setIsSaving(false);

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
          <Col md={2}>
            {
              isManagerLogin === false ? <MyProfileLeftNav /> : ""
              //  <MyProfileLeftNavManager />
            }
          </Col>
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
                Edit Room
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleEditRoom}>
                  <Form.Group className="mb-3 form-group" controlId="title">
                    <Form.Label>
                      Name of the room<span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      className=""
                      defaultValue={roomData.title}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3 form-group" controlId="street">
                    <Form.Label>
                      {t("page.registration.Street and number")}
                      <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      defaultValue={
                        roomData.detail ? roomData.detail.street : ""
                      }
                      placeholder={t("page.registration.Street and number")}
                      className=""
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 form-group"
                    controlId="slug"
                    style={{ display: "none" }}
                  >
                    <Form.Label>
                      Slug<span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="slug"
                      className=""
                      defaultValue={roomData.slug}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="zipcode">
                    <Form.Label>
                      {t("page.registration.ZIP code")}
                      <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="zipcode"
                      placeholder="e.g. 774843"
                      className=""
                      defaultValue={
                        roomData.detail ? roomData.detail.zipcode : ""
                      }
                      onBlur={(e) => handleZipCodeChange(e, "poker")}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="city">
                    <Form.Label>
                      {t("page.registration.City")}{" "}
                      <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="City"
                      className=""
                      onChange={(e) => setPokerCity(e.target.value)}
                      value={pokerCity}
                    />
                  </Form.Group>

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

                  <Form.Group className="mb-3 form-group">
                    <Form.Label>
                      Description<span className="required">*</span>
                    </Form.Label>
                    {description && (
                      <MultiLangTinyEditor
                        name="description"
                        initialValue={description}
                        onChange={({ value }) => setDescription(value)}
                        activeLanguages={activeLanguages}
                      />
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="">
                    <Form.Label>Logo</Form.Label>
                    <div className="image-wrap">
                      <Form.Control
                        type="file"
                        name="logo"
                        placeholder=""
                        className=""
                        onChange={handleChangeImage}
                      />
                      <Image
                        id="canvas"
                        src={
                          file
                            ? file
                            : roomData.detail
                            ? imageUrl + roomData.detail.logo
                            : ""
                        }
                        fluid
                      />
                    </div>
                  </Form.Group>

                  <Form.Group
                    className="mb-3 form-group"
                    controlId="town"
                    style={{ display: "none" }}
                  >
                    <Form.Label>
                      Town<span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="town"
                      placeholder=""
                      className=""
                      defaultValue={roomData.detail ? roomData.detail.town : ""}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="name">
                    <Form.Label>
                      Canton<span className="required">*</span>
                    </Form.Label>

                    <Form.Select onChange={handleCanton} value={canton}>
                      {Canton.map((element) => (
                        <option key={element.value} value={element.value}>
                          {element.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group
                    className="mb-3 form-group"
                    controlId="phonenumber"
                  >
                    <Form.Label>
                      {t("page.registration.Phone Number")}
                    </Form.Label>

                    <div className="flag-select">
                      <InputPhoneComponent
                        fn={handleOnChange}
                        phonecode={phoneDisplay}
                        phoneCountry={phoneCountry}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="website">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      className=""
                      name="website"
                      defaultValue={
                        roomData.detail ? roomData.detail.website : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="contact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      className=""
                      name="contact"
                      defaultValue={
                        roomData.detail ? roomData.detail.contact : ""
                      }
                    />
                  </Form.Group>

                  <p className="error">{Error}</p>

                  <Form.Group className="form-group text-end" controlId="">
                    {roomData.status === 1 || roomData.status === 2 ? (
                      <Button
                        onClick={handleUpdateStatus}
                        variant={roomData.status === 1 ? "danger" : "info"}
                        disabled={isSaving}
                      >
                        {roomData.status === 1 ? "Deactivate" : "Activate"}
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button
                      className="btn btn-primary ms-2"
                      type="submit"
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </Form.Group>
                  {/* <Form.Group className="form-group text-end" controlId="">
                                        <Button variant="warning" className='btn-sm ms-2' type='reset'>Cancel</Button>
                                    </Form.Group> */}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
      {ModalShow ? (
        <Modal show={ModalShow}>
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
                  // navigate('/manager/my-tournaments');
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

export default EditRooms;
