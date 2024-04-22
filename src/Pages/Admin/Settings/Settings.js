import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Table, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

import "./Settings.scss";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import AdminSettingService from "../../../api/services/AdminService/AdminSettingService";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Editor } from "@tinymce/tinymce-react";

const AdminSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [importBanner, setImportBanner] = useState(0);
  const [settingList, setSettingList] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [editorShow, setEditorShow] = useState(false);

  const [chooseLanguage, setChooseLanguage] = useState("");

  const [errors, setErrors] = useState("");
  const [englishLanguage, setEnglishLanguage] = useState("");
  const [FrenchLanguage, setFrenchLanguage] = useState("");
  const [DutchLanguage, setDutchLanguage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const getSettingList = async () => {
    try {
      const settingResponse = await AdminSettingService.SettingIndex().json();
      setSettingList(settingResponse.data);
      setImportBanner(settingResponse.data[0].is_important_message_banner);
      setEnglishLanguage(settingResponse.data[0].en_msg_banner);
      setFrenchLanguage(settingResponse.data[0].fr_msg_banner);
      setDutchLanguage(settingResponse.data[0].db_msg_banner);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getSettingList();
    } else {
      navigate("/");
    }
  }, []);
  const handleEditorChange = (e) => {
    setEnglishLanguage(e.target.getContent());
  };
  const handleEditorChange1 = (e) => {
    setDutchLanguage(e.target.getContent());
  };
  const handleEditorChange2 = (e) => {
    setFrenchLanguage(e.target.getContent());
  };
  const handleLanguages = (e) => {
    setChooseLanguage(e);

    setEditorShow(true);
  };
  const handleSetting = async (event) => {
    event.preventDefault();

    try {
      var userData = {
        is_important_message_banner: importBanner,
        en_msg_banner: englishLanguage
          ? englishLanguage
          : settingList[0].en_msg_banner,
        fr_msg_banner: FrenchLanguage
          ? FrenchLanguage
          : settingList[0].fr_msg_banner,
        db_msg_banner: DutchLanguage
          ? DutchLanguage
          : settingList[0].db_msg_banner,
        adv_top_banner: settingList[0].adv_top_banner,
        adv_bottom_banner: settingList[0].adv_bottom_banner,
        is_premium_tournament: settingList[0].is_premium_tournament,
        is_paypal: settingList[0].is_paypal,
        paypal_link: settingList[0].paypal_link,

        top_banner_credit: settingList[0].top_banner_credit,
        top_banner_credit_discount: settingList[0].top_banner_credit_discount,
        bottom_banner_credit: settingList[0].bottom_banner_credit,
        bottom_banner_credit_discount:
          settingList[0].bottom_banner_credit_discount,
        premium_banner_credit: settingList[0].premium_banner_credit,
        premium_banner_credit_discount:
          settingList[0].premium_banner_credit_discount,
        is_banner_0: settingList[0].is_banner_0,
        is_banner_1: settingList[0].is_banner_1,
        is_banner_2: settingList[0].is_banner_2,
        is_banner_3: settingList[0].is_banner_3,
        default_banner_bottom: settingList[0].default_banner_bottom,
        default_banner_bottom_link: settingList[0].default_banner_bottom_link,
        default_banner_top: settingList[0].default_banner_top,
        default_banner_top_link: settingList[0].default_banner_top_link,
        rolling_time_bottom: settingList[0].rolling_time_bottom,
        rolling_time_top: settingList[0].rolling_time_top,
      };

      const data = await AdminSettingService.Settingupdate(
        settingList[0].id,
        userData
      ).json();

      if (data.status === true) {
        setModalShow(true);
        setModalMessage(data.msg);
        setErrors("");
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };
  const handleEdit = async () => {
    try {
      var userData = {
        is_important_message_banner: importBanner,
        en_msg_banner: englishLanguage
          ? englishLanguage
          : settingList[0].en_msg_banner,
        fr_msg_banner: FrenchLanguage
          ? FrenchLanguage
          : settingList[0].fr_msg_banner,
        db_msg_banner: DutchLanguage
          ? DutchLanguage
          : settingList[0].db_msg_banner,
        adv_top_banner: settingList[0].adv_top_banner,
        adv_bottom_banner: settingList[0].adv_bottom_banner,
        is_premium_tournament: settingList[0].is_premium_tournament,
        is_paypal: settingList[0].is_paypal,
        paypal_link: settingList[0].paypal_link,

        top_banner_credit: settingList[0].top_banner_credit,
        top_banner_credit_discount: settingList[0].top_banner_credit_discount,
        bottom_banner_credit: settingList[0].bottom_banner_credit,
        bottom_banner_credit_discount:
          settingList[0].bottom_banner_credit_discount,
        premium_banner_credit: settingList[0].premium_banner_credit,
        premium_banner_credit_discount:
          settingList[0].premium_banner_credit_discount,
        is_banner_0: settingList[0].is_banner_0,
        is_banner_1: settingList[0].is_banner_1,
        is_banner_2: settingList[0].is_banner_2,
        is_banner_3: settingList[0].is_banner_3,
        default_banner_bottom: settingList[0].default_banner_bottom,
        default_banner_bottom_link: settingList[0].default_banner_bottom_link,
        default_banner_top: settingList[0].default_banner_top,
        default_banner_top_link: settingList[0].default_banner_top_link,
        rolling_time_bottom: settingList[0].rolling_time_bottom,
        rolling_time_top: settingList[0].rolling_time_top,
      };

      const data = await AdminSettingService.Settingupdate(
        settingList[0].id,
        userData
      ).json();

      if (data.status === true) {
        setModalShow(true);
        setModalMessage(data.msg);
        setErrors("");
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Settings Page</h1>
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
                Settings
              </Card.Header>
              <Card.Body>
                {settingList.map((element) => {
                  return (
                    <>
                      <Form onSubmit={handleSetting}>
                        <Form.Group className="form-group" controlId="">
                          <Form.Group
                            className="border-bottom form-group"
                            controlId=""
                          >
                            <Form.Label>Display Message Banner</Form.Label>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label=""
                              checked={importBanner}
                              value={importBanner}
                              onChange={() => {
                                setImportBanner(importBanner ? 0 : 1);
                              }}
                            />
                          </Form.Group>
                        </Form.Group>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="width-auto text-center">
                                Languages
                              </th>
                              <th className="width-auto text-center">
                                Description
                              </th>
                              <th className="width-auto text-center">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr style={{ textAlign: "center" }}>
                              <td>English</td>
                              <td>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: element.en_msg_banner,
                                  }}
                                />
                              </td>
                              <td>
                                <Link
                                  className="action-link green-link"
                                  onClick={(e) => handleLanguages("EN")}
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                              <td>French</td>
                              <td>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: element.fr_msg_banner,
                                  }}
                                />
                              </td>
                              <td>
                                <Link
                                  className="action-link green-link"
                                  onClick={(e) => handleLanguages("FR")}
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                              <td>Dutch</td>
                              <td>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: element.db_msg_banner,
                                  }}
                                />
                              </td>
                              <td>
                                <Link
                                  className="action-link green-link"
                                  onClick={() => handleLanguages("DE")}
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>

                        <p>{errors}</p>
                        <Col sm={12} className="text-end">
                          <Button
                            type="submit"
                            className=" btn btn-primary btn-submit"
                          >
                            {t("page.myprofile.myprofilenav.Newsletters.Save")}
                          </Button>
                        </Col>
                      </Form>
                    </>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}

      <Modal show={editorShow}>
        <>
          <Modal.Header>
            <Modal.Title>Saved</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Title"}
                  name="title"
                  defaultValue={
                    chooseLanguage === "EN"
                      ? "English"
                      : "Dutch" && chooseLanguage === "FR"
                      ? "French"
                      : "Dutch" && chooseLanguage === "DE"
                      ? "Dutch"
                      : ""
                  }
                />
              </Form.Group>
            </Form>
            {chooseLanguage === "EN" ? (
              <Editor
                apiKey={process.env.REACT_APP_EDITOR_KEY}
                initialValue={englishLanguage}
                name="content"
                onChange={handleEditorChange}
              />
            ) : (
              ""
            )}

            {chooseLanguage === "DE" ? (
              <Editor
                apiKey={process.env.REACT_APP_EDITOR_KEY}
                initialValue={DutchLanguage}
                name="content"
                onChange={handleEditorChange1}
              />
            ) : (
              ""
            )}
            {chooseLanguage === "FR" ? (
              <Editor
                apiKey={process.env.REACT_APP_EDITOR_KEY}
                initialValue={FrenchLanguage}
                name="content"
                onChange={handleEditorChange2}
              />
            ) : (
              ""
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setEditorShow(false);
                handleEdit();
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </>
      </Modal>
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
                  setIsLoading(true);
                  getSettingList();
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

export default AdminSetting;
