import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import AdminPlayerService from "../../../../api/services/AdminService/AdminPlayerService";
import moment from "moment";

const RegDateModal = ({ show,  room, playerInfo, onHide, onSubmit }) => {
  const options = [
    {
      label: "Default date (before 04.2024)",
      value: "before 04.2024",
    },
    { label: "Custom Date", value: "custom" },
    { label: "Reset date", value: "reset" },
  ];

  const [errors, setErrors] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!show) return;
    setErrors(null);
    setSelectedDate("");
  }, [show]);

  const handleSelectDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(null);

    const dateType = event.target.date_type.value;
    let regDate = "";
    switch (dateType) {
      case "custom":
        regDate = moment(event.target.custom_date.value).format('YYYY-MM-DD HH:mm:ss');
        break;
      case "reset":
        regDate = null;
        break;
      default:
        regDate = dateType;
        break;
    }

    if (dateType == "custom" && !regDate) {
      setErrors("Invalid date.");
      return;
    }

    try {
      const userData = {
        room_id: room.room_id,
        user_id: playerInfo.user_id,
        reg_date: regDate,
      };

      await AdminPlayerService.updateFirstRegDate(userData).json();
      onSubmit(dateType, regDate);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  return (
    <Modal show={show}>
      <Modal.Header onClick={onHide}>
        <Modal.Title>
          <h4>First registration date</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group" controlId="">
            <select
              onChange={handleSelectDate}
              name="date_type"
              className="form-select mb-3"
            >
              {options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Form.Group>
          <Form.Group className="form-group">
            <input
              type={selectedDate === "custom" ? "datetime-local" : "hidden"}
              name="custom_date"
              className="form-control"
            />
          </Form.Group>
          <p className="error">{errors}</p>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="secondary" type="reset" onClick={onHide}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegDateModal;
