import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import AdminPlayerService from "../../../../api/services/AdminService/AdminPlayerService";

const MembershipModal = ({ show, onHide, room, playerInfo }) => {
  const endYearDate = `${new Date().getFullYear()}-12-31`;
  const endNextYearDate = moment(endYearDate)
    .add(1, "year")
    .format("YYYY-MM-DD");
  const options = useMemo(() => {
    const currentExpiry = room?.expiry ? moment(room.expiry) : moment();
    const nextYearDate = currentExpiry.add(1, "year");

    return [
      {
        label: `Until the end of the year (${moment(endYearDate).format(
          "DD.MM.YYYY"
        )})`,
        value: endYearDate,
      },
      {
        label: `Until the end of the next year (${moment(
          endNextYearDate
        ).format("DD.MM.YYYY")})`,
        value: endNextYearDate,
      },
      {
        label: `By one year (${nextYearDate.format("DD.MM.YYYY")})`,
        value: nextYearDate.format("YYYY-MM-DD"),
      },
      { label: "Custom Date", value: "custom" },
      { label: "Reset membership", value: "reset" },
    ];
  }, [room, endYearDate, endNextYearDate]);

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

  const handleMembershipSubmit = async (event) => {
    event.preventDefault();
    setErrors(null);

    const membershipDate = event.target.membership_date.value;
    let expiry = "";
    switch (membershipDate) {
      case "custom":
        expiry = event.target.custom_date.value;
        break;
      case "reset":
        expiry = null;
        break;
      default:
        expiry = membershipDate;
        break;
    }

    if (membershipDate !== "reset" && !expiry) {
      setErrors("Invalid date.");
      return;
    }

    try {
      const userData = {
        id: room?.room_member_id,
        room_id: room.room_id,
        user_id: playerInfo.user_id,
        expiry: expiry,
      };
      await AdminPlayerService.updateExpiry(userData).json();
      onHide(expiry);
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
          <h4>Membership</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleMembershipSubmit}>
          <Form.Group className="form-group" controlId="">
            <select
              onChange={handleSelectDate}
              name="membership_date"
              className="form-select mb-3"
            >
              {options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type={selectedDate === "custom" ? "date" : "hidden"}
              name="custom_date"
              className="form-control"
            />

            <p className="error">{errors}</p>
          </Form.Group>
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

export default MembershipModal;
