import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import SettingService from "../../../../api/services/SettingService";
import moment from "moment";
import TournamentService from "../../../../api/services/TournamentService";

const DuplicateModal = ({ show, onHide, tournament }) => {
  const { t } = useTranslation();
  if (!tournament) {
    tournament = {
      title: "",
    };
  }

  const [data, setData] = useState({
    title: "",
    startday: "",
    lastday: "",
    bounusdeadline: "",
  });
  const [errors, setErrors] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  // initialize data with tournament to duplicate
  useEffect(() => {
    if (!show || !tournament) return;
    setErrors(null);
    setData({
      title: tournament.title,
      // startday: new Date(tournament.detail?.startday || new Date()),
      lastday: tournament.detail?.lastday
        ? new Date(tournament.detail?.lastday)
        : "",
      // bounusdeadline:
      //   tournament.detail?.bounusdeadline && settings?.is_bonus
      //     ? new Date(tournament.detail?.bounusdeadline)
      //     : "",
    });
    handleChangeStartDate(new Date(tournament.detail?.startday || new Date()))
  }, [show]);

  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    try {
      const responseData = await SettingService.index().json();
      setSettings(responseData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const bonusDate = settings?.is_bonus === 1 ? data.bounusdeadline : null;
    setLoading(true);
    try {
      const userData = {
        tournament: {
          title: data.title,
          original_id: tournament.id,
        },
        detail: {
          startday: moment(data.startday).format("YYYY-MM-DD HH:mm"),
          bounusdeadline: bonusDate
            ? moment(bonusDate).format("YYYY-MM-DD HH:mm")
            : "",
          lastday: tournament.detail.lastday
            ? moment(data.lastday).format("YYYY-MM-DD HH:mm")
            : "",
        },
      };

      const responseData = await TournamentService.duplicate(userData).json();
      setLoading(false);
      if (responseData.status == true) {
        onHide(true);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleChange = (name) => (value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTitle = (e) => {
    const value = e.target.value;

    setData((prev) => ({ ...prev, title: value }));

    const uppercaseTitle = value.charAt(0).toUpperCase() + value.slice(1);
    let errorMsg = "";

    if (value.length > 34) {
      errorMsg =
        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycharacters";
    }

    if ((uppercaseTitle.match(/[A-Z]/g) || []).length >= 7) {
      errorMsg =
        "page.myprofile.myprofilenav.All tournaments.addtournament.Toomanycapital";
    }

    setErrors((prev) => ({
      ...prev,
      title: errorMsg,
    }));
  };

  const handleChangeStartDate = (startday) => {
    const dates = { startday };
    const startDayObj = new Date(startday);

    switch (settings?.current_bonus_status) {
      case 1:
        dates.bounusdeadline = new Date(
          startDayObj.getTime() - settings?.number_of_hours * 60 * 60 * 1000
        );
        break;
      case 2:
        const dateStr = moment(startDayObj)
          .subtract(settings.number_of_day, "days")
          .format("YYYY-MM-DD ");
        dates.bounusdeadline = new Date(dateStr + settings.day_time);
        break;
      case 3:
        break;
        const target = settings?.fix_weekday;
        startDayObj.setDate(
          startDayObj.getDate() -
            (startDayObj.getDay() == target
              ? 7
              : (startDayObj.getDay() + (7 - target)) % 7)
        );

        dates.bounusdeadline = startDayObj;
      default:
        break;
    }

    setData((prev) => ({ ...prev, ...dates }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Duplicate {tournament.title}</Modal.Title>
        <button
          className="btn-close"
          aria-label="Close"
          onClick={onHide}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="form-group">
          <Form.Label className="mb-10">
            {t(
              "page.myprofile.myprofilenav.All tournaments.addtournament.description"
            )}
          </Form.Label>
          <Form.Control
            type="text"
            maxLength={34}
            name="title"
            value={data.title}
            onChange={handleChangeTitle}
          />
          <div className="mt-10">
            {t(
              "page.myprofile.myprofilenav.All tournaments.addtournament.Characters"
            )}
            : {data.title.length} / 34
          </div>

          {errors?.title && (
            <span className="text-danger">{t(errors.title)}</span>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>
            {t(
              "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentStartDateTime"
            )}
            <span className="required">*</span>
          </Form.Label>
          <DatePicker
            selected={data.startday}
            onChange={handleChangeStartDate}
            showTimeSelect
            timeFormat="HH:mm"
            injectTimes={[
              setHours(setMinutes(new Date(), 1), 0),
              setHours(setMinutes(new Date(), 5), 12),
              setHours(setMinutes(new Date(), 59), 23),
            ]}
            dateFormat="dd.MM.yyyy HH:mm"
            calendarStartDay={1}
            wrapperClassName="d-block"
          />
        </Form.Group>
        {tournament.detail?.lastday && (
          <Form.Group className="form-group">
            <Form.Label>
              {t(
                "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentEndDate"
              )}
            </Form.Label>
            <DatePicker
              selected={data?.lastday}
              name="lastday"
              onChange={handleChange("lastday")}
              dateFormat="dd.MM.yyyy"
              calendarStartDay={1}
              wrapperClassName="d-block"
            />
          </Form.Group>
        )}
        {settings?.is_bonus === 1 ? (
          <Form.Group className="form-group" controlId="">
            <Form.Label>Bonus registration deadline</Form.Label>
            <DatePicker
              selected={data.bounusdeadline}
              name="bounusdeadline"
              onChange={handleChange("bounusdeadline")}
              showTimeSelect
              timeFormat="HH:mm"
              injectTimes={[
                setHours(setMinutes(new Date(), 1), 0),
                setHours(setMinutes(new Date(), 5), 12),
                setHours(setMinutes(new Date(), 59), 23),
              ]}
              dateFormat="dd.MM.yyyy HH:mm"
              calendarStartDay={1}
              wrapperClassName="d-block"
            />
          </Form.Group>
        ) : (
          ""
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DuplicateModal;
