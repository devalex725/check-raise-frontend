import React, { useEffect, useState, useMemo, useRef } from "react";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import { Link, useNavigate } from "react-router-dom";
import MultiRangeSlider from "../../../components/MultiRangeSlider/MultiRangeSlider";
import { useTranslation } from "react-i18next";
import TournamentService from "../../../api/services/TournamentService";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import customStyle from "../../Admin/customstyle";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import DuplicateModal from "./components/DuplicateModal";
import SendEmailModal from '../../../components/Manager/SendEmailModal';
import ExportModal from "./components/ExportModal";
import DeleteFinishedTournamentsModal from "./components/DeleteFinishedTournamentsModal";

const AllTournaments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState([]);
  const [finishTournament, setFinishTournament] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [deleteFinishedModalOpen, setDeleteFinishedModalOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [max, setMax] = useState(300);
  const [min, setMin] = useState(0);
  const [searchStr, setSearchStr] = useState("");

  const [filteredList, setFilteredList] = new useState([]);
  const [filteredFinishList, setFilteredFinishList] = new useState([]);

  const [modalMessage, setModalMessage] = useState("");
  const [startDate, setStartDate] = useState(
    // setHours(setMinutes(new Date(), 0), 0)
    null,
  );
  const [endDate, setEndDate] = useState(
    // setHours(setMinutes(new Date(), 59), 23)
    null,
  );
  const [exportModalShow, setExportModalShow] = useState(false);
  const [exportModalShow1, setExportModalShow1] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [singleExportModalShow, setSingleExportModalShow] = useState(false);
  const [exportTournament, setExportTournament] = useState(null);

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [duplicateModalShow, setDuplicateModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrint1 = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleInput = (e, max) => {
    setMax(max);
    setMin(e);
  };
  const userIndexApi = async () => {
    try {
      const responseData = await TournamentService.user().json();

      setIsLoading(false);

      if (!responseData || !responseData.data) {
        return;
      }

      // const finishedTournaments = responseData.data.filter(
      //   (item) => new Date(item.detail && item.detail.startday) <= new Date()
      // );
      // const newTournaments = responseData.data.filter(
      //   (item) => new Date() <= new Date(item.detail && item.detail.startday)
      // );
      const newTournaments = [];
      const finishedTournaments = [];

      // considered as finished at 8:00.
      const finishDateTime = moment().hour(8).minute(0);

      responseData.data.map((item) => {
        const startDay = moment(item.detail?.startday);

        if (finishDateTime.isBefore(startDay)) {
          newTournaments.push(item);
        } else {
          finishedTournaments.push({ ...item, finished: true });
        }
      });

      const sortedFinished = [...finishedTournaments].sort((a, b) =>
        new Date(a.detail && a.detail.startday) >
        new Date(b.detail && b.detail.startday)
          ? -1
          : 1,
      );

      const sortedNext = [...newTournaments].sort((a, b) =>
        new Date(a.detail && a.detail.startday) >
        new Date(b.detail && b.detail.startday)
          ? 1
          : -1,
      );

      setFinishTournament(sortedFinished);
      setFilteredFinishList(sortedFinished);
      setTournament(sortedNext);
      setFilteredList(sortedNext);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (localStorage.getItem("usertype") === "Room Manager") {
      userIndexApi();
    } else {
      navigate("/");
    }
  }, []);

  const updateTournamentStatus = async (tournamentId, status) => {
    const postData = {
      id: tournamentId,
      status: status,
    };
    try {
      setIsLoading(true);
      const responseData = await TournamentService.updateTournamentStatus(
        postData,
      ).json();

      if (responseData.status === true) {
        userIndexApi();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const customSortFunction = (rowA, rowB, column) => {
    let a = "";
    let b = "";

    switch (column) {
      case "startday":
        a = moment(rowA.detail.startday);
        b = moment(rowB.detail.startday);
        break;
      case "buyin":
        a = rowA.detail.buyin + rowA.detail.bounty;
        b = rowB.detail.buyin + rowB.detail.bounty;
        break;
      case "players":
        a = rowA.players.registered + rowA.detail.reservedplayers;
        b = rowB.players.registered + rowB.detail.reservedplayers;
        break;

      default:
        a = rowA[column].toLowerCase();
        b = rowB[column].toLowerCase();
        break;
    }

    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => (
          <Link
            style={{ color: "inherit" }}
            to={`/tournaments/${row.room.slug}/${row.slug}`}
          >
            {row.title}
          </Link>
        ),
        sortable: true,
        sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "title"),
      },
      {
        name: "Date",
        selector: (row) =>
          row.detail?.startday ? (
            <>
              {t("currentdate", {
                date: new Date(row.detail.startday),
              })}{" "}
              {moment(row.detail.startday).format("DD.MM.YYYY HH:mm")}
            </>
          ) : (
            "-"
          ),
        sortable: true,
        sortFunction: (rowA, rowB) =>
          customSortFunction(rowA, rowB, "startday"),
      },
      {
        name: "Buy-in",
        selector: (row) =>
          row.detail
            ? row.detail.buyin +
            "+" +
            (row.detail.bounty || 0) +
            "+" +
            row.detail.rake
            : "",
        sortable: true,
        sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "buyin"),
      },
      {
        name: "Players",
        selector: (row) =>
          row.detail
            ? `${row.players.registered + row.detail.reservedplayers}/${
              row.detail.maxplayers
            } (Res: ${row.detail.reservedplayers}) / WL: ${
              row.players.waiting
            }`
            : "",
        sortable: true,
        sortFunction: (rowA, rowB) => customSortFunction(rowA, rowB, "players"),
      },
      {
        name: "Action",
        cell: (row) => (
          <div>
            <Link
              className="action-link blue-link mb-1"
              onClick={() => {
                setDuplicateModalShow(true);
                setSelectedTournament(row);
              }}
            >
              Duplicate
            </Link>
            <Link
              className="action-link green-link mb-1"
              to={`/manager/editTournament/${row.slug}`}
            >
              Edit
            </Link>
            <Link
              className="action-link red-link mb-1"
              onClick={() => {
                deleteTournament(row.id);
              }}
            >
              Delete
            </Link>
            {row.finished ? (
              <span className="action-link mb-1 gray-link pe-none">
                Publish
              </span>
            ) : (
              <>
                {row.room?.status === 1 &&
                row.room?.expiry &&
                moment(row.room?.expiry).isSameOrAfter(
                  moment(row.detail.startday),
                  "day",
                ) ? (
                  <Link
                    className={`action-link mb-1 ${
                      row.status === 0 ? "green-link" : "gray-link"
                    }`}
                    onClick={() => {
                      updateTournamentStatus(row.id, row.status === 0 ? 1 : 0);
                    }}
                  >
                    {row.status === 0 ? "Publish" : "Undo Publish"}
                  </Link>
                ) : (
                  <span className="action-link mb-1 gray-link pe-none">
                    Publish unavailable
                  </span>
                )}
              </>
            )}
            <Link
              className={`action-link mb-1 ${
                row.closed === 0 ? "info-link" : "gray-link"
              }`}
              to={`/manager/checkin-tournament/${row.id}`}
            >
              {row.closed === 0 ? "Checkin" : "Undo Checkout"}
            </Link>

            <Link
              className="action-link badge badge-primary mb-1"
              onClick={() => handleOpenSingleExportModal(row.id)}
            >
              Export
            </Link>
            <Link
              className="action-link pink-link mb-1"
              onClick={() => {
                setEmailModalShow(true);
                setSelectedTournament(row);
              }}
            >
              Send E-mail
            </Link>
            {row.finished ? (
              ""
            ) : (
              <Link
                className="action-link yellow-link mb-1"
                to={`/manager/addpremium-tournament?id=${row.id}`}
              >
                Premium Tournament
              </Link>
            )}
          </div>
        ),
      },
    ],
    [],
  );
  const deleteTournament = async (tournamentId) => {
    setDeleteId(tournamentId);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      const responseData = await TournamentService.destroy(deleteId).json();
      if (responseData.status === true) setDeleteModal(false);
      setDeleteSuccess(true);

      setModalMessage(responseData.message);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleChangeSearch = (event) => {
    setSearchStr(event.target.value);
  };

  useEffect(() => {
    console.log("searchStr", searchStr);

    filterBySearch();
  }, [searchStr]);

  const [searchParam] = useState(["title"]);
  const filterBySearch = () => {
    const query = (searchStr || "").trim();

    let updatedList = [...tournament];
    let updatedWaitingList = [...finishTournament];

    if (!query) {
      setFilteredList(updatedList);
      setFilteredFinishList(updatedWaitingList);
    }

    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return item[newItem].toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    });

    setFilteredList(updatedList);

    updatedWaitingList = updatedWaitingList.filter((item) => {
      return searchParam.some((newItem) => {
        return item[newItem].toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    });

    setFilteredFinishList(updatedWaitingList);
  };

  const handleResetSearch = () => {
    // setStartDate(setHours(setMinutes(new Date(), 0), 0));
    // setEndDate(setHours(setMinutes(new Date(), 59), 23));
    setStartDate(null);
    setEndDate(null);
    setMin(0);
    setMax(300);

    if (searchStr) {
      setSearchStr("");
    } else {
      setFilteredList([...tournament]);
      setFilteredFinishList([...finishTournament]);
    }
  };

  const handleSearch = () => {
    let updatedList = [...tournament];
    let updatedWaitingList = [...finishTournament];
    const mStartDate = moment(startDate).startOf("day");
    const mEndDate = moment(endDate).endOf("day");

    if (startDate) {
      updatedList = updatedList.filter(
        (row) =>
          row.detail && moment(row.detail.startday).isSameOrAfter(mStartDate),
      );
    }
    if (endDate) {
      updatedList = updatedList.filter(
        (row) =>
          row.detail && moment(row.detail.startday).isSameOrBefore(mEndDate),
      );
    }

    updatedList = updatedList.filter((element) => {
      return element.detail
        ? min <= element.detail.buyin && max >= element.detail.buyin
        : false;
    });
    setFilteredList(updatedList);

    if (startDate) {
      updatedWaitingList = updatedWaitingList.filter(
        (row) =>
          row.detail && moment(row.detail.startday).isSameOrAfter(mStartDate),
      );
    }
    if (endDate) {
      updatedWaitingList = updatedWaitingList.filter(
        (row) =>
          row.detail && moment(row.detail.startday).isSameOrBefore(mEndDate),
      );
    }
    updatedWaitingList = updatedWaitingList.filter((element) => {
      return element.detail && element.detail.buyin
        ? min <= element.detail.buyin && max >= element.detail.buyin
        : false;
    });
    setFilteredFinishList(updatedWaitingList);
  };

  const headers = [
    { label: "Name", key: "Name" },
    { label: "Date", key: "Date" },
    { label: "Buy-in", key: "Buy-in" },
    { label: "Players", key: "Players" },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }

    const tableData = tournament.map((row) => [
      row.title,
      row.detail.startday,
      row.detail.buyin + "+" + row.detail.bounty + "+" + row.detail.rake,
      row.players.registered +
      row.detail.reservedplayers +
      "/" +
      row.detail.maxplayers,
    ]);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
    doc.save("player-statistics.pdf");
  };
  const exportToPDF1 = () => {
    const doc = new jsPDF();
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }

    const tableData = finishTournament.map((row) => [
      row.title,
      row.detail.startday,
      row.detail.buyin + "+" + row.detail.bounty + "+" + row.detail.rake,
      row.players.registered +
      row.detail.reservedplayers +
      "/" +
      row.detail.maxplayers,
    ]);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
    doc.save("player-statistics.pdf");
  };
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

    const tableData = tournament.map((row) =>
      newdata.map((nw, i) => [
        nw === "Name" ? row.title : "",
        nw === "Date" ? row.detail.startday : "",
        nw === "Buy-in"
          ? row.detail.buyin + "+" + row.detail.bounty + "+" + row.detail.rake
          : "",
        nw === "Players"
          ? row.players.registered +
          row.detail.reservedplayers +
          "/" +
          row.detail.maxplayers
          : "",
      ]),
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
  const handleDownloadExcel1 = () => {
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = finishTournament.map((row) =>
      newdata.map((nw, i) => [
        nw === "Name" ? row.title : "",
        nw === "Date" ? row.detail.startday : "",
        nw === "Buy-in"
          ? row.detail.buyin + "+" + row.detail.bounty + "+" + row.detail.rake
          : "",
        nw === "Players"
          ? row.players.registered +
          row.detail.reservedplayers +
          "/" +
          row.detail.maxplayers
          : "",
      ]),
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
  };

  const csvData = [
    selectedColumns,
    ...tournament.map((row) => [
      ...selectedColumns.map((nw, i) => {
        return [
          nw === "Name" ? row.title : "",
          nw === "Date" ? row.detail.startday : "",
          nw === "Buy-in"
            ? row.detail.buyin + "+" + row.detail.bounty + "+" + row.detail.rake
            : "",
          nw === "Players"
            ? row.players.registered +
            row.detail.reservedplayers +
            "/" +
            row.detail.maxplayers
            : "",
        ];
      }),
      // [ ,nw === "Surname" ? ])
    ]),
  ];

  //export single
  const handleOpenSingleExportModal = async (id) => {
    setSingleExportModalShow(true);
    const responseData = await TournamentService.checkInTournament(id).json();
    setExportTournament(responseData.data);
  };

  const handleOpenDeleteFinishedModal = () => {
    setDeleteFinishedModalOpen(true);
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
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                {t("page.myprofile.myprofilenav.All tournaments.Tournaments")}
              </Card.Header>
              <Card.Body>
                <Form className="static">
                  <Row>
                    {/* <Col md={3}>
                      <Form.Group className="mb-1 mb-lg-4 form-group" controlId="">
                        <Form.Label>{t('page.myprofile.myprofilenav.RoomStatistics.Date')}</Form.Label>
                        {/* https://reactdatepicker.com/ */}
                    {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                      </Form.Group>

                    </Col> */}
                    <Col md={3} className="without-date-calander">
                      <Form.Group
                        className="mb-1 mb-lg-4 form-group"
                        controlId=""
                      >
                        <Form.Label>
                          {t(
                            "page.myprofile.myprofilenav.RoomStatistics.StartDate",
                          )}
                        </Form.Label>
                        {/* https://reactdatepicker.com/ */}
                        {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}  dateFormat="dd.MM.yyyy"/> */}
                        <DatePicker
                          selectsStart
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          startDate={startDate}
                          //showTimeSelect
                          //timeFormat="HH:mm"
                          injectTimes={[
                            setHours(setMinutes(new Date(), 1), 0),
                            setHours(setMinutes(new Date(), 5), 12),
                            setHours(setMinutes(new Date(), 59), 23),
                          ]}
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
                            "page.myprofile.myprofilenav.RoomStatistics.EndDate",
                          )}
                        </Form.Label>

                        <DatePicker
                          selectsEnd
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          endDate={endDate}
                          //showTimeSelect
                          //timeFormat="HH:mm"
                          injectTimes={[
                            setHours(setMinutes(new Date(), 1), 0),
                            setHours(setMinutes(new Date(), 5), 12),
                            setHours(setMinutes(new Date(), 59), 23),
                          ]}
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
                            "page.myprofile.myprofilenav.RoomStatistics.Buy-In",
                          )}
                        </Form.Label>
                        <MultiRangeSlider
                          min={0}
                          max={300}
                          defaultMinValue={min}
                          defaultMaxValue={max}
                          onChange={({ min, max }) => handleInput(min, max)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="form-group text-end" controlId="">
                        <Form.Label className="d-block">&nbsp;</Form.Label>
                        <div className="d-flex flex-column align-items-center gap-3">
                          <Button variant="primary" onClick={handleSearch}>
                            {t(
                              "page.myprofile.myprofilenav.RoomStatistics.Search",
                            )}
                          </Button>
                          <Button variant="success" onClick={handleResetSearch}>
                            {t("Show all")}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Link
                        className="btn btn-primary"
                        to="/manager/addTournament"
                        role="button"
                      >
                        {t(
                          "page.myprofile.myprofilenav.All tournaments.Addtournament",
                        )}
                      </Link>
                    </Col>
                  </Row>
                </Form>
                <Row className="my-3">
                  <Col md={6}></Col>
                  <Col md={6} className="text-end">
                    <Form.Group
                      className="mb-5 form-group text-end d-flex align-items-center justify-content-end p-0"
                      controlId=""
                    >
                      <Form.Label className="d-block me-2">Search :</Form.Label>

                      <Form.Control
                        type="text"
                        className="player-statistics-search"
                        onChange={handleChangeSearch}
                        value={searchStr}
                        readOnly={deleteFinishedModalOpen} // to prevent autofill email
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h3>Next Tournaments:</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} ref={componentRef}>
                    <DataTable
                      data={filteredList}
                      columns={columns}
                      theme="dark"
                      selectableRowsComponentProps={{ inkDisabled: true }}
                      pagination
                      customStyles={customStyle}
                      paginationPerPage={100}
                      paginationComponentOptions={paginationComponentOptions}
                      paginationRowsPerPageOptions={[10, 50, 100]}
                    />
                  </Col>
                  <Col md={12} className="text-end">
                    <Button
                      variant="primary"
                      onClick={() => setExportModalShow(true)}
                    >
                      Export
                    </Button>
                  </Col>
                </Row>

                <div className="d-lg-flex align-items-center">
                  <h3>Finished Tournaments:</h3>
                  <Button
                    variant="secondary"
                    className="ms-lg-5"
                    onClick={handleOpenDeleteFinishedModal}
                    disabled={!finishTournament || finishTournament?.length < 1}
                  >
                    Delete all finished tournaments
                  </Button>
                </div>
                <DataTable
                  data={filteredFinishList}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  // defaultSortFieldId={1}

                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  // defaultSort
                />
                <Col md={12} className="text-end">
                  <Button
                    variant="primary"
                    onClick={() => setExportModalShow1(true)}
                  >
                    Export
                  </Button>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader/>}
      <Modal show={deleteModal}>
        <>
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setDeleteModal(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete tournament?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteUser()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={deleteSuccess}>
        <Modal.Header>
          <Modal.Title>Deleted</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true);
              userIndexApi();
              // setdeleteModal(false)
              setDeleteSuccess(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={exportModalShow} onHide={setExportModalShow}>
        <>
          <Modal.Header>
            <Modal.Title>Export</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setExportModalShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                {headers.map((col) => (
                  <li key={col.label}>
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleColumnToggle(col.key)}
                      />
                      {col.label}
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
              className="btn btn-primary"
              data={csvData[0].length === 0 ? filteredList : csvData}
              headers={csvData[0].length === 0 ? headers : ""}
            >
              Save CSV
            </CSVLink>
            {/* <button varient="primary" class="btn btn-primary" onClick={handleCSV}>Save CSV</button> */}
            &nbsp;
            <button
              varient="primary"
              className="btn btn-primary"
              onClick={handleDownloadExcel}
            >
              Save Excel
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={exportModalShow1} onHide={setExportModalShow1}>
        <>
          <Modal.Header>
            <Modal.Title>Export</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setExportModalShow1(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                {headers.map((col) => (
                  <li key={col.label}>
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleColumnToggle(col.key)}
                      />
                      {col.label}
                    </label>
                  </li>
                ))}
              </ul>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePrint1}>
              Print
            </Button>
            &nbsp;
            <Button variant="primary" onClick={exportToPDF1}>
              PDF
            </Button>
            &nbsp;
            {/* <CSVLink varient="primary" class="btn btn-primary" data={exportData ? exportData : players} headers={selectedColumns.lenght > 0 ? selectedColumns : headers}>Save CSV</CSVLink> */}
            <CSVLink
              varient="primary"
              className="btn btn-primary"
              data={csvData[0].length === 0 ? filteredFinishList : csvData}
              headers={csvData[0].length === 0 ? headers : ""}
            >
              Save CSV
            </CSVLink>
            {/* <button varient="primary" class="btn btn-primary" onClick={handleCSV}>Save CSV</button> */}
            &nbsp;
            <button
              varient="primary"
              className="btn btn-primary"
              onClick={handleDownloadExcel1}
            >
              Save Excel
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <ExportModal
        show={singleExportModalShow}
        onHide={() => {
          setSingleExportModalShow(false);
        }}
        tournament={exportTournament}
      />

      <DuplicateModal
        show={duplicateModalShow}
        onHide={(isSubmit) => {
          setDuplicateModalShow(false);
          setSelectedTournament(null);

          if (isSubmit) {
            userIndexApi();
          }
        }}
        tournament={selectedTournament}
      />
      <SendEmailModal
        show={emailModalShow}
        onHide={() => {
          setEmailModalShow(false);
          setSelectedTournament(null);
        }}
        emailData={{ name: 'manager', tournamentId: selectedTournament?.id, roomTitle: selectedTournament?.room?.title }}
      />
      <DeleteFinishedTournamentsModal
        show={deleteFinishedModalOpen}
        onHide={isSubmit => {
          setDeleteFinishedModalOpen(false);

          if(isSubmit) {
            userIndexApi();
          }
        }}
      />
    </>
  );
};

export default AllTournaments;
