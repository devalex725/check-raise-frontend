import React, { useState, useEffect, useMemo, useRef } from "react";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import customeStyle from "../../Admin/customstyle";
import { useReactToPrint } from "react-to-print";
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import "./PlayersStatistics.scss";
import Modal from "react-bootstrap/Modal";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import RoomService from "../../../api/services/RoomService";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
const PlayersStatistics = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [endDate, setEndDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [modelshow, setModelShow] = useState(false);
  const [exportmodelshow, setExportModelShow] = useState(false);
  const [isLoading, setisloading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [exportData, SetExportData] = useState([]);
  const [filteredList, setFilteredList] = new useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tabledatacsv, setTabledatacsv] = useState([[]]);
  const [max, setMax] = useState(300);
  const [min, setMin] = useState(0);
  const navigate = useNavigate();
  const getPlayerstatistics = async () => {
    try {
      let responseData = await RoomService.playerStatistics().json();

      const obj = Object.entries(responseData.data.users.data).map(
        ([key, value]) => ({ value })
      );
      setPlayers(
        obj.map((element) => {
          return element.value;
        })
      );
      setFilteredList(
        obj.map((element) => {
          return element.value;
        })
      );
      SetExportData(
        obj.map((element) => {
          return element.value;
        })
      );

      setisloading(false);
    } catch (error) {
      setisloading(false);
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    const tableData = players.map((row) => [
      row.firstname,
      row.lastname,
      row.nickname,
      row.zipcode,
      row.city,
      row.with,
      row.without,
      row.reentries,
      row.rakes,
    ]);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
    doc.save("player-statistics.pdf");
  };

  const handleInput = (e, max) => {
    setMax(max);
    setMin(e);
  };
  const handleSearch = () => {
    var data = players.filter((row) => {
      return (
        row.tournaments &&
        moment(row.tournaments.startday).format("YYYY-MM-DD") ===
          moment(startDate).format("YYYY-MM-DD")
      );
    });

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

    // var data = players.filter(row => {
    //   return row.detail && moment(startDate).format('DD.MM.YYYY HH:mm') <= moment(row.detail.startday).format('DD.MM.YYYY HH:mm')
    //     &&
    //     moment(endDate).format('DD.MM.YYYY HH:mm') >= moment(row.detail.startday).format('DD.MM.YYYY HH:mm')

    // })

    // if (data.length === 0) {
    //   setFilteredList(data.filter(
    //     (element) => {
    //       return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
    //     }));
    //   SetExportData(data.filter(
    //     (element) => {
    //       return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
    //     }))
    // }
    // else {

    //   setFilteredList(data.filter(
    //     (element) => {
    //       return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
    //     }));
    //   SetExportData(data.filter(
    //     (element) => {
    //       return element.detail && element.detail.buyin ? min <= element.detail.buyin && max >= element.detail.buyin : data
    //     }))

    // }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
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
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.firstname : ""}
          </div>
        ),
        selector: (row) => (row ? row.firstname : ""),
        sortable: true,
      },
      {
        name: "Surname",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.lastname : ""}
          </div>
        ),
        selector: (row) => (row ? row.lastname : ""),
        sortable: true,
      },
      {
        name: "Nickname",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.nickname : ""}
          </div>
        ),
        selector: (row) => (row ? row.nickname : ""),
        sortable: true,
      },
      {
        name: "ZipCode",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.zipcode : ""}
          </div>
        ),
        selector: (row) => (row ? row.zipcode : ""),
        sortable: true,
      },
      {
        name: "City",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.city : ""}
          </div>
        ),
        selector: (row) => (row ? row.city : ""),
        sortable: true,
      },
      {
        name: "Registrations with check-in",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.with : ""}
          </div>
        ),
        selector: (row) => (row ? row.with : ""),
        sortable: true,
      },
      {
        name: "Registrations without check-in",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.without : ""}
          </div>
        ),
        selector: (row) => (row ? row.without : ""),
        sortable: true,
      },
      {
        name: "Cumulated Buy-in bounty Re-entries",
        cell: (row) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.reentries : ""}
          </div>
        ),
        selector: (row) => (row ? row.reentries : ""),
        sortable: true,
      },
      {
        name: "Cumulated rakes",
        cell: (row) => (
          <p
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/manager/infoStatistics/${row.id}`)}
          >
            {row ? row.rakes : ""}
          </p>
        ),
        selector: (row) => (row ? row.rakes : ""),
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
    "city",
    "zipcode",
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
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const header = [
    "id",
    "is user Suspended?",
    "First name",
    "lastname",
    "dob",
    "street",
    "language",
    "nickname",
    "city",
    "zipcode",
    "displayoption",
    "phonecode",
    "phonecountry",
    "phonenumber",
    "created",
    "with",
    "without",
    "late",
    "membership",
    "room_member_id",
    "room_id",
    "rakes",
    "ischeckedin",
    "reentries",
    "tournaments",
    "lateannouncement",
  ];
  const handleDownloadExcel = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = players.map((row) =>
      newdata.map((nw, i) => [
        nw === "Name" ? row.firstname : "",
        nw === "Surname" ? row.lastname : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "ZipCode" ? row.zipcode : "",
        nw === "City" ? row.city : "",
        nw === "Registrations with check-in" ? row.with : "",
        nw === "Registrations without check-in" ? row.without : "",
        nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : "",
        nw === "Cumulated rakes" ? row.rakes : "",
      ])
    );

    downloadExcel({
      fileName: "Check-Raise",
      sheet: "PlayerStatistics",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
  };
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    setSelectedColumns(updatedColumns);
    //   newdata.map((nw, i) =>
    //   [nw === "Name" ? row.firstname : '', nw === "Surname" ? row.lastname : '', nw === "Nickname" ? row.nickname : '', nw === "ZipCode" ? row.zipcode : '', nw === "City" ? row.city : '', nw === "Registrations with check-in" ? row.with : '', nw === "Registrations without check-in" ? row.without : '', nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : '', nw === "Cumulated rakes" ? row.rakes : '']
    // )
  };
  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const handleCSV = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });
    const tableData = players.map((row) =>
      newdata.map((nw, i) => [
        nw === "Name" ? row.firstname : "",
        nw === "Surname" ? row.lastname : "",
        nw === "Nickname" ? row.nickname : "",
        nw === "ZipCode" ? row.zipcode : "",
        nw === "City" ? row.city : "",
        nw === "Registrations with check-in" ? row.with : "",
        nw === "Registrations without check-in" ? row.without : "",
        nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : "",
        nw === "Cumulated rakes" ? row.rakes : "",
      ])
    );

    downloadFile({
      // data: [ ...tableData].join('\r\n\n'),
      data: [selectedColumns, ...tableData].join("\r"),
      fileName: "Check-Raise.csv",
      fileType: "text/csv",
    });
    // console.log(newdata)
  };
  // ,
  const csvData = [
    selectedColumns,
    ...players.map((row) => [
      ...selectedColumns.map((nw, i) => {
        return [
          nw === "Name"
            ? row.firstname
            : "" || nw === "Surname"
            ? row.lastname
            : "" || nw === "Nickname"
            ? row.nickname
            : "" || nw === "ZipCode"
            ? row.zipcode
            : "" || nw === "City"
            ? row.city
            : "" || nw === "Registrations with check-in"
            ? row.with
            : "" || nw === "Registrations without check-in"
            ? row.without
            : "" || nw === "Cumulated Buy-in bounty Re-entries"
            ? row.reentries
            : "" || nw === "Cumulated rakes"
            ? row.rakes
            : "",
        ];
      }),
      // [ ,nw === "Surname" ? ])
    ]),
  ];

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
                {t("page.myprofile.myprofilenav.RoomStatistics.Statistics")}
              </Card.Header>
              <Card.Body>
                <Form className="static">
                  <Row>
                    <Col md={3} className="without-date-calander">
                      <Form.Group
                        className="mb-1 mb-lg-4 form-group "
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.StartDate"
                          )}
                        </Form.Label>

                        <DatePicker
                          selectsStart
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          startDate={startDate}
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
                    <Button
                      variant="primary"
                      onClick={() => setExportModelShow(true)}
                    >
                      Export
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal show={exportmodelshow} onHide={setExportModelShow}>
        <>
          <Modal.Header>
            <Modal.Title>Export</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setExportModelShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                {columns.map((col) => (
                  <li key={col.name}>
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleColumnToggle(col.name)}
                      />
                      {col.name}
                    </label>
                  </li>
                ))}
              </ul>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePrint}>
              Print
            </Button>
            &nbsp;
            <Button variant="primary" onClick={exportToPDF}>
              PDF
            </Button>
            &nbsp;
            {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : players} headers={selectedColumns.lenght > 0 ? selectedColumns : headers}>Save CSV</CSVLink> */}
            <CSVLink
              varient="primary"
              class="btn btn-primary"
              data={csvData[0].length === 0 ? exportData : csvData}
              headers={csvData[0].length === 0 ? headers : ""}
            >
              Save CSV
            </CSVLink>
            {/* <button varient="primary" class="btn btn-primary" onClick={handleCSV}>Save CSV</button> */}
            &nbsp;
            <button
              varient="primary"
              class="btn btn-primary"
              onClick={handleDownloadExcel}
            >
              Save Excel
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={modelshow}>
        <>
          <Modal.Header>
            <Modal.Title>Gauillet Florence</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModelShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Form.Label>Name : Gauillet </Form.Label>
              <Form.Label>Surname : Florence</Form.Label>
              <Form.Label>Nickname : Pikachu</Form.Label>
              <Form.Label>Street and number : Perolles d'en Haut 16</Form.Label>
              <Form.Label>ZIP and City : 1752 Villars-sur-Glane</Form.Label>
              <Form.Label>Birthdate : 11.04.2023</Form.Label>
              <Form.Label>
                E-Mail Address : Susheel_Arora66@gmail.com
              </Form.Label>
              <Form.Label>Phone Number : +41 079 365 03 54</Form.Label>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModelShow(false)}>
              Close
            </Button>
            <Button variant="primary">Save Excel</Button>
            <Button variant="primary">Print</Button>
            <Button variant="primary">Statistics</Button>
          </Modal.Footer>
        </>
      </Modal>
      {isLoading && <LogoAnimationLoader />}
    </>
  );
};

export default PlayersStatistics;
