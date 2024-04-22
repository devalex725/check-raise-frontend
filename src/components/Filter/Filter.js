import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import _ from "lodash";
import Switch from "react-switch";

import User from "../../api/services/User";
import RoomService from "../../api/services/RoomService";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";

import "./Filter.scss";

const Filter = (props) => {
  const { t } = useTranslation();
  const DealersData = [
    { value: "Dealers", label: "Dealers" },
    { value: "Self-dealing", label: "Self-dealing" },
  ];
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    minBuyin: 0,
    maxBuyin: 300,
    minPlayers: 0,
    maxPlayers: 100,
    reentry: 3, // all
    dealertype: "", // all
    roomIds: [],
  });
  const [savedFilterApply, setSavedFilterApply] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filters]);

  useEffect(() => {
    if (savedFilterApply === props.savedFilterApply) return;
    setSavedFilterApply(props.savedFilterApply);
  }, [props.savedFilterApply]);

  useEffect(() => {
    if (savedFilterApply !== props.savedFilterApply) {
      props.setSavedFilterApply(savedFilterApply);
    }

    if (!savedFilterApply) {
      setFilters({
        from: null,
        to: null,
        minBuyin: 0,
        maxBuyin: 300,
        minPlayers: 0,
        maxPlayers: 100,
        reentry: 3, // all
        dealertype: "", // all
        roomIds: [],
      });
      return;
    }

    const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};

    setFilters((prev) => ({
      ...prev,
      ...savedFilters,
      from: savedFilters?.from ? new Date(savedFilters.from) : null,
      to: savedFilters?.to ? new Date(savedFilters.to) : null,
    }));
  }, [savedFilterApply]);

  const getRooms = async () => {
    try {
      var responseData = await RoomService.common(1).json();
      setRooms(responseData.data);
    } catch (error) {}
  };

  const saveFilters = () => {
    localStorage.setItem("filters", JSON.stringify(filters));
    setShowToast(true);
  };

  const handleChangeFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSavedFilterApply(false);
  };

  const handleChangeDate = (dates) => {
    const [from, to] = dates;
    setFilters((prev) => ({
      ...prev,
      from,
      to,
    }));
    setSavedFilterApply(false);
  };

  const handleChangeMultiRange = useCallback(
    _.debounce((name, values) => {
      if (
        name === "players" &&
        filters.minPlayers === values.minPlayers &&
        filters.maxPlayers === values.maxPlayers
      )
        return;
      if (
        name === "buyin" &&
        filters.minBuyin === values.minBuyin &&
        filters.maxBuyin === values.maxBuyin
      )
        return;

      setFilters((prev) => ({
        ...prev,
        ...values,
      }));
      setSavedFilterApply(false);
    }, 500),
    [filters]
  );

  const handleFilterRoom = async (e) => {
    const { checked, value } = e.target;

    setFilters((prev) => {
      let roomIds = prev.roomIds;
      // "All" unchecked, clicking on All.
      if (value === "all" && checked) {
        roomIds = [];
        return { ...prev, roomIds };
      }

      if (checked) {
        roomIds.push(value);
      } else {
        roomIds.splice(roomIds.indexOf(value), 1);
      }

      return { ...prev, roomIds };
    });
    setSavedFilterApply(false);
  };

  const handleFilter = async () => {
    if(props.firstTimeLoad) return;

    const fromDate = moment(filters.from);
    const toDate = moment(filters.to);

    const _filters = {
      ...filters,
      from: fromDate.isValid() ? fromDate.format("YYYY-MM-DD") : "",
      to: toDate.isValid() ? toDate.format("YYYY-MM-DD") : "",
    };

    // when select only fromDate, do not filter.
    if (_filters.from && !_filters.to) {
      return;
    }

    const responseData = await User.filter(_filters).json();
    console.log('handleFilter')
    props.parentCallback(responseData.data || []);
  };

  return (
    <>
      <Form>
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <Button
            size="sm"
            variant="primary"
            className="me-2"
            onClick={saveFilters}
          >
            {t("page.tournaments.filter.Save filter")}
          </Button>
          <Switch
            onChange={setSavedFilterApply}
            checked={savedFilterApply}
            className="react-switch"
            width={56}
            height={26}
            onColor="#C5E6F1"
            offColor="#233237"
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 15,
                  paddingInline: 2,
                }}
              >
                Off
              </div>
            }
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 15,
                  paddingInline: 2,
                  color: "#0B0B0B",
                }}
              >
                On
              </div>
            }
          />
        </div>
        <Form.Group className="mb-2" controlId="">
          <Form.Label>{t("page.tournaments.filter.Date")}</Form.Label>
          <DatePicker
            selected={filters.from}
            minDate={new Date()}
            onChange={handleChangeDate}
            startDate={filters.from}
            endDate={filters.to}
            selectsRange
            isClearable
            dateFormat="dd.MM.yyyy"
            calendarStartDay={1}
          />
        </Form.Group>
        <Form.Group className="mb-2 asidebuy-in mt-20" controlId="">
          <Form.Label>{t("page.tournaments.filter.Buy-In")}</Form.Label>
          <MultiRangeSlider
            min={0}
            max={300}
            defaultMinValue={filters.minBuyin}
            defaultMaxValue={filters.maxBuyin}
            onChange={({ min, max }) =>
              handleChangeMultiRange("buyin", { minBuyin: min, maxBuyin: max })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2 asideplayers mt-20" controlId="">
          <Form.Label>{t("page.tournaments.filter.Players")}</Form.Label>
          <MultiRangeSlider
            min={0}
            max={100}
            defaultMinValue={filters.minPlayers}
            defaultMaxValue={filters.maxPlayers}
            onChange={({ min, max }) =>
              handleChangeMultiRange("players", {
                minPlayers: min,
                maxPlayers: max,
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2 asidere-entry mt-20" controlId="">
          <Form.Label>
            {t("page.tournaments.filter.Re-Entry / Freezeout")}
          </Form.Label>
          <Form.Select
            onChange={handleChangeFilters}
            value={filters.reentry}
            name="reentry"
          >
            <option value={3}>{t("page.tournaments.filter.All")}</option>
            <option value={1}>{t("page.tournaments.filter.Re-Entry")}</option>
            <option value={2}>{t("page.tournaments.filter.Freezeout")}</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2 aside-pokerroom mt-20" controlId="">
          <Form.Label>{t("page.tournaments.filter.Dealers")}</Form.Label>
          <Form.Select
            onChange={handleChangeFilters}
            value={filters.dealertype}
            name="dealertype"
          >
            <option value="">{t("page.tournaments.filter.All")}</option>
            {DealersData.map((user, index) => (
              <option key={index} value={user.value}>
                {user.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2 aside-pokerroom mt-20" controlId="">
          <Form.Label>{t("page.tournaments.filter.Poker Room")}</Form.Label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="allSelect"
              value="all"
              checked={filters.roomIds.length < 1}
              // checked={!users.some((user) => user?.isChecked !== true)}
              onChange={handleFilterRoom}
            />
            <label className="form-check-label ms-2">
              {t("page.tournaments.filter.All")}
            </label>
          </div>
          {rooms.map((room, index) => (
            <div className="form-check" key={index}>
              <input
                type="checkbox"
                className="form-check-input"
                name="rooms"
                value={room.id}
                checked={filters.roomIds.includes(room.id.toString())}
                onChange={handleFilterRoom}
              />
              <label className="form-check-label ms-2">{room.title}</label>
            </div>
          ))}
        </Form.Group>
      </Form>
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

export default Filter;
