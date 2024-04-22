import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TournamentService from "../../../../api/services/TournamentService";

const DeleteFinishedTournamentsModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    if (!show) return;

    setPassword('');
    setErrors('');
  }, [show]);

  const togglePasswordVisibility = () => {
    setPasswordShown(prev => !prev);
  };

  const handleDeleteFinished = async () => {
    setErrors('');

    if (password === '') {
      setErrors('Please fill the password.');
      return;
    }

    try {
      const response = await TournamentService.deleteFinished(password).json();
      if(response.status) {
        onHide(true);
      } else {
        setErrors(response.message);
      }
    } catch (e) {
      if (e.name === "HTTPError") {
        const errorJson = await e.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Alert</Modal.Title>
        <button
          className="btn-close"
          aria-label="Close"
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete all finished tournaments?

        <Form.Group
          className="mb-3 position-relative mt-3"
          controlId="password"
        >
          <Form.Label>{t("page.registration.Password")}*</Form.Label>
          <Form.Control
            type={passwordShown ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder={t("page.registration.Password")}
            className={errors ? "error" : "border-default"}
            onChange={e => setPassword(e.target.value)}
          />
          <span className="faEye-icon">
            <FontAwesomeIcon icon={passwordShown ? faEye : faEyeSlash} onClick={togglePasswordVisibility}/>
          </span>
        </Form.Group>
        {errors ? <p className="error">{errors}</p> : ''}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="secondary" onClick={handleDeleteFinished}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteFinishedTournamentsModal;