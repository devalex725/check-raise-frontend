import React, { useEffect, useState } from "react";

import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SettingService from "../../../api/services/SettingService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import moment from "moment";

const bonusStatuses = [
  { value: 1, label: "page.Manager.TournamentsSetting.hour" },
  { value: 2, label: "page.Manager.TournamentsSetting.days" },
  { value: 3, label: "page.Manager.TournamentsSetting.weekday" },
];

const weekStrings = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

const Setting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    is_membership: false,
    is_bonus: false,
    is_late_arrival: false,
    current_bonus_status: 1,
    number_of_hours: 0,
    number_of_day: 0,
    day_time: new Date(),
    fix_weekday: { value: 1, label: "Monday" },
    weekday_time: new Date(),
  });
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getSetting();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getSetting = async () => {
    try {
      const responseData = await SettingService.index().json();
      setIsLoading(false);

      if (!responseData.data) return;

      setData({
        is_membership: responseData.data.is_membership,
        is_bonus: responseData.data.is_bonus,
        is_late_arrival: responseData.data.is_late_arrival,
        current_bonus_status: responseData.data.current_bonus_status,
        number_of_hours: responseData.data.number_of_hours,
        number_of_day: responseData.data.number_of_day,
        day_time: new Date(
          `${moment().format("YYYY-MM-DD")} ${responseData.data.day_time}`
        ),
        fix_weekday: weekStrings.find(
          (item) => item.value === responseData.data.fix_weekday
        ),
        weekday_time: new Date(
          `${moment().format("YYYY-MM-DD")} ${responseData.data.weekday_time}`
        ),
      });

      console.log(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    let newVal = "";
    switch (name) {
      case "is_membership":
      case "is_bonus":
      case "is_late_arrival":
        newVal = checked;
        break;
      default:
        newVal = value;
        break;
    }

    setData((prev) => ({ ...prev, [name]: newVal }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const userData = {
      ...data,
      day_time: moment(data.day_time).format("HH:mm"),
      weekday_time: moment(data.weekday_time).format("HH:mm"),
      fix_weekday: data.fix_weekday.value,
    };

    try {
      const responseData = await SettingService.store(userData).json();
      setModalShow(true);
      setModalMessage(responseData.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
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
                {t("page.Manager.TournamentsSetting.Label")}
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Check
                    label={t("page.Manager.TournamentsSetting.membership")}
                    className="mb-3"
                    type="switch"
                    name="is_membership"
                    checked={data.is_membership}
                    onChange={handleChange}
                  />
                  <Form.Check
                    label={t("page.Manager.TournamentsSetting.latearrival")}
                    className="mb-3"
                    type="switch"
                    name="is_late_arrival"
                    checked={data.is_late_arrival}
                    onChange={handleChange}
                  />

                  <Form.Check
                    label={t("page.Manager.TournamentsSetting.bonus")}
                    className="mb-3"
                    type="switch"
                    name="is_bonus"
                    checked={data.is_bonus}
                    onChange={handleChange}
                  />

                  {data.is_bonus ? (
                    <>
                      {bonusStatuses.map((status) => (
                        <Form.Check
                          key={status.value}
                          label={t(status.label)}
                          className="mb-2"
                          type="radio"
                          name="current_bonus_status"
                          checked={data.current_bonus_status == status.value}
                          value={status.value}
                          onChange={handleChange}
                        />
                      ))}

                      {data.current_bonus_status == 1 && (
                        <input
                          pattern="[0-9]"
                          className="me-2 form-control"
                          type="number"
                          name="number_of_hours"
                          value={data.number_of_hours}
                          onChange={handleChange}
                        />
                      )}
                      {data.current_bonus_status == 2 && (
                        <div className="d-flex row">
                          <div className="col-md-3">
                            <Form.Control
                              onWheel={(e) => e.target.blur()}
                              type="number"
                              className="me-2"
                              pattern="[0-9]"
                              name="number_of_day"
                              min={0}
                              value={data.number_of_day}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <DatePicker
                              showTimeSelect
                              showTimeSelectOnly
                              dateFormat="HH:mm"
                              selected={data.day_time}
                              timeIntervals={30}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "day_time", value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                      {data.current_bonus_status == 3 && (
                        <div className="d-flex row">
                          <div className="col-md-3">
                            <Select
                              options={weekStrings}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              value={data.fix_weekday}
                              onChange={(option) =>
                                handleChange({
                                  target: {
                                    name: "fix_weekday",
                                    value: option,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4">
                            <DatePicker
                              showTimeSelect
                              showTimeSelectOnly
                              dateFormat="HH:mm"
                              selected={data.weekday_time}
                              timeIntervals={30}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "weekday_time", value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  <Form.Group className="form-group text-end">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {isLoading && <LogoAnimationLoader />}

      <Modal show={modalShow}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Setting;
