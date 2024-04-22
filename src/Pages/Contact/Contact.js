import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RoomService from "../../api/services/RoomService";
import ContactService from "../../api/services/ContactService";
import Modal from "react-bootstrap/Modal";

const Contact = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [errors, serErrors] = useState(null);
  const [resultModalShown, setResultModalShown] = useState(false);

  const getRooms = async () => {
    try {
      const responseData = await RoomService.getAllRoom({
        status: [1, 2], // only get active, deactivated room: ticket 61
      }).json();
      setRooms(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const onContact = async (event) => {
    event.preventDefault();
    serErrors(null);
    const { target } = event;

    try {
      const userData = {
        firstname: target.firstname.value,
        lastname: target.lastname.value,
        email: target.email.value,
        message: target.message.value,
        room: target.room.value,
      };
      const isEmpty = (Object.values(userData).filter(val => !val)).length > 0;

      if (isEmpty) {
        serErrors('Please Fill All Fields*');
        return;
      }

      const data = await ContactService.store(userData).json();

      if (data.status === true) {
        setResultModalShown(true);
      }
    } catch (error) {
      serErrors(error);
    }
  };

  return (
    <main>
      <div className="wrapper contact-wrapper">
        <Container>
          <Row>
            <Col sm={12} className="text-center mb-50">
              <h2>{t("page.contact.Contact form")}</h2>
            </Col>

            <Col sm={12} className="text-center mb-20">
              <p>
                {t(
                  "page.contact.You wish to obtain information, make remarks or suggestion",
                )}
                .
              </p>
            </Col>
            <Col sm={12}>
              <div className="contact-form-wrapper">
                <Card>
                  <Card.Body>
                    <Form onSubmit={onContact}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("page.contact.Your name")} *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstname"
                          placeholder={t("page.contact.Your name")}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("page.contact.Your surname")} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastname"
                          placeholder={t("page.contact.Your surname")}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("page.contact.Your email")} *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder={t("page.contact.Your email")}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("page.contact.Your message")} *
                        </Form.Label>
                        <Form.Control as="textarea" name="message" rows={5}/>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t("page.contact.Send to")} *</Form.Label>

                        <Form.Select name="room" defaultValue="">
                          <option value="">Select...</option>
                          {rooms.map((element) => (
                            <option
                              id={element.id ? element.id : ""}
                              value={element.id}
                              key={element.id}
                            >
                              {element.title || ""}
                            </option>
                          ))}
                          <option disabled value="check-raise" style={{ color: "#ffff" }}>
                            _____________________________________________________
                          </option>
                          <option value="admin">Check-Raise</option>
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-center">
                        <Button className="btn btn-link me-2" type="reset">
                          {t("page.contact.Cancel")}
                        </Button>
                        <Button className="btn btn-primary" type="submit">
                          {t("page.contact.Send")}
                        </Button>
                      </div>
                      {errors ? (
                        <p className="error">Please Fill All Fields*.</p>
                      ) : (
                        ""
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={resultModalShown}>
        <Modal.Body>Message sent.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setResultModalShown(false);
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default Contact;
