import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import MultiLangTinyEditor from "../../../components/MultiLangTinyEditor/MultiLangTinyEditor";
import AdminPageSetting from "../../../api/services/AdminService/AdminPageSetting";

const EditAdvertising = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [data, setData] = useState({
    en: "",
    fr: "",
    de: "",
  });

  useEffect(() => {
    getPage();
  }, []);

  const getPage = async () => {
    try {
      const responseData = await AdminPageSetting.show("advertising").json();

      if (responseData.status === true) {
        setData((prev) => ({ ...prev, ...responseData.data?.content }));
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.error("HTTPError", errorJson.message);
      }
    }
  };

  const handleChange = ({ value }) => {
    setData(value);
  };

  const handleSave = async () => {
    try {
      const userData = {
        key: "advertising",
        content: data,
      };

      setIsSaving(true);
      await AdminPageSetting.update(userData).json();
      setIsSaving(false);
      setShowToast(true);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.error(errorJson.message);
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Edit Advertising</h1>
      </nav>
      <main>
        <div className="wrapper my-profile-wrapper">
          <Container>
            <Row>
              <Col md={12}>
                <div className="contact-form-wrapper">
                  <Card>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Content*</Form.Label>
                          {!isLoading && (
                            <MultiLangTinyEditor
                              initialValue={data}
                              onChange={handleChange}
                            />
                          )}
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                          <Link className="btn btn-secondary" to="/admin/pages">
                            Cancel
                          </Link>
                          <Button
                            className="ms-2"
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                          >
                            Save
                          </Button>
                        </div>

                        <p className="error"></p>

                        <p className="success"></p>
                      </Form>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
      {isLoading && <LogoAnimationLoader />}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={1000}
          bg="success"
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Saved successfully.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default EditAdvertising;
