import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DirectorService from "../../../api/services/DirectorService";
import TournamentService from "../../../api/services/TournamentService";

const SendEmail = ({ show, onHide, emailData }) => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    subject: '',
    content: '\n\nRoom Name\nSent from Check-Raise.ch',
  });
  const [responseModalShow, setResponseModalShow] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sentEmails, setSendEmails] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    if (!show) return;

    setData({
      subject: '',
      content: `\n\n${emailData.roomTitle}\nSent from Check-Raise.ch`,
    });
    setResponseMessage('');
    setSendEmails([]);
  }, [show]);

  const handleChange = e => {
    const { name, value } = e.target;

    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async () => {
    setErrors('');
    const userData = {
      ...data,
      tournament_id: emailData.tournamentId,
    };

    if (userData.subject === '' || userData.content === '') {
      setErrors('Please fill all fields');
      return;
    }

    try {
      const sendEmail = emailData.name === 'director' ? DirectorService.sendemail : TournamentService.sendemail
      const responseData = await sendEmail(userData).json();
      // const responseData =
      //   emailData.name === "director"
      //     ? await DirectorService.sendemail(userData).json()
      //     : await TournamentService.sendemail(userData).json();

      if (responseData.status === true) {
        setResponseModalShow(true);
        setResponseMessage(responseData.message);
        setSendEmails(responseData.emails || []);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson.message);
      }
    }
  };

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Send Email</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={onHide}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  {t("page.myprofile.myprofilenav.Newsletters.Subject")} *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={data.subject}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="form-group" controlId="">
                <Form.Label>Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="content"
                  onChange={handleChange}
                  value={data.content}
                />
              </Form.Group>
              {errors ? <p className="error">{errors}</p> : ''}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendEmail}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={responseModalShow}>
        <Modal.Header>{responseMessage}</Modal.Header>
        <Modal.Body>
          <ul>
            {sentEmails.map(email => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setResponseModalShow(false);
              onHide();
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendEmail;