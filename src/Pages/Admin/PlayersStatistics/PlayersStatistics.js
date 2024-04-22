import React, { useState, useEffect, useMemo, useRef } from "react";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import customeStyle from "../../Admin/customstyle";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import "./PlayersStatistics.scss";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import { useReactToPrint } from "react-to-print";
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import moment from "moment";
import AdminPlayerService from "../../../api/services/AdminService/AdminPlayerService";
const PlayersStatistics = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [endDate, setEndDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [isLoading, setisloading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [exportData, SetExportData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [max, setMax] = useState(300);
  const [min, setMin] = useState(0);
  const navigate = useNavigate();
  const getPlayerstatistics = async () => {
    try {
      let responseData = await AdminPlayerService.playerStatistics().json();
      setisloading(false);
      setPlayers(responseData.data);

      setFilteredList(responseData.data);
      SetExportData(responseData.data);
    } catch (error) {
      setisloading(true);
    }
  };

  const headers = [
    { label: "Name", key: "firstname" },
    { label: "Surname", key: "lastname" },
    { label: "Nickname", key: "nickname" },
    { label: "Zipcode", key: "zipcode" },
    { label: "City", key: "city" },
    { label: "Registrations with check-in", key: "with" },
    { label: "Registrations without check-in", key: "without" },
    { label: "Cumulated Buy-in bounty Re-entries", key: "reentries" },
    { label: "Cumulated rakes", key: "rakes" },
  ];

  const handleInput = (e, max) => {
    setMax(max);
    setMin(e);
  };

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getPlayerstatistics();
    } else {
      navigate("/");
    }
  }, []);
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      {
        name: "Name",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.firstname}
          </div>
        ),
        selector: (row) => (row.firstname ? row.firstname : ""),
        sortable: true,
      },
      {
        name: "Surname",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.lastname ? row.lastname : ""}
          </div>
        ),
        selector: (row) => (row.lastname ? row.lastname : ""),
        sortable: true,
      },
      {
        name: "Nickname",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.nickname ? row.nickname : ""}
          </div>
        ),
        selector: (row) => (row.nickname ? row.nickname : ""),
        sortable: true,
      },
      {
        name: "ZipCode",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.zipcode ? row.zipcode : ""}
          </div>
        ),
        selector: (row) => (row.zipcode ? row.zipcode : ""),
        sortable: true,
      },
      {
        name: "City",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.city ? row.city : ""}
          </div>
        ),
        selector: (row) => (row.city ? row.city : ""),
        sortable: true,
      },
      {
        name: "Registrations with check-in",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.with ? row.with : 0}
          </div>
        ),
        selector: (row) => (row.with ? row.with : 0),
        sortable: true,
      },
      {
        name: "Registrations without check-in",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.without ? row.without : 0}
          </div>
        ),
        selector: (row) => (row.without ? row.without : 0),
        sortable: true,
      },
      {
        name: "Cumulated Buy-in bounty Re-entries",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.reentries ? row.reentries : 0}
          </div>
        ),
        selector: (row) => (row.reentries ? row.reentries : 0),
        sortable: true,
      },
      {
        name: "Cumulated rakes",
        cell: (row) => (
          <p
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/infoStatistics/${row.user_id}`)}
          >
            {row.rakes ? row.rakes : 0}
          </p>
        ),
        selector: (row) => (row.rakes ? row.rakes : 0),
        sortable: true,
      },
    ],
    []
  );

  const [searchParam] = useState([
    "firstname",
    "lastname",
    "nickname",
    "email",
  ]);
  const filterBySearch = (event) => {
    const query = (event.target.value || "").trim();

    var updatedList = [...players];

    if (!query) {
      setFilteredList(updatedList);
    }

    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          (item[newItem] || "").toLowerCase().indexOf(query.toLowerCase()) !==
          -1
        );
      });
    });

    setFilteredList(updatedList);
  };
  const handleSearch = () => {
    var data = players.filter((row) => {
      return (
        row.detail &&
        moment(startDate).format("DD.MM.YYYY HH:mm") <=
          moment(row.created_at).format("DD.MM.YYYY HH:mm") &&
        moment(endDate).format("DD.MM.YYYY HH:mm") >=
          moment(row.created_at).format("DD.MM.YYYY HH:mm")
      );
    });

    // var data = players.filter(row => { return row && moment(row.created_at).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD') })

    if (data.length === 0) {
      setFilteredList(players);
      SetExportData(data);
    } else {
      setFilteredList(
        data.filter((element) => {
          return element.detail && element.detail.buyin
            ? min <= element.detail.buyin && max >= element.detail.buyin
            : data;
        })
      );

      SetExportData(
        data.filter((element) => {
          return element.detail && element.detail.buyin
            ? min <= element.detail.buyin && max >= element.detail.buyin
            : data;
        })
      );
    }
  };
  const tableRef = useRef(null);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const header = [
    "Name",
    "Surname",
    "Nickname",
    "Zipcode",
    "City",
    "Registrations with check-in",
    "Registrations without check-in",
    "Cumulated Buy-in bounty Re-entries",
    "Cumulated rakes",
  ];
  function handleDownloadExcel() {
    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerStatistics",
      tablePayload: {
        header,
        // accept two different data structures
        // body: filteredList.filter((element) => { return element.firstname }),
        body: filteredList,
      },
    });
  }
  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
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
                {t("page.myprofile.myprofilenav.RoomStatistics.Statistics")}
              </Card.Header>
              <Card.Body>
                <Form className="static">
                  <Row>
                    <Col md={3} className="without-date-calander">
                      <Form.Group
                        className="mb-1 mb-lg-4 form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.StartDate"
                          )}
                        </Form.Label>
                        {/* https://reactdatepicker.com/ */}
                        {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}  dateFormat="dd.MM.yyyy"/> */}
                        <DatePicker
                          selectsStart
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          startDate={startDate}
                          // showTimeSelect
                          // timeFormat="HH:mm"
                          // injectTimes={[
                          //   setHours(setMinutes(new Date(), 1), 0),
                          //   setHours(setMinutes(new Date(), 5), 12),
                          //   setHours(setMinutes(new Date(), 59), 23),
                          // ]}
                          // dateFormat="dd.MM.yyyy HH:mm"
                          dateFormat="dd.MM.yyyy"
                          calendarStartDay={1}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="without-date-calander">
                      <Form.Group
                        className="mb-1 mb-lg-4 form-group "
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.EndDate"
                          )}
                        </Form.Label>

                        <DatePicker
                          selectsEnd
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          endDate={endDate}
                          // showTimeSelect
                          // timeFormat="HH:mm"
                          // injectTimes={[
                          //   setHours(setMinutes(new Date(), 1), 0),
                          //   setHours(setMinutes(new Date(), 5), 12),
                          //   setHours(setMinutes(new Date(), 59), 23),
                          // ]}
                          dateFormat="dd.MM.yyyy"
                          calendarStartDay={1}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group
                        className="mb-1 mb-lg-4 form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.Buy-In"
                          )}
                        </Form.Label>
                        <MultiRangeSlider
                          min={0}
                          max={300}
                          onChange={({ min, max }) => handleInput(min, max)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group
                        className="mb-5 form-group text-end"
                        controlId=""
                      >
                        <Form.Label className="d-block">&nbsp;</Form.Label>
                        <Button varient="parimary" onClick={handleSearch}>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.Search"
                          )}
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>

                <Row className="my-3">
                  <Col md={6}>
                    <h3>{t("page.Manager.PlayerStatistics.Players")}</h3>
                  </Col>
                  <Col md={6} className="text-end">
                    <Form.Group
                      className="mb-5 form-group text-end d-flex align-items-center justify-content-end p-0"
                      controlId=""
                    >
                      <Form.Label className="d-block me-2">Search :</Form.Label>
                      <input
                        type="text"
                        className="player-statistics-search"
                        onChange={filterBySearch}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} ref={componentRef}>
                    <DataTable
                      data={filteredList}
                      columns={columns}
                      theme="dark"
                      selectableRowsComponentProps={{ inkDisabled: true }}
                      defaultSortFieldId={1}
                      pagination
                      customStyles={customeStyle}
                      paginationPerPage={100}
                      paginationComponentOptions={paginationComponentOptions}
                      paginationRowsPerPageOptions={[10, 50, 100]}
                    />
                  </Col>

                  <Col md={12} className="text-end">
                    <Button variant="primary" onClick={handlePrint}>
                      Print
                    </Button>
                    &nbsp;
                    <CSVLink
                      varient="primary"
                      class="btn btn-primary"
                      data={exportData ? exportData : players}
                      headers={headers}
                    >
                      Download
                    </CSVLink>
                    &nbsp;
                    <CSVLink
                      varient="primary"
                      class="btn btn-primary"
                      data={exportData ? exportData : players}
                      headers={headers}
                    >
                      Save CSV
                    </CSVLink>
                    &nbsp;
                    {/* <DownloadTableExcel
                      filename="users table"
                      sheet="users"
                      currentTableRef={tableRef.current}
                    >

                      <button> Save Excel</button>

                    </DownloadTableExcel> */}
                    <button
                      varient="primary"
                      class="btn btn-primary"
                      onClick={handleDownloadExcel}
                    >
                      Save Excel
                    </button>
                    {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : players} headers={headers}>Save Excel</CSVLink> */}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default PlayersStatistics;
