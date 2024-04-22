import React, { useEffect, useState } from "react";

import { Row, Col, Card, Form, Image, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import InputPhoneComponent from "../../../../components/InputPhone/InputPhone";
import LogoAnimationLoader from "../../../../components/Loading/LogoAnimationLoader";
import AdminRoomService from "../../../../api/services/AdminService/AdminRoomService";
import moment from "moment";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import MultiLangTinyEditor from "../../../../components/MultiLangTinyEditor/MultiLangTinyEditor";
import { getClearPhoneNumber } from "../../../../utils";
var imageUrl = process.env.REACT_APP_ROOM_IMAGE_URL;
const EditRooms = () => {
  const params = useParams();
  const [activeLanguages, setActiveLanguages] = useState(["en", "fr", "de"]);
  const [description, setDescription] = useState(null);

  const [file, setFile] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModelShow] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [canton, setCanton] = useState("");
  const [Error, setError] = useState("");
  const options = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
  ];
  const Canton = [
    { value: "AG", label: "AG" },
    { value: "AI", label: "AI" },
    { value: "AR", label: "AR" },
    { value: "BE", label: "BE" },
    { value: "BL", label: "BL" },
    { value: "BS", label: "BS" },
    { value: "FR", label: "FR" },
    { value: "GE", label: "GE" },
    { value: "GL", label: "GL" },
    { value: "GR", label: "GR" },
    { value: "JU", label: "JU" },
    { value: "LU", label: "LU" },
    { value: "NE", label: "NE" },
    { value: "NW", label: "NW" },
    { value: "OW", label: "OW" },
    { value: "SG", label: "SG" },
    { value: "SH", label: "SH" },
    { value: "SO", label: "SO" },
    { value: "SZ", label: "SZ" },
    { value: "TG", label: "TG" },
    { value: "TI", label: "TI" },
    { value: "UR", label: "UR" },
    { value: "VD", label: "VD" },
    { value: "VS", label: "VS" },
    { value: "ZG", label: "ZG" },
    { value: "ZH", label: "ZH" },
  ];
  const [roomData, setRoomData] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [expiryDate, setExpiryDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  function handleChangeImage(e) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      var image = fileReader.result;
      setFile(image);
    };
  }

  const handleCanton = (canton) => {
    setCanton(canton.target.value);
  };
  const getRoomById = async () => {
    try {
      const responseData = await AdminRoomService.adminShowById(
        params.id
      ).json();
      setRoomData(responseData.data);
      setIsLoading(false);
      if (responseData.data.detail && responseData.data.detail.phone === null) {
        setPhoneDisplay("");
      } else {
        const clearPhoneNumber = getClearPhoneNumber(responseData.data.detail.phone || '');
        setPhoneDisplay(
          responseData.data && responseData.data.detail
            ? responseData.data.detail.phonecode + clearPhoneNumber
            : ""
        );
        setPhoneCode(responseData.data.detail.phonecode)
        setPhoneCountry(responseData.data.detail.phonecountry)
        setPhoneNumber(clearPhoneNumber)
      }

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

      if (responseData.data && responseData.data.expiry === null) {
        setExpiryDate(new Date());
      } else {
        setExpiryDate(
          new Date(
            responseData.data && responseData.data.expiry
              ? responseData.data &&
                responseData.data.expiry === "0000-00-00 00:00:00"
                ? new Date()
                : responseData.data && responseData.data.expiry
              : new Date()
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      var id = params.id;
      getRoomById(id);
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
      const data = await AdminRoomService.adminUpdateRoom({
        room: {
          id: roomData.id,
          title: event.target.title.value,
          expiry: moment(expiryDate).format("YYYY-MM-DD HH:mm"),
          credits: event.target.credits.value,
          buyuinlimit: event.target.buyuinlimit.value,
          maxnumberoftournament: event.target.maxnumberoftournament.value,
          maxnumberoftopbanner: event.target.maxnumberoftopbanner.value,
          maxnumberofbottombanner: event.target.maxnumberofbottombanner.value,
          maxnumberofpremium: event.target.maxnumberofpremium.value,
          latearrivaldelay: event.target.latearrivaldelay.value,
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
      }).json();

      if (data.status === true) {
        setModelShow(true);
        setModalMessage("Room Update Successfully");
        setError("");
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <h1 className="ms-2">Room Edit</h1>
      </nav>
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
                Edit Room
              </Card.Header>
              <Card.Body>
                {roomData?.id ? (
                  <Form onSubmit={handleEditRoom}>
                    <Form.Group className="mb-3 form-group" controlId="title">
                      <Form.Label>
                        Name of the room <span className="required">*</span>
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
                        defaultValue={
                          roomData.detail ? roomData.detail.city : ""
                        }
                        className=""
                        placeholder="City"
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
                      <Form.Label>
                        Logo<span></span>
                      </Form.Label>
                      <div className="image-wrap">
                        <div className="action-hover">
                          <span className="action-edit">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 512 512"
                              fill="#fff"
                            >
                              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                            </svg>
                          </span>
                          <span className="action-remove">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 384 512"
                              fill="#fff"
                            >
                              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                          </span>
                        </div>

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
                            // roomData.detail
                            //     ? imageUrl + roomData.detail.logo
                            //     : file
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
                        defaultValue={
                          roomData.detail ? roomData.detail.town : ""
                        }
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
                        <span></span>
                      </Form.Label>
                      <div className="d-flex w-100 flex-wrap flex-lg-nowrap">
                        <div className="flag-select">
                          <InputPhoneComponent
                            fn={handleOnChange}
                            phonecode={phoneDisplay}
                          />
                        </div>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3 form-group" controlId="website">
                      <Form.Label>
                        Website<span></span>
                      </Form.Label>
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
                      <Form.Label>
                        Contact<span></span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className=""
                        name="contact"
                        defaultValue={
                          roomData.detail ? roomData.detail.contact : ""
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="expiry">
                      <Form.Label>
                        Subscription<span className="required">*</span>
                      </Form.Label>
                      {/* <Form.Control
                                            type="date"
                                            className=''
                                            name="expiry"
                                            defaultValue={roomData.expiry ? roomData.expiry : ''}
                                            required
                                        /> */}
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
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
                    <Form.Group className="mb-3 form-group" controlId="credits">
                      <Form.Label>
                        Credits<span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        name="credits"
                        defaultValue={roomData.credits ? roomData.credits : 0}
                        min={0}
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="buyuinlimit"
                    >
                      <Form.Label>
                        Buy In limit<span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="buyuinlimit"
                        defaultValue={
                          roomData.buyuinlimit ? roomData.buyuinlimit : 0
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="maxnumberoftournament"
                    >
                      <Form.Label>
                        Max Number Of Tournament
                        <span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="maxnumberoftournament"
                        defaultValue={
                          roomData.maxnumberoftournament
                            ? roomData.maxnumberoftournament
                            : 0
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="maxnumberoftopbanner"
                    >
                      <Form.Label>
                        Max Number Of Top banner
                        <span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="maxnumberoftopbanner"
                        defaultValue={
                          roomData.maxnumberoftopbanner
                            ? roomData.maxnumberoftopbanner
                            : 0
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="maxnumberofbottombanner"
                    >
                      <Form.Label>
                        Max Number Of CENTRAL banner
                        <span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="maxnumberofbottombanner"
                        defaultValue={
                          roomData.maxnumberofbottombanner
                            ? roomData.maxnumberofbottombanner
                            : 0
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="maxnumberofpremium"
                    >
                      <Form.Label>
                        Max Number Of Premium<span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="maxnumberofpremium"
                        defaultValue={
                          roomData.maxnumberofpremium
                            ? roomData.maxnumberofpremium
                            : 0
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 form-group"
                      controlId="latearrivaldelay"
                    >
                      <Form.Label>
                        Late Arrival Delay<span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        className=""
                        name="latearrivaldelay"
                        defaultValue={
                          roomData.latearrivaldelay
                            ? roomData.latearrivaldelay
                            : 0
                        }
                        required
                      />
                    </Form.Group>
                    <p className="error">{Error}</p>
                    <Form.Group className="form-group text-end" controlId="">
                      <Button className="btn btn-primary" type="submit">
                        Save
                      </Button>
                    </Form.Group>

                    {/* <Form.Group className="form-group text-end" controlId="">
                                        <Button variant="warning" className='btn-sm ms-2' type='reset'>Cancel</Button>
                                    </Form.Group> */}
                  </Form>
                ) : (
                  ""
                )}
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
                  navigate("/admin/room");
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

export default EditRooms;
