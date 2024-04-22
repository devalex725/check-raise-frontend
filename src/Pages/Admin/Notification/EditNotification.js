import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import NotificationService from "../../../api/services/AdminService/NotificationService";
import MultiLangTinyEditor from "../../../components/MultiLangTinyEditor/MultiLangTinyEditor";
import MultiLangInput from "../../../components/MultiLangInput/MultiLangInput";

const EditNotification = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({ status: false });

  useEffect(() => {
    const id = params.id;
    if (localStorage.getItem("admintoken")) {
      getNotification(id);
    } else {
      navigate("/");
    }
  }, []);

  const getNotification = async (id) => {
    try {
      setIsLoading(true);

      const responseData = await NotificationService.show(id).json();
      setData(responseData.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (!data.title?.en && !data.title?.fr && !data.title?.de) return;

    try {
      const response = await NotificationService.update(data).json();

      setIsSaving(false);

      if (response.status === true) {
        navigate("/admin/notification");
      }
    } catch (error) {
      setIsSaving(false);
      console.error("error", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Edit Notification</h1>
      </nav>
      <main>
        <div className="wrapper contact-wrapper">
          <Container>
            <Row>
              <Col sm={12}>
                <div className="contact-form-wrapper">
                  <Card>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Title *</Form.Label>

                          {data?.title ? (
                            <MultiLangInput
                              name="title"
                              initialValue={data.title}
                              onChange={handleChange}
                            />
                          ) : (
                            ""
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Active"
                            checked={data.status}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                status: e.target.checked,
                              }))
                            }
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Content*</Form.Label>
                          <Form.Text muted className="d-block">
                            Available variables:{" "}
                            {(data?.variables || [])
                              .map((item) => `{{${item}}}`)
                              .join(", ")}
                          </Form.Text>
                          {data?.content ? (
                            <MultiLangTinyEditor
                              name="content"
                              initialValue={data.content}
                              onChange={handleChange}
                            />
                          ) : (
                            ""
                          )}
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                          <Link
                            className="btn btn-secondary me-2"
                            to="/admin/notification"
                          >
                            Cancel
                          </Link>
                          <Button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                          >
                            Save
                          </Button>
                        </div>
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
    </>
  );
};

export default EditNotification;
