import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { formatPhoneNumber } from "../../../../utils";

const css = `
  .print-pdf table th::before,
  .print-pdf table th::after,
  .print-pdf table td::before,
  .print-pdf table td::after {
    content: '';
    height: 4px;
    display: block;

    page-break-before: always !important;
    page-break-inside: avoid !important;
    break-after: always !important;
    page-break-after: always !important;

  }
`;

const ExportModal = ({ show, onHide, tournament }) => {
  const pdfRef = useRef(null);

  const [exportTitle, setExportTitle] = useState("");
  const [isExportTournamentInfo, setIsExportTournamentInfo] = useState(false);
  const [csvHeader, setCSVHeader] = useState([]);
  const [csvData, setCSVData] = useState([]);

  const displayOptions = {
    public_nic: "Full Name",
    private: "Nickname",
    anonymous: "Anonymous",
  };
  const exportPlayersFields = [
    { label: "Name", key: "firstname" },
    { label: "Surname", key: "lastname" },
    { label: "Nickname", key: "nickname" },
    { label: "Phone", key: "phone" },
    { label: "E-mail", key: "email" },
    { label: "Birthdate", key: "dob" },
    { label: "Street", key: "street" },
    { label: "Zipcode", key: "zipcode" },
    { label: "City", key: "city" },
    { label: "Visibility", key: "displayoption" },
    { label: "Membership", key: "membership" },
    { label: "Registration Date", key: "created" },
    { label: "Late Arrival", key: "lateannouncement" },
  ];
  const [selectedFields, setSelectedFields] = useState([
    "firstname",
    "lastname",
    "nickname",
    "phone",
    "email",
    "dob",
    "street",
    "zipcode",
    "city",
    "displayoption",
    "membership",
    "created",
    "lateannouncement",
  ]);

  useEffect(() => {
    console.log("tournament", tournament);
    if (!show) return;

    setSelectedFields([
      "firstname",
      "lastname",
      "nickname",
      "phone",
      "email",
      "dob",
      "street",
      "zipcode",
      "city",
      "displayoption",
      "membership",
      "created",
      "lateannouncement",
    ]);
  }, [show]);

  useEffect(() => {
    if (!tournament?.title) return;

    setExportTitle(
      `${tournament.room.title} - ${tournament.title} - ${moment(
        tournament.detail.startday
      ).format("DD.MM.YYYY HH:mm")}`
    );
  }, [tournament]);

  // make csv data
  const handleMakeCSVData = (e, done) => {
    if (selectedFields?.length < 1) return;

    const header = exportPlayersFields.filter((field) =>
      selectedFields.includes(field.key)
    );

    const players = (tournament?.registered?.data || []).concat(
      tournament?.waiting?.data || []
    );
    const data = players.map((player) => {
      const excelPlayer = {};
      header.map((field) => {
        excelPlayer[field.key] = getTableCell(player, field.key);
      });
      return excelPlayer;
    });

    setCSVHeader(header);
    setCSVData(data);
    setTimeout(() => {
      done(true);
    }, 100);
  };

  const handlePDFTournament = () => {
    if (!pdfRef?.current) return;
    console.log(pdfRef.current);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
    });

    pdfRef.current.style.display = "block";
    doc.html(pdfRef.current, {
      callback: (doc) => {
        doc.save(`${exportTitle}.pdf`);
        pdfRef.current.style.display = "none";
      },
      x: 10,
      y: 10,
      width: 1600,
      windowWidth: 1920,
    });
  };

  const handlePrintTournament = useReactToPrint({
    content: () => pdfRef.current,
    onBeforeGetContent: () => (pdfRef.current.style.display = "block"),
    onAfterPrint: () => (pdfRef.current.style.display = "none"),
    onPrintError: () => (pdfRef.current.style.display = "none"),
  });

  const handleTournamentExcel = () => {
    const wb = XLSX.utils.book_new();

    if (isExportTournamentInfo) {
      const wsTournament = XLSX.utils.json_to_sheet(
        [
          [exportTitle],
          ["Buy-in", tournament.detail.buyin],
          ["Late Reg", formatLateReg(tournament.detail)],
          ["Bounty", tournament.detail.bounty],
          ["Type", tournament.detail.type],
          ["Rake", tournament.detail.rake],
          ["Dealers", tournament.detail.dealertype],
          ["Max Number of re-entries", tournament.detail.maxreentries],
          ["Starting Stack", tournament.detail.startingstack],
          ["Rake of re-entries", tournament.detail.reentriesrake],
          ["Level Duration", tournament.detail.level_duration],
          ["Max Number of players", tournament.detail.maxplayers],
          ["Reserved places", tournament.detail.reservedplayers],
          ["Registered players", tournament.registered.total],
          ["Waiting list", tournament.waiting.total],
        ],
        { skipHeader: true }
      );

      XLSX.utils.book_append_sheet(wb, wsTournament, "Tournament");
    }

    if (selectedFields.length > 0) {
      const labels = {};
      selectedFields.map((fieldKey) => {
        const field = exportPlayersFields.find(
          (field) => field.key === fieldKey
        );
        labels[field.key] = field.label;
      });

      const registeredPlayers = (tournament.registered.data || []).map(
        (player) => {
          const excelPlayer = {};
          selectedFields.map((fieldKey) => {
            excelPlayer[labels[fieldKey]] = getTableCell(player, fieldKey);
          });
          return excelPlayer;
        }
      );
      const wsRegistered = XLSX.utils.json_to_sheet(registeredPlayers);
      XLSX.utils.book_append_sheet(wb, wsRegistered, "Registered Players");

      const waitingList = (tournament.waiting.data || []).map((player) => {
        const excelPlayer = {};
        selectedFields.map((fieldKey) => {
          excelPlayer[labels[fieldKey]] = getTableCell(player, fieldKey);
        });
        return excelPlayer;
      });
      const wsWaiting = XLSX.utils.json_to_sheet(waitingList);
      XLSX.utils.book_append_sheet(wb, wsWaiting, "Waiting List");
    }
    XLSX.writeFile(wb, `${exportTitle}.xlsx`);
  };

  const handleToggleFields = (fieldKey) => {
    setSelectedFields((prev) => {
      const index = prev.indexOf(fieldKey);

      if (index > -1) {
        prev.splice(index, 1);
      } else {
        prev.push(fieldKey);
      }
      return [...prev];
    });
  };

  const formatLateReg = (tournamentDetail) => {
    let lateReg = "-";
    if (!tournamentDetail) return lateReg;

    const { lateregformat, latereground, lateregtime } = tournamentDetail;

    switch (lateregformat) {
      case "round":
        lateReg = `Round ${latereground}`;
        break;
      case "time":
        lateReg = moment(lateregtime, "HH:mm:ss").format("HH:mm");
        break;
      default:
        lateReg = "-";
        break;
    }
    return lateReg;
  };

  const getTableCell = (player, fieldKey) => {
    let value = "";
    switch (fieldKey) {
      case "phone":
        value = `${formatPhoneNumber(player.phonecode, player.phonenumber)}`;
        break;
      case "dob":
        value = player?.dob ? moment(player.dob).format("DD.MM.YYYY") : "";
        break;
      case "created":
        value = player?.created
          ? moment(player.created).format("DD.MM.YYYY HH:mm")
          : "";
        break;
      case "membership":
        value =
          player?.membership && player.membership !== "-"
            ? moment(player.membership).format("DD.MM.YYYY")
            : "-";
        break;
      case "late":
        value = player?.lateannouncement
          ? moment(player.lateannouncement).format("HH:mm")
          : "";
        break;
      case "displayoption":
        value = displayOptions?.[player?.[fieldKey]] || "-";
        break;
      default:
        value = player?.[fieldKey] || "";
        break;
    }
    // { label: "E-mail", key: "email" },
    return value;
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={onHide}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <ul className="list-unstyled">
              <li>
                <label className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() =>
                      setIsExportTournamentInfo(!isExportTournamentInfo)
                    }
                    checked={isExportTournamentInfo}
                  />
                  Tournament Info
                </label>
              </li>
              {exportPlayersFields.map((field) => (
                <li key={field.key}>
                  <label className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={() => handleToggleFields(field.key)}
                      checked={selectedFields.includes(field.key)}
                    />
                    {field.label}
                  </label>
                </li>
              ))}
            </ul>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {/*<Button variant="primary" onClick={handlePrintTournament}>*/}
          {/*  Print*/}
          {/*</Button>*/}
          {/*<Button variant="primary" onClick={handlePDFTournament}>*/}
          {/*  PDF*/}
          {/*</Button>*/}
          <CSVLink
            filename={`${exportTitle}.csv`}
            className="btn btn-primary"
            header={csvHeader}
            data={csvData}
            asyncOnClick
            onClick={handleMakeCSVData}
          >
            CSV
          </CSVLink>
          <button
            varient="primary"
            className="btn btn-primary"
            onClick={handleTournamentExcel}
          >
            Save Excel
          </button>
        </Modal.Footer>
      </Modal>

      {/* tournament PDF export view */}
      {tournament?.title ? (
        <div
          ref={pdfRef}
          className="print-pdf"
          style={{
            color: "black",
            width: "700px",
            fontSize: "10px",
            height: "0px",
            display: "none",
            letterSpacing: "0.01px",
          }}
        >
          {/* tournament title */}
          <h4
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {exportTitle}
          </h4>
          {/* tournament info */}
          {isExportTournamentInfo ? (
            <>
              <Row className="mb-3">
                <Col xs={6}>Buy-in: {tournament.detail.buyin}</Col>
                <Col xs={6}>Late Reg: {formatLateReg(tournament.detail)}</Col>

                <Col xs={6}>Bounty: {tournament.detail.bounty}</Col>
                <Col xs={6}>Type: {tournament.detail.type}</Col>

                <Col xs={6}>Rake: {tournament.detail.rake}</Col>
                <Col xs={6}>Dealers: {tournament.detail.dealertype}</Col>

                <Col xs={6}>
                  Max Number of re-entries: {tournament.detail.maxreentries}
                </Col>
                <Col xs={6}>
                  Starting Stack: {tournament.detail.startingstack}
                </Col>

                <Col xs={6}>
                  Rake of re-entries: {tournament.detail.reentriesrake}
                </Col>
                <Col xs={6}>
                  Level Duration: {tournament.detail.level_duration}
                </Col>
              </Row>
              <div>Max Number of players: {tournament.detail.maxplayers}</div>
              <div>Reserved places: {tournament.detail.reservedplayers}</div>
              <div>Registered players: {tournament.registered.total}</div>
              <div>Waiting list: {tournament.waiting.total}</div>
            </>
          ) : (
            ""
          )}

          {selectedFields.length > 0 ? (
            <>
              {/* registered players */}
              <div style={{ marginTop: "16px" }}>Registered Players:</div>
              {tournament.registered.data?.length > 0 ? (
                <table style={{ fontSize: "8px" }}>
                  <thead>
                    <tr>
                      {selectedFields.map((fieldKey) => (
                        <th
                          key={fieldKey}
                          style={{ border: "1px solid black" }}
                        >
                          {
                            exportPlayersFields.find(
                              (field) => field.key === fieldKey
                            )?.label
                          }
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.registered.data.map((player, i) => (
                      <tr key={i}>
                        {selectedFields.map((fieldKey) => (
                          <td
                            key={fieldKey}
                            style={{ border: "1px solid black" }}
                          >
                            {getTableCell(player, fieldKey)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}

              {/* Waiting List */}
              <div style={{ marginTop: "16px" }}>Waiting List:</div>
              {tournament.waiting.data?.length > 0 ? (
                <table style={{ fontSize: "8px" }}>
                  <thead>
                    <tr>
                      {selectedFields.map((fieldKey) => (
                        <th
                          key={fieldKey}
                          style={{ border: "1px solid black" }}
                        >
                          {
                            exportPlayersFields.find(
                              (field) => field.key === fieldKey
                            )?.label
                          }
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.waiting.data.map((player, i) => (
                      <tr key={i}>
                        {selectedFields.map((fieldKey) => (
                          <td
                            key={fieldKey}
                            style={{ border: "1px solid black" }}
                          >
                            {getTableCell(player, fieldKey)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <style>{css}</style>
    </>
  );
};

export default ExportModal;
